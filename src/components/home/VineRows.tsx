/**
 * Faint background of vine rows for the B2B band: posts, wires and a few
 * leaves, repeated as an SVG pattern. Static, so it paints once.
 */
export function VineRows({ className }: { className?: string }) {
  return (
    <svg className={className} aria-hidden="true" focusable="false">
      <defs>
        <pattern id="vine-rows" width="220" height="120" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            {/* wires */}
            <path d="M0 78 H220 M0 60 H220" opacity="0.55" />
            {/* posts */}
            <path d="M30 40 V104 M140 40 V104" strokeWidth="1.4" />
            {/* trunks and canes */}
            <path d="M85 104 c -2 -18 2 -30 0 -44 M85 60 c -14 -6 -22 -14 -30 -24 M85 60 c 12 -10 24 -12 36 -18" />
            <path d="M195 104 c -2 -18 2 -30 0 -44 M195 60 c -14 -6 -22 -14 -30 -24 M195 60 c 12 -10 24 -12 30 -14" />
            {/* leaves */}
            <path d="M60 44 c -8 -8 -10 -18 -2 -22 c 8 4 10 14 2 22 z M110 46 c 8 -8 10 -18 2 -22 c -8 4 -10 14 -2 22 z" opacity="0.8" />
            <path d="M170 44 c -8 -8 -10 -18 -2 -22 c 8 4 10 14 2 22 z" opacity="0.8" />
            {/* grapes */}
            <g opacity="0.85">
              <circle cx="72" cy="68" r="2.4" /><circle cx="77" cy="70" r="2.4" /><circle cx="74" cy="75" r="2.2" /><circle cx="79" cy="76" r="2" /><circle cx="76" cy="81" r="1.8" />
              <circle cx="182" cy="68" r="2.4" /><circle cx="187" cy="70" r="2.4" /><circle cx="184" cy="75" r="2.2" /><circle cx="189" cy="76" r="2" /><circle cx="186" cy="81" r="1.8" />
            </g>
            {/* ground */}
            <path d="M0 106 c 30 -3 60 3 90 0 s 60 -3 90 0 s 30 2 40 0" opacity="0.5" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#vine-rows)" />
    </svg>
  );
}
