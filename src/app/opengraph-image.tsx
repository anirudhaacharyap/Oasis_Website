import { ImageResponse } from "next/og";
import { LOGO_PATH, LOGO_VIEWBOX } from "@/components/brand/logo-path";

export const alt = "OASIS, the esports and game dev club at NMIT, Bengaluru";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Share card: the poster's ink field, the wordmark in cream, a brand-red strip. */
export default function OpenGraphImage() {
    return new ImageResponse(
        (
            <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#0C0B0C", color: "#F2EADB" }}>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 80px" }}>
                    <svg width="760" height="305" viewBox={LOGO_VIEWBOX} fill="#F2EADB">
                        <path d={LOGO_PATH} />
                    </svg>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#AD0013", padding: "34px 80px", fontSize: 38, fontWeight: 800, letterSpacing: 2 }}>
                    <span>ESPORTS AND GAME DEV CLUB</span>
                    <span>NMIT BENGALURU</span>
                </div>
            </div>
        ),
        { ...size },
    );
}
