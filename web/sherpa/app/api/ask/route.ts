import { NextResponse } from "next/server";
import { nextAnswer } from "./prompt";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(request: Request) {
  const { chat, model = "gpt-3.5-turbo" } = await request.json();
  const session = await getServerSession(authOptions);

  const login = session?.user?.login;

  if (!login) {
    return new Response("Unauthorized", { status: 401 });
  }

  console.log({ session });

  const answer = await nextAnswer(chat, model);

  const data = { answer, model };

  return NextResponse.json(data);
}
