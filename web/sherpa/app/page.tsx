"use client";
import React from "react";
import ChatInput from "./chat-input";
import Convo from "./convo";
import { sendQuestion } from "./send-question";

export default function Home() {
  const [convo, setConvo] = React.useState<string[]>([]);
  const onSend = async (c: string) => {
    const newConvo = [...convo, c];
    setConvo(newConvo);
    const answer = await sendQuestion(newConvo);
    setConvo((convo) => [...convo, answer]);
  };

  const started = convo.length > 0;

  return (
    <main className="  ">
      <Convo convo={convo} onReply={onSend} />

      <ChatInput onSend={onSend} started={started} />
    </main>
  );
}
