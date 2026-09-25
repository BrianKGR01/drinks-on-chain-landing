import type { CSSProperties } from "react";
import styles from "./HeroVine.module.css";

/**
 * The hero's signature drawing: a vine cane rising through the right side of
 * the hero, five leaves, three grape clusters in gold and a few tendrils. It
 * draws itself stroke by stroke when `draw` turns true, then the leaves and
 * clusters sway gently (transform-only animation, tiny paint areas).
 */
interface HeroVineProps {
  draw: boolean;
  className?: string;
}

// One five-lobed leaf around the origin (stem at 0,0, tip toward -y).
const LEAF =
  "M0 0 c -30 -10 -58 -6 -74 -30 c 18 -12 40 -6 54 6 c -22 -26 -18 -58 4 -78 c 16 22 18 50 12 62 c 10 -30 38 -46 66 -38 c -14 26 -34 36 -52 36 c 26 4 46 26 48 48 c -26 -4 -46 -18 -58 -6 z";
const LEAF_VEINS = "M0 0 l -6 -66 M0 0 l -60 -28 M0 0 l 56 -30 M0 0 l 36 40 M0 0 l -50 30";

const CLUSTER: Array<[number, number, number]> = [
  [0, 0, 11], [22, -4, 11], [44, 2, 11], [-10, 20, 11], [12, 18, 11], [34, 22, 11], [56, 26, 10],
  [2, 40, 10], [24, 40, 10], [46, 44, 10], [12, 60, 9.5], [34, 62, 9.5], [22, 82, 9], [44, 80, 8.5], [32, 100, 8],
];

export function HeroVine({ draw, className = "" }: HeroVineProps) {
  let i = 0;
  const stroke = (d: string, w = 1.3, extra = 0, cls = "") => (
    <path
      key={i}
      d={d}
      pathLength={1}
      className={`${styles.stroke} ${cls}`}
      strokeWidth={w}
      style={{ "--i": i++, "--extra": extra } as CSSProperties}
    />
  );
  const leaf = (x: number, y: number, rot: number, scale: number, sway: number) => (
    // Position lives on the outer group (attribute); the CSS sway animates the inner one,
    // otherwise the animated `transform` would override the translate.
    <g key={`leaf${x}${y}`} transform={`translate(${x} ${y})`}>
      <g className={styles.leaf} style={{ "--sway": `${sway}deg`, "--dur": `${6 + (x % 3)}s` } as CSSProperties}>
        <g transform={`rotate(${rot}) scale(${scale})`}>
          {stroke(LEAF, 1.2 / scale)}
          {stroke(LEAF_VEINS, 0.7 / scale, 1)}
        </g>
      </g>
    </g>
  );
  const cluster = (x: number, y: number, scale: number) => (
    <g key={`cl${x}${y}`} transform={`translate(${x} ${y}) scale(${scale})`}>
      <g className={styles.cluster}>
      {stroke(`M0 -22 c 4 8 8 14 10 22`, 1.4 / scale, 0)}
      {CLUSTER.map(([cx, cy, r], k) => (
        <g key={k}>
          <circle
            cx={cx}
            cy={cy}
            r={r}
            pathLength={1}
            className={`${styles.stroke} ${styles.gold}`}
            strokeWidth={1.1 / scale}
            style={{ "--i": i + k * 0.4, "--extra": 0 } as CSSProperties}
          />
          <path
            d={`M${cx - r * 0.55} ${cy + r * 0.3} q ${r * 0.5} ${r * 0.55} ${r * 1.05} 0`}
            pathLength={1}
            className={`${styles.stroke} ${styles.gold}`}
            strokeWidth={0.6 / scale}
            style={{ "--i": i + k * 0.4 + 0.2, "--extra": 1 } as CSSProperties}
          />
        </g>
      ))}
      </g>
    </g>
  );

  return (
    <svg
      viewBox="0 0 720 720"
      className={`${styles.svg} ${draw ? styles.draw : ""} ${className}`}
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMaxYMax meet"
    >
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        {/* main cane: rises from the bottom-left of its box to the top-right, so it stays clear of the copy */}
        {stroke("M30 705 C 150 640, 250 570, 320 470 S 460 270, 560 200 S 680 110, 705 30", 1.8)}
        {/* side canes */}
        {stroke("M320 470 c 60 -10, 110 10, 150 60", 1.3)}
        {stroke("M560 200 c -50 -40, -70 -90, -50 -150", 1.3)}
        {stroke("M180 600 c -40 -30, -60 -80, -40 -130", 1.2)}
        {/* tendrils */}
        {stroke("M470 530 c 26 20, 50 6, 40 -12 c -6 -12, -24 -6, -18 6 c 4 8, 14 6, 12 0", 0.9, 1)}
        {stroke("M510 50 c -22 -30, -50 -22, -44 0 c 4 14, 24 12, 22 -2 c -2 -8, -12 -8, -12 0", 0.9, 1)}
        {stroke("M140 470 c -26 -26, -54 -14, -44 8 c 6 12, 26 8, 22 -4 c -2 -8, -12 -8, -12 0", 0.9, 1)}
        {/* leaves along the cane (stem at the cane, tip outward) */}
        {leaf(110, 660, -150, 1, 3)}
        {leaf(300, 500, 170, 0.95, -3)}
        {leaf(420, 360, -130, 0.9, 2.5)}
        {leaf(600, 180, 160, 0.95, -3)}
        {leaf(680, 60, -110, 0.75, 3.5)}
        {/* grape clusters hanging from the cane */}
        {cluster(240, 560, 1)}
        {cluster(480, 300, 0.9)}
        {cluster(640, 150, 0.7)}
      </g>
    </svg>
  );
}
