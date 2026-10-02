import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #0e0d0b 0%, #171410 60%, #23201a 100%)",
          color: "#f3eee4",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 22, letterSpacing: 6, color: "#a8a193" }}>
          <div style={{ width: 12, height: 12, borderRadius: 999, background: "#f2b544" }} />
          {site.position.toUpperCase()}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 112, lineHeight: 0.95, letterSpacing: -4 }}>Ali Muhammad</div>
          <div style={{ fontSize: 112, lineHeight: 0.95, letterSpacing: -4, fontStyle: "italic", color: "#f2b544" }}>Rajwa</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, color: "#a8a193" }}>
          <span>{site.role}</span>
          <span>{site.location}</span>
        </div>
      </div>
    ),
    size,
  );
}
