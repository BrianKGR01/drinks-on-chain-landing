"use client";

import { useEffect, useRef } from "react";
import type { VillageSpec } from "@/lib/scene-contract";
import { buildMapPrimitives, type MapPrimitives } from "@/lib/map-geometry";

/**
 * Static ink drawing of a village (cards and thumbnails).
 *
 * Drawn once onto a canvas, with the same strokes as the former SVG version
 * (widths in world units, hatched parcels, paper-backed roads and houses):
 * a detailed village is ~1,500 shapes, which as SVG meant as many DOM nodes
 * to hydrate, lay out and repaint. The canvas is drawn only when it comes
 * near the viewport, and redrawn when its size changes.
 */
interface MapPreviewProps {
  village: VillageSpec;
  className?: string;
  margin?: number;
  detail?: boolean;
  /** Accessible name; without it the drawing is decorative. */
  title?: string;
}

export function MapPreview({ village, className, margin = 60, detail = true, title }: MapPreviewProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const prims = buildMapPrimitives(village, detail);

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const size = Math.round(rect.width * dpr);
      if (canvas.width !== size || canvas.height !== size) {
        canvas.width = size;
        canvas.height = size;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const style = getComputedStyle(canvas);
      const ink = style.color || "#000";
      const paper = style.getPropertyValue("--paper").trim() || "#fdfcf5";
      const E = prims.extent + margin;
      paint(ctx, prims, size / (2 * E), size / 2, ink, paper);
    };

    let drawn = false;
    const ro = new ResizeObserver(() => {
      if (drawn) draw();
    });
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        drawn = true;
        draw();
        ro.observe(canvas);
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(canvas);
    return () => {
      io.disconnect();
      ro.disconnect();
    };
  }, [village, margin, detail]);

  return (
    <canvas
      ref={ref}
      className={className}
      style={{ aspectRatio: "1", width: "100%" }}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    />
  );
}

/** Same drawing as the SVG it replaces: every width is in world units. */
function paint(c: CanvasRenderingContext2D, p: MapPrimitives, scale: number, centre: number, ink: string, paper: string) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.clearRect(0, 0, c.canvas.width, c.canvas.height);
  c.setTransform(scale, 0, 0, scale, centre, centre);
  c.lineCap = "round";
  c.lineJoin = "round";
  c.strokeStyle = ink;

  const stroke = (width: number, alpha = 1, colour = ink) => {
    c.lineWidth = width;
    c.globalAlpha = alpha;
    c.strokeStyle = colour;
    c.stroke();
    c.globalAlpha = 1;
    c.strokeStyle = ink;
  };
  const line = (pts: Array<[number, number]>, dz = 0) => {
    c.beginPath();
    pts.forEach(([x, z], i) => (i === 0 ? c.moveTo(x, z + dz) : c.lineTo(x, z + dz)));
  };

  for (const r of p.rings) {
    c.beginPath();
    c.ellipse(0, 0, r.rx, r.ry, 0, 0, Math.PI * 2);
    stroke(0.6, r.opacity);
  }
  if (p.river) {
    line(p.river);
    stroke(2.2, 0.35);
    line(p.river, 4);
    stroke(0.8, 0.8);
    line(p.river, -4);
    stroke(0.8, 0.8);
  }
  for (const road of p.roads) {
    line(road);
    stroke(3.2, 0.9, paper);
    line(road);
    stroke(1.1, 0.85);
  }
  for (const pc of p.parcels) {
    c.save();
    c.translate(pc.cx, pc.cz);
    c.rotate((pc.rot * Math.PI) / 180);
    c.beginPath();
    c.rect(-pc.w / 2, -pc.d / 2, pc.w, pc.d);
    c.save();
    c.clip();
    // hatching every 9 units, turned once more by the parcel's angle, as the
    // rotated SVG pattern inside the rotated parcel used to draw it
    c.rotate((pc.rot * Math.PI) / 180);
    c.beginPath();
    const half = Math.hypot(pc.w, pc.d) / 2;
    for (let x = -Math.ceil(half / 9) * 9; x <= half; x += 9) {
      c.moveTo(x, -half);
      c.lineTo(x, half);
    }
    stroke(0.9, 0.7);
    c.restore();
    c.beginPath();
    c.rect(-pc.w / 2, -pc.d / 2, pc.w, pc.d);
    stroke(1.3);
    c.restore();
  }
  c.fillStyle = paper;
  for (const h of p.houses) {
    c.save();
    c.translate(h.x, h.z);
    c.rotate((h.r * Math.PI) / 180);
    c.beginPath();
    c.rect(-h.w / 2, -h.d / 2, h.w, h.d);
    c.fill();
    stroke(0.9);
    c.restore();
  }
  c.beginPath();
  for (const t of p.trees) {
    c.moveTo(t.x + t.r, t.z);
    c.arc(t.x, t.z, t.r, 0, Math.PI * 2);
  }
  stroke(0.7, 0.75);
  c.beginPath();
  for (const ch of p.churches) {
    c.moveTo(ch.x, ch.z - 14);
    c.lineTo(ch.x, ch.z + 8);
    c.moveTo(ch.x - 5, ch.z - 8);
    c.lineTo(ch.x + 5, ch.z - 8);
  }
  stroke(1.2);
}
