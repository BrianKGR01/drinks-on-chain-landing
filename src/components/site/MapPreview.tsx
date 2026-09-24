import type { VillageSpec } from "@/lib/scene-contract";
import { buildMapPrimitives } from "@/lib/map-geometry";

/**
 * Static ink drawing of a village as SVG (for cards and thumbnails).
 * For anything animated use MapCanvas instead: SVG with pattern fills is
 * expensive to repaint.
 */
interface MapPreviewProps {
  village: VillageSpec;
  className?: string;
  margin?: number;
  detail?: boolean;
  title?: string;
}

export function MapPreview({ village, className, margin = 60, detail = true, title }: MapPreviewProps) {
  const p = buildMapPrimitives(village, detail);
  const E = p.extent + margin;
  const id = `mp-${village.id}`;
  const poly = (pts: Array<[number, number]>) => pts.map(([x, z]) => `${x},${z}`).join(" ");

  return (
    <svg
      viewBox={`${-E} ${-E} ${2 * E} ${2 * E}`}
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <defs>
        {p.parcels.map((pc) => (
          <pattern key={pc.id} id={`${id}-${pc.id}`} width="9" height="9" patternUnits="userSpaceOnUse" patternTransform={`rotate(${pc.rot})`}>
            <line x1="0" y1="0" x2="0" y2="9" stroke="currentColor" strokeWidth="0.9" opacity="0.7" />
          </pattern>
        ))}
      </defs>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        {p.rings.map((r, i) => (
          <ellipse key={i} cx={0} cy={0} rx={r.rx} ry={r.ry} strokeWidth="0.6" opacity={r.opacity} />
        ))}
        {p.river ? (
          <>
            <polyline points={poly(p.river)} strokeWidth="2.2" opacity="0.35" />
            <polyline points={poly(p.river)} strokeWidth="0.8" opacity="0.8" transform="translate(0,4)" />
            <polyline points={poly(p.river)} strokeWidth="0.8" opacity="0.8" transform="translate(0,-4)" />
          </>
        ) : null}
        {p.roads.map((r, i) => (
          <g key={i}>
            <polyline points={poly(r)} strokeWidth="3.2" stroke="var(--paper)" opacity="0.9" />
            <polyline points={poly(r)} strokeWidth="1.1" opacity="0.85" />
          </g>
        ))}
        {p.parcels.map((pc) => (
          <g key={pc.id} transform={`translate(${pc.cx} ${pc.cz}) rotate(${pc.rot})`}>
            <rect x={-pc.w / 2} y={-pc.d / 2} width={pc.w} height={pc.d} fill={`url(#${id}-${pc.id})`} stroke="none" />
            <rect x={-pc.w / 2} y={-pc.d / 2} width={pc.w} height={pc.d} strokeWidth="1.3" />
          </g>
        ))}
        {p.houses.map((h, i) => (
          <rect key={`h${i}`} x={-h.w / 2} y={-h.d / 2} width={h.w} height={h.d} strokeWidth="0.9" fill="var(--paper)" transform={`translate(${h.x} ${h.z}) rotate(${h.r})`} />
        ))}
        {p.trees.map((t, i) => (
          <circle key={`t${i}`} cx={t.x} cy={t.z} r={t.r} strokeWidth="0.7" opacity="0.75" />
        ))}
        {p.churches.map((c, i) => (
          <g key={`c${i}`} transform={`translate(${c.x} ${c.z})`} strokeWidth="1.2">
            <line x1="0" y1="-14" x2="0" y2="8" />
            <line x1="-5" y1="-8" x2="5" y2="-8" />
          </g>
        ))}
      </g>
    </svg>
  );
}
