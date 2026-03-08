import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          fontWeight: 700,
          background: "#FF3B30", // Apple red
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          borderRadius: 8,
          border: "1px solid #FF6B63", // Lighter top edge effect
          boxShadow: "inset 0px -2px 4px rgba(0, 0, 0, 0.2), inset 0px 2px 4px rgba(255, 255, 255, 0.3)", // subtle 3D effect
        }}
      >
        $
      </div>
    ),
    { ...size }
  );
}
