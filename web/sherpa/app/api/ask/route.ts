import { NextResponse } from "next/server";
import { nextAnswer } from "./prompt";

export async function POST(request: Request) {
  const { chat, model = "gpt-3.5-turbo" } = await request.json();

  const answer = await nextAnswer(chat, model);

  const data = { answer, model };

  return NextResponse.json(data);
}

// set background color in vue component
