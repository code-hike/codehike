"use client";
import { IconSend } from "@tabler/icons-react";
import React from "react";
import { Message, sendQuestion } from "./send-question";
import Convo from "./convo";

const absurdExamples = [
  "How to center a div using Smalltalk",
  "Help me improve quantum computing with CSS",
  "Whale song generator using browser APIs",
  "Write a MATLAB program that can predict what color shirt you're wearing",
  "Use SQL to write a love story",
];

export function App({ children }: { children: React.ReactNode }) {
  const [convo, setConvo] = React.useState<Message[]>([]);
  const [isWaiting, setIsWaiting] = React.useState(false);

  const retryWithGPT4 = async () => {
    const [...messages] = convo;
    messages.pop();
    setConvo(messages);
    setIsWaiting(true);
    const { answer } = await sendQuestion(messages, "gpt-4");
    setConvo((convo) => [...convo, { md: answer, model: "gpt-4" }]);
    setIsWaiting(false);
  };

  const onSend = async (c: string) => {
    if (c === "Ask GPT-4") {
      retryWithGPT4();
      return;
    }

    const newConvo = [...convo, { md: c, model: "user" }];
    setConvo(newConvo);
    setIsWaiting(true);
    const { answer } = await sendQuestion(newConvo);
    setConvo((convo) => [...convo, { md: answer, model: "gpt-3.5-turbo" }]);
    setIsWaiting(false);
  };

  const restartConvo = () => {
    setConvo([]);
  };

  const started = convo.length > 0;
  return (
    <main className={started ? "started" : ""}>
      <Convo convo={convo} onReply={onSend} />
      {children}
      <div className="input-container w-full flex justify-end fixed flex-col bg-gradient-to-b from-transparent via-white to-white">
        <div className="flex-1 min-h-0"></div>
        <div className="flex">
          <TextArea onSend={onSend} started={started} isWaiting={isWaiting} />
        </div>
        <div className="flex-1 min-h-0 text-center">
          <div className="input-footer text-sm pt-2 text-stone-600">
            <button
              className="hover:bold hover:text-black"
              onClick={restartConvo}
            >
              New conversation
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

function TextArea({
  onSend,
  started,
  isWaiting,
}: {
  onSend: (c: string) => void;
  started: boolean;
  isWaiting: boolean;
}) {
  const [content, setContent] = React.useState<string>("");
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (textareaRef && textareaRef.current) {
      textareaRef.current.style.height = "inherit";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      textareaRef.current.style.overflow = `${
        textareaRef.current.scrollHeight > 300 ? "auto" : "hidden"
      }`;
    }
  }, [content]);

  React.useEffect(() => {
    if (started) {
      textareaRef.current?.focus();
    }
  }, [started]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isWaiting) return;
    setContent(e.target.value);
  };
  const handleSend = () => {
    onSend(content);
    setContent("");
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      handleSend();
      event.preventDefault();
    }
  };
  return (
    <div className="max-w-3xl w-full mx-auto relative">
      <textarea
        ref={textareaRef}
        className="bg-white shadow-[0_0_10px_rgba(0,0,0,0.6)] rounded block m-0 w-full resize-none border-0 bg-transparent  py-2 pr-8 pl-4 text-black md:py-3 outline-[rgba(0,0,0,0.5)]"
        style={{
          resize: "none",
          bottom: `${textareaRef?.current?.scrollHeight}px`,
          maxHeight: "300px",
          overflow: `${
            textareaRef.current && textareaRef.current.scrollHeight > 300
              ? "auto"
              : "hidden"
          }`,
        }}
        placeholder={
          started
            ? "Send message..."
            : absurdExamples[Math.floor(Math.random() * absurdExamples.length)]
        }
        onInput={handleInput}
        value={content}
        rows={1}
        autoFocus
        onKeyDown={handleKeyDown}
        disabled={isWaiting}
      />
      <button
        className="absolute right-3 top-3 rounded-sm p-1 text-neutral-900 opacity-60 hover:bg-neutral-200 hover:text-black "
        onClick={handleSend}
      >
        {isWaiting ? (
          <div className="h-4 w-4 animate-spin rounded-full border-t-2 border-neutral-800 opacity-60"></div>
        ) : (
          <IconSend size={18} />
        )}
      </button>
    </div>
  );
}
