import { NextResponse } from "next/server";
import { nextAnswer } from "./prompt";

export async function POST(request: Request) {
  const { chat } = await request.json();

  const answer = await nextAnswer(chat);

  const data = { answer };

  return NextResponse.json(data);
}

// set background color in vue component
