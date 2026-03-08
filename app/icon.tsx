import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 22,
          fontWeight: 800,
          background: "#ef4444", // Red-500
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          borderRadius: 8,
          border: "1px solid #f87171", // Lighter red for top-edge bevel effect
        }}
      >
        $
      </div>
    ),
    { ...size }
  );
}
