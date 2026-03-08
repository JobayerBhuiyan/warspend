import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 120,
          fontWeight: 700,
          background: "#FF3B30", // Apple Red
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          borderRadius: 40,
          border: "2px solid #FF6B63",
          boxShadow: "inset 0px -10px 20px rgba(0, 0, 0, 0.2), inset 0px 10px 20px rgba(255, 255, 255, 0.3), 0px 4px 10px rgba(0,0,0,0.5)", // 3D effect matching the image
        }}
      >
        $
      </div>
    ),
    { ...size }
  );
}
