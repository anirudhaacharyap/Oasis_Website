import { ImageResponse } from "next/og";

export const alt = "OASIS, the esports and game dev club at NMIT, Bengaluru";
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
                    background: "#A3161D",
                    color: "#F7ECDA",
                    padding: "64px 72px",
                }}
            >
                <div style={{ display: "flex", fontSize: 26, letterSpacing: 4, color: "#F0D3C4" }}>PRESS START</div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 28 }}>
                    <div style={{ display: "flex", fontSize: 200, fontWeight: 800, letterSpacing: -10, lineHeight: 0.85, color: "#C8A15A" }}>
                        OASIS
                    </div>
                    <svg width="90" height="90" viewBox="0 0 32 32" style={{ marginBottom: 120 }}>
                        <polygon
                            points="16,3 19,12 28.5,12.3 21,18 23.8,27 16,21.6 8.2,27 11,18 3.5,12.3 13,12"
                            fill="#C8A15A"
                        />
                    </svg>
                </div>
                <div style={{ display: "flex", fontSize: 36 }}>Esports and game dev club, NMIT Bengaluru</div>
            </div>
        ),
        { ...size },
    );
}
