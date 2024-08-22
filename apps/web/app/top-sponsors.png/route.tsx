import { ImageResponse } from "next/og"

export const dynamic = "force-static"

export async function GET(request: Request) {
  return new ImageResponse(
    (
      <div style={{ color: "black", display: "flex" }}>
        hello, world
        <img width="37" src="https://github.com/pomber.png" height="37" />
      </div>
    ),
    {
      width: 600,
      height: 400,
    },
  )
}
