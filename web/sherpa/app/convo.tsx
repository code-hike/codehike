"use client";
import { Chat } from "@code-hike/mdx/components";
import React from "react";

export default function Convo({
  convo,
  onReply,
}: {
  convo: string[];
  onReply: (s: string) => void;
}) {
  const conversation = React.useMemo(() => {
    console.log(convo);
    return parseConvo(convo);
  }, [convo]);
  console.log(conversation);
  return conversation.length > 0 ? (
    <Chat
      steps={conversation}
      style={{
        width: 900,
        margin: "10vh auto",
      }}
      height="80vh"
      onReply={onReply}
    />
  ) : null;
}

function parseConvo(convo: string[]) {
  const chat: any[] = [];
  convo.forEach((c, i) => {
    if (i % 2 === 0) {
      chat.push({
        question: <p>{c}</p>,
      });
    } else {
      // const { answer, code, replies } = parseAnswer(c);
      chat[chat.length - 1].answer = extractAnswer(c);
      chat[chat.length - 1].code = extractCodeBlock(c);
      chat[chat.length - 1].replies = extractReplies(c);
    }
  });
  return chat;
}

function extractAnswer(str: string): string {
  const codeBlockRegex = /```(?:\w+)?(?:\s+[\w.]+)?\n[\s\S]*?```/g;
  const delimiterRegex = /---/g;

  // Remove the code block from the string
  const stringWithoutCodeBlock = str.replace(codeBlockRegex, "").trim();

  // Find the index of the delimiter
  const delimiterIndex = stringWithoutCodeBlock.search(delimiterRegex);

  if (delimiterIndex === -1) {
    return stringWithoutCodeBlock;
  }

  // Return the text before the delimiter
  return stringWithoutCodeBlock.slice(0, delimiterIndex).trim();
}

function extractCodeBlock(str: string) {
  const codeBlockRegex = /```(\w+)?(?:\s+([\w.]+))?\n([\s\S]*?)```/g;
  const match = codeBlockRegex.exec(str);

  if (match) {
    return {
      lang: match[1] || "text",
      title: match[2] || "answer.txt",
      text: match[3] || null,
    };
  }
  return {
    lang: "text",
    title: "answer.txt",
    text: null,
  };
}

function extractReplies(str: string): string[] {
  const delimiterRegex = /---[\s\S]*$/g;
  const listRegex = /- (.+)/g;

  const delimiterMatch = delimiterRegex.exec(str);

  if (!delimiterMatch) {
    return [];
  }

  const listSection = delimiterMatch[0];
  const listItems: string[] = [];
  let listItemMatch: RegExpExecArray | null;

  while ((listItemMatch = listRegex.exec(listSection)) !== null) {
    listItems.push(listItemMatch[1]);
  }

  return listItems;
}
