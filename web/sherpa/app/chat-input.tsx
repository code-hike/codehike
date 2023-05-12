"use client";

import React, { useState, useRef, useEffect } from "react";
import { IconSend } from "@tabler/icons-react";
import { SignInButton } from "./auth-buttons";

const absurdExamples = [
  "How to center a div using Smalltalk",
  "Help me improve quantum computing with CSS",
  "Whale song generator using browser APIs",
  "Write a MATLAB program that can predict what color shirt you're wearing",
  "Use SQL to write a love story",
];

function ChatInput({
  onSend,
  started,
  isWaiting,
}: {
  onSend: (c: string) => void;
  started: boolean;
  isWaiting: boolean;
}) {
  const [content, setContent] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef && textareaRef.current) {
      textareaRef.current.style.height = "inherit";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      textareaRef.current.style.overflow = `${
        textareaRef.current.scrollHeight > 300 ? "auto" : "hidden"
      }`;
    }
  }, [content]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isWaiting) return;
    setContent(e.target.value);
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      handleSend();
      event.preventDefault();
    }
  };

  const handleSend = () => {
    onSend(content);
    setContent("");
  };

  React.useEffect(() => {
    if (started) {
      textareaRef.current?.focus();
    }
  }, [started]);

  return (
    <div
      className={
        "fixed bottom-0 left-0 w-full border-transparent pt-6 md:pt-2 bg-gradient-to-b from-transparent via-white to-white"
        // "fixed bottom-0 left-0 w-full border-transparent bg-red-600 pt-6 md:pt-2 "
      }
      style={{
        transform: started
          ? "translateY(calc(50vh - 5px))"
          : "translateY(30px)",
        transition: "transform 0.3s cubic-bezier(.42,0,.21,1)",
        pointerEvents: "none",
      }}
    >
      <div
        className={
          "text-2xl bold absolute w-full text-center text-neutral-950 top-0 " +
          (started ? "opacity-0" : "opacity-100")
        }
        style={{ transition: "opacity 0.3s ease-in-out" }}
      >
        Tell me about the coding challenge you're facing
      </div>
      <div className="stretch mx-2 mt-4 flex flex-row gap-3 last:mb-2 md:mx-4 md:mt-[52px] md:last:mb-6 lg:mx-auto lg:max-w-3xl pointer-events-auto">
        <div
          className={
            "relative mx-2 flex w-full flex-grow flex-col rounded-md  bg-white  sm:mx-4 shadow-[0_0_10px_rgba(0,0,0,0.6)]"
          }
        >
          <textarea
            ref={textareaRef}
            className="m-0 w-full resize-none border-0 bg-transparent p-0 py-2 pr-8 pl-4 text-black md:py-3 outline-[rgba(0,0,0,0.5)]"
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
                : "How to center a div using Smalltalk"
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
      </div>
      <div className="py-1 px-6 mx-auto  lg:max-w-3xl">
        <ProgressBar percentage={20} />
      </div>
      <div className=" bg-white p-12 flex flex-col items-center gap-3 h-[50vh] bold">
        <span className="text-lg">but first</span>
        <SignInButton />
      </div>
    </div>
  );
}
function ProgressBar({ percentage }: { percentage: number }) {
  return (
    <div className="w-full h-2 bg-green-200 rounded-md overflow-hidden">
      <div
        className="h-full bg-green-500"
        style={{
          width: `${percentage}%`,
          transition: "width 0.3s ease-in-out",
        }}
      ></div>
    </div>
  );
}

export default ChatInput;
