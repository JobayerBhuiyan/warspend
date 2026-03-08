import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 110,
          fontWeight: 800,
          background: "#ef4444",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          borderRadius: 40,
          border: "4px solid #f87171",
          boxShadow: "inset 0px -8px 16px rgba(153, 27, 27, 0.4)", // Inner shadow for 3D pillowy effect
        }}
      >
        $
      </div>
    ),
    { ...size }
  );
}
