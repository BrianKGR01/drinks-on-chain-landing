import type { VillageSpec } from "@/lib/scene-contract";

/**
 * Lightweight ink drawing of a village generated from the same geometry the
 * WebGL map uses (parcels, roads, river, house clusters, forests). Pure SVG,
 * no runtime cost beyond a few hundred elements.
 */
interface MapPreviewProps {
  village: VillageSpec;
  className?: string;
  /** Extra padding around the extent, in metres. */
  margin?: number;
  /** Draw houses and trees (heavier); off for tiny thumbnails. */
  detail?: boolean;
  title?: string;
}

const r1 = (n: number) => Math.round(n * 10) / 10;

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function MapPreview({ village, className, margin = 60, detail = true, title }: MapPreviewProps) {
  const E = village.extent + margin;
  const rnd = mulberry32(village.seed);
  const id = `mp-${village.id}`;

  const houses: Array<{ x: number; z: number; r: number; w: number; d: number }> = [];
  if (detail) {
    for (const c of village.houses) {
      const n = Math.min(c.count, 220);
      for (let i = 0; i < n; i++) {
        const ang = rnd() * Math.PI * 2;
        const rad = Math.sqrt(rnd()) * c.radius;
        const gx = c.center[0] + Math.cos(ang) * rad;
        const gz = c.center[1] + Math.sin(ang) * rad;
        const snap = c.density > 0.6 ? 14 : 1;
        houses.push({
          x: r1(Math.round(gx / snap) * snap),
          z: r1(Math.round(gz / snap) * snap),
          r: r1(c.density > 0.6 ? (rnd() < 0.5 ? 0 : 90) : rnd() * 180),
          w: r1(6 + rnd() * 5),
          d: r1(5 + rnd() * 4),
        });
      }
    }
  }
  const trees: Array<{ x: number; z: number; r: number }> = [];
  if (detail) {
    for (const f of village.forests) {
      const n = Math.min(f.count, 90);
      for (let i = 0; i < n; i++) {
        const ang = rnd() * Math.PI * 2;
        const rad = Math.sqrt(rnd()) * f.radius;
        trees.push({ x: r1(f.center[0] + Math.cos(ang) * rad), z: r1(f.center[1] + Math.sin(ang) * rad), r: r1(5 + rnd() * 5) });
      }
    }
  }

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
        {village.parcels.map((p) => (
          <pattern
            key={p.id}
            id={`${id}-${p.id}`}
            width="9"
            height="9"
            patternUnits="userSpaceOnUse"
            patternTransform={`rotate(${r1((p.rotation * 180) / Math.PI)})`}
          >
            <line x1="0" y1="0" x2="0" y2="9" stroke="currentColor" strokeWidth="0.9" opacity="0.7" />
          </pattern>
        ))}
      </defs>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        {/* faint contour rings around the rim */}
        {[0.55, 0.68, 0.8, 0.92].map((k, i) => (
          <ellipse
            key={i}
            cx={0}
            cy={0}
            rx={r1(village.extent * k * (village.relief === "canyon" ? 0.45 : 1))}
            ry={r1(village.extent * k)}
            strokeWidth="0.6"
            opacity={0.18 + i * 0.04}
          />
        ))}
        {village.river ? (
          <>
            <polyline points={poly(village.river)} strokeWidth="2.2" opacity="0.35" />
            <polyline points={poly(village.river)} strokeWidth="0.8" opacity="0.8" transform="translate(0,4)" />
            <polyline points={poly(village.river)} strokeWidth="0.8" opacity="0.8" transform="translate(0,-4)" />
          </>
        ) : null}
        {village.roads.map((r, i) => (
          <g key={i}>
            <polyline points={poly(r)} strokeWidth="3.2" stroke="var(--paper)" opacity="0.9" />
            <polyline points={poly(r)} strokeWidth="1.1" opacity="0.85" />
          </g>
        ))}
        {village.parcels.map((p) => {
          const deg = r1((p.rotation * 180) / Math.PI);
          return (
            <g key={p.id} transform={`translate(${p.center[0]} ${p.center[1]}) rotate(${deg})`}>
              <rect x={-p.size[0] / 2} y={-p.size[1] / 2} width={p.size[0]} height={p.size[1]} fill={`url(#${id}-${p.id})`} stroke="none" />
              <rect x={-p.size[0] / 2} y={-p.size[1] / 2} width={p.size[0]} height={p.size[1]} strokeWidth="1.3" />
            </g>
          );
        })}
        {houses.map((h, i) => (
          <rect
            key={`h${i}`}
            x={-h.w / 2}
            y={-h.d / 2}
            width={h.w}
            height={h.d}
            strokeWidth="0.9"
            fill="var(--paper)"
            transform={`translate(${h.x} ${h.z}) rotate(${h.r})`}
          />
        ))}
        {trees.map((t, i) => (
          <circle key={`t${i}`} cx={t.x} cy={t.z} r={t.r} strokeWidth="0.7" opacity="0.75" />
        ))}
        {village.landmarks
          .filter((l) => l.kind === "church")
          .map((l) => (
            <g key={l.id} transform={`translate(${l.position[0]} ${l.position[1]})`} strokeWidth="1.2">
              <line x1="0" y1="-14" x2="0" y2="8" />
              <line x1="-5" y1="-8" x2="5" y2="-8" />
            </g>
          ))}
      </g>
    </svg>
  );
}
