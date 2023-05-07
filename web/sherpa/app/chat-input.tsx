"use client";

import React, { useState, useRef, useEffect } from "react";
import { IconSend } from "@tabler/icons-react";

function ChatInput({ onSend }: { onSend: (c: string) => void }) {
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
    setContent(e.target.value);
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      handleSend();
      event.preventDefault();
    }
  };

  const messageIsStreaming = false;

  const handleSend = () => {
    onSend(content);
    setContent("");
  };

  return (
    <div className="fixed bottom-0 left-0 w-full border-transparent bg-gradient-to-b from-transparent via-white to-white pt-6 md:pt-2">
      <div className="stretch mx-2 mt-4 flex flex-row gap-3 last:mb-2 md:mx-4 md:mt-[52px] md:last:mb-6 lg:mx-auto lg:max-w-3xl">
        <div className="relative mx-2 flex w-full flex-grow flex-col rounded-md border border-black/10 bg-white shadow-[0_0_10px_rgba(0,0,0,0.10)] sm:mx-4">
          <textarea
            ref={textareaRef}
            className="m-0 w-full resize-none border-0 bg-transparent p-0 py-2 pr-8 pl-4 text-black md:py-3 "
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
            placeholder={"Send a message..."}
            onInput={handleInput}
            value={content}
            rows={1}
            autoFocus
            onKeyDown={handleKeyDown}
          />
          <button
            className="absolute right-3 top-3 rounded-sm p-1 text-neutral-800 opacity-60 hover:bg-neutral-200 hover:text-neutral-900 "
            onClick={handleSend}
          >
            {messageIsStreaming ? (
              <div className="h-4 w-4 animate-spin rounded-full border-t-2 border-neutral-800 opacity-60"></div>
            ) : (
              <IconSend size={18} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatInput;
