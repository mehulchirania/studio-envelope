import { ImageResponse } from "next/og";
import { site } from "@/lib/content/site";

export const alt = "Studio Envelope — Architecture & Interior Design, Bangalore";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Social share card in the site palette (brown ground, bone text, amber rule). */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#26211c",
          padding: "80px",
          color: "#ebe1d2",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{ width: "56px", height: "6px", backgroundColor: "#FCB618" }} />
          <div style={{ fontSize: "22px", letterSpacing: "0.2em", textTransform: "uppercase" }}>{site.name}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ fontSize: "84px", lineHeight: 1.02, fontWeight: 300, maxWidth: "900px" }}>
            Spaces, sealed with care.
          </div>
          <div style={{ fontSize: "28px", lineHeight: 1.4, color: "#c9baa6", maxWidth: "820px" }}>
            {`Architecture & interior design, Bangalore. Led by ${site.principal.name}.`}
          </div>
        </div>
        <div style={{ fontSize: "20px", color: "#c9baa6", letterSpacing: "0.08em" }}>studioenvelope.com</div>
      </div>
    ),
    size
  );
}
