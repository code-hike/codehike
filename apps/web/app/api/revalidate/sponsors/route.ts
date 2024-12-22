import { revalidatePath } from "next/cache"

export async function POST(request: Request) {
  try {
    const text = await request.text()
    console.log("[GitHub] Webhook received", text)

    revalidatePath("/")
  } catch (error: any) {
    return new Response(`Webhook error: ${error.message}`, {
      status: 400,
    })
  }

  return new Response("Success!", {
    status: 200,
  })
}
