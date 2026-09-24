"use client";

import { useEffect, useRef } from "react";
import type { VillageSpec } from "@/lib/scene-contract";
import { buildMapPrimitives } from "@/lib/map-geometry";

interface MapCanvasProps {
  village: VillageSpec;
  className?: string;
  /** Ink colour (CSS colour string). */
  ink?: string;
  /** Draw progressively over this many milliseconds (0 = draw at once). */
  revealMs?: number;
  /** Extra world margin around the extent. */
  margin?: number;
}

type Step = (ctx: CanvasRenderingContext2D) => void;

/**
 * The village drawn once onto a bitmap. Animating this element with CSS
 * transforms costs nothing per frame (it is composited on the GPU), unlike
 * an SVG with hundreds of paths and pattern fills.
 */
export function MapCanvas({ village, className, ink = "#2b2622", revealMs = 2600, margin = 80 }: MapCanvasProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const prims = buildMapPrimitives(village);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let cancelled = false;

    const draw = () => {
      cancelAnimationFrame(raf);
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(rect.width * dpr));
      const h = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // world → pixels: fit the extent (+margin) into the shorter side
      const E = prims.extent + margin;
      const scale = Math.min(w, h) / (2 * E);
      ctx.setTransform(scale, 0, 0, scale, w / 2, h / 2);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = ink;
      const px = 1 / scale; // one device pixel in world units

      const steps: Step[] = [];
      for (const r of prims.rings) {
        steps.push((c) => {
          c.globalAlpha = r.opacity;
          c.lineWidth = 0.7 * px * dpr;
          c.beginPath();
          c.ellipse(0, 0, r.rx, r.ry, 0, 0, Math.PI * 2);
          c.stroke();
          c.globalAlpha = 1;
        });
      }
      if (prims.river) {
        const river = prims.river;
        steps.push((c) => {
          c.lineWidth = 2.4 * px * dpr;
          c.globalAlpha = 0.3;
          polyline(c, river);
          c.globalAlpha = 0.8;
          c.lineWidth = 0.9 * px * dpr;
          polyline(c, river, 0, 4);
          polyline(c, river, 0, -4);
          c.globalAlpha = 1;
        });
      }
      for (const road of prims.roads) {
        steps.push((c) => {
          c.lineWidth = 1.2 * px * dpr;
          c.globalAlpha = 0.85;
          polyline(c, road);
          c.globalAlpha = 1;
        });
      }
      for (const p of prims.parcels) {
        steps.push((c) => {
          c.save();
          c.translate(p.cx, p.cz);
          c.rotate((p.rot * Math.PI) / 180);
          c.beginPath();
          c.rect(-p.w / 2, -p.d / 2, p.w, p.d);
          c.clip();
          c.lineWidth = 0.9 * px * dpr;
          c.globalAlpha = 0.7;
          c.beginPath();
          for (let x = -p.w / 2; x <= p.w / 2; x += 9) {
            c.moveTo(x, -p.d / 2);
            c.lineTo(x, p.d / 2);
          }
          c.stroke();
          c.restore();
          c.save();
          c.translate(p.cx, p.cz);
          c.rotate((p.rot * Math.PI) / 180);
          c.globalAlpha = 1;
          c.lineWidth = 1.4 * px * dpr;
          c.strokeRect(-p.w / 2, -p.d / 2, p.w, p.d);
          c.restore();
        });
      }
      // houses and trees in chunks so the reveal has many small steps
      const chunk = <T,>(arr: T[], size: number, fn: (c: CanvasRenderingContext2D, items: T[]) => void) => {
        for (let i = 0; i < arr.length; i += size) steps.push((c) => fn(c, arr.slice(i, i + size)));
      };
      chunk(prims.houses, 12, (c, items) => {
        c.lineWidth = 0.9 * px * dpr;
        for (const hse of items) {
          c.save();
          c.translate(hse.x, hse.z);
          c.rotate((hse.r * Math.PI) / 180);
          c.clearRect(-hse.w / 2, -hse.d / 2, hse.w, hse.d);
          c.strokeRect(-hse.w / 2, -hse.d / 2, hse.w, hse.d);
          c.restore();
        }
      });
      chunk(prims.trees, 16, (c, items) => {
        c.lineWidth = 0.75 * px * dpr;
        c.globalAlpha = 0.75;
        c.beginPath();
        for (const t of items) {
          c.moveTo(t.x + t.r, t.z);
          c.arc(t.x, t.z, t.r, 0, Math.PI * 2);
        }
        c.stroke();
        c.globalAlpha = 1;
      });
      for (const ch of prims.churches) {
        steps.push((c) => {
          c.lineWidth = 1.3 * px * dpr;
          c.beginPath();
          c.moveTo(ch.x, ch.z - 14);
          c.lineTo(ch.x, ch.z + 8);
          c.moveTo(ch.x - 5, ch.z - 8);
          c.lineTo(ch.x + 5, ch.z - 8);
          c.stroke();
        });
      }

      if (reduced || revealMs <= 0) {
        for (const s of steps) s(ctx);
        return;
      }
      // Progressive reveal: only the new steps are drawn each frame.
      const start = performance.now();
      let done = 0;
      const tick = (now: number) => {
        if (cancelled) return;
        const t = Math.min(1, (now - start) / revealMs);
        const eased = 1 - Math.pow(1 - t, 2);
        const target = Math.floor(eased * steps.length);
        while (done < target) steps[done++](ctx);
        if (done < steps.length) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    draw();
    const ro = new ResizeObserver(() => draw());
    ro.observe(canvas);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [village, ink, revealMs, margin]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}

function polyline(c: CanvasRenderingContext2D, pts: Array<[number, number]>, dx = 0, dz = 0) {
  c.beginPath();
  pts.forEach(([x, z], i) => (i === 0 ? c.moveTo(x + dx, z + dz) : c.lineTo(x + dx, z + dz)));
  c.stroke();
}
