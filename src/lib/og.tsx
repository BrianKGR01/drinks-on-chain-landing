import { ImageResponse } from "next/og";

/*
 * Share images (`opengraph-image` files). Rendered once at build time (no
 * request-time APIs), with the font bundled with next/og: no font file of
 * Cormorant ships with the repo and nothing is fetched from the network.
 */
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const PAPER = "#fdfcf5";
const INK = "#2b2622";
const GOLD = "#b8891f";
const DEEP_GOLD = "#8a651a";

/** Paper card with a double gold frame: small caption, the title in capitals and a line under it. */
export function ogImage({ eyebrow, title, tagline }: { eyebrow: string; title: string; tagline: string }) {
  // Long titles step down so they stay on one line inside the frame.
  const long = title.length > 16;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: PAPER,
          padding: 36,
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            border: `1px solid ${GOLD}`,
            padding: 10,
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              border: `1px solid ${GOLD}`,
              color: INK,
            }}
          >
            <div style={{ display: "flex", fontSize: 22, letterSpacing: 8, color: DEEP_GOLD }}>{eyebrow}</div>
            <div style={{ display: "flex", width: 96, height: 1, background: GOLD, marginTop: 40, marginBottom: 40 }} />
            <div style={{ display: "flex", fontSize: long ? 68 : 84, letterSpacing: long ? 12 : 18, color: "#000" }}>{title}</div>
            <div style={{ display: "flex", width: 96, height: 1, background: GOLD, marginTop: 40, marginBottom: 36 }} />
            <div style={{ display: "flex", fontSize: long ? 34 : 38, color: INK }}>{tagline}</div>
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}
