import { ImageResponse } from "next/og";

export const runtime = "edge";

// Image metadata
export const alt = "iRcost - Global Cost Tracker";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Image generation
export default async function TwitterImage() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 320,
          fontWeight: 700,
          background: "#18181b", // zinc-900 background
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: "#FF3B30", // Apple red
            width: 500,
            height: 500,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            borderRadius: 120,
            border: "8px solid #FF6B63", // Lighter top edge effect
            boxShadow:
              "inset 0px -20px 40px rgba(0, 0, 0, 0.2), inset 0px 20px 40px rgba(255, 255, 255, 0.3), 0px 10px 30px rgba(0,0,0,0.5)", // subtle 3D effect
          }}
        >
          $
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
