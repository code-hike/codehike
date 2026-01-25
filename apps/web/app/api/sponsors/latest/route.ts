import { fetchLatestSponsors } from "@/app/landing/sponsors"

export async function GET() {
  try {
    const sponsors = await fetchLatestSponsors(5)
    return Response.json(sponsors)
  } catch (error: any) {
    return Response.json(
      { error: error.message || "Failed to fetch sponsors" },
      { status: 500 }
    )
  }
}
