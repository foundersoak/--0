import { ImageResponse } from "next/og";
import { decodeCard } from "@/lib/share";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "blankand0 — roster result";

const BG = "#0b0f1a";
const GOLD = "#FDB927";

export default async function Image({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const card = decodeCard(code);

  const wins = card?.wins ?? 0;
  const losses = card?.losses ?? 0;
  const grade = card?.grade ?? "";
  const brand = card?.brand ?? "blankand0";
  const name = card?.name ?? "";
  const perfect = card?.perfect ?? false;
  const passes = card?.passes ?? [];
  const roster = card?.roster ?? [];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: BG,
          color: "white",
          padding: 64,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", fontSize: 36, fontWeight: 800 }}>
            <span>blankand0</span>
            <span style={{ color: GOLD }}>.</span>
          </div>
          <div style={{ display: "flex", fontSize: 30, color: "rgba(255,255,255,0.55)" }}>
            {`${name} · ${brand}`}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {perfect ? (
            <div
              style={{
                display: "flex",
                background: GOLD,
                color: "black",
                fontSize: 28,
                fontWeight: 800,
                letterSpacing: 6,
                padding: "8px 26px",
                borderRadius: 999,
                marginBottom: 18,
              }}
            >
              UNDEFEATED
            </div>
          ) : null}
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", fontSize: 200, fontWeight: 800, lineHeight: 1 }}>
              {`${wins}-${losses}`}
            </div>
            {grade ? (
              <div
                style={{
                  display: "flex",
                  marginLeft: 28,
                  fontSize: 76,
                  fontWeight: 800,
                  background: perfect ? GOLD : "rgba(255,255,255,0.1)",
                  color: perfect ? "black" : "white",
                  padding: "6px 26px",
                  borderRadius: 20,
                }}
              >
                {grade}
              </div>
            ) : null}
          </div>
          <div style={{ display: "flex", marginTop: 30 }}>
            {passes.map((ok, i) => (
              <div
                key={`sq-${i}`}
                style={{
                  display: "flex",
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  marginRight: i < passes.length - 1 ? 14 : 0,
                  background: ok ? "#34d399" : "#fb7185",
                }}
              />
            ))}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {roster.map((r) => (
            <div
              key={r.slot}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 200 }}
            >
              <div style={{ display: "flex", fontSize: 22, fontWeight: 800, color: GOLD }}>
                {r.slot}
              </div>
              <div style={{ display: "flex", fontSize: 24, color: "white", marginTop: 6, textAlign: "center" }}>
                {r.player}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "center", fontSize: 26, color: "rgba(255,255,255,0.5)" }}>
          {`blankand0.vercel.app — can you go ${brand}?`}
        </div>
      </div>
    ),
    size,
  );
}
