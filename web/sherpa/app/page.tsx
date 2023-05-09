"use client";
import React from "react";
import ChatInput from "./chat-input";
import Convo from "./convo";
import { sendQuestion } from "./send-question";

export default function Home() {
  const [convo, setConvo] = React.useState<string[]>([]);
  const [isWaiting, setIsWaiting] = React.useState(false);
  const onSend = async (c: string) => {
    const newConvo = [...convo, c];
    setConvo(newConvo);
    setIsWaiting(true);
    const answer = await sendQuestion(newConvo);
    setConvo((convo) => [...convo, answer]);
    setIsWaiting(false);
  };

  const started = convo.length > 0;

  return (
    <main className="  ">
      <Convo convo={convo} onReply={onSend} />

      <ChatInput onSend={onSend} started={started} isWaiting={isWaiting} />
    </main>
  );
}
