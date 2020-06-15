import React from "react";
import { TerminalContent } from "./terminal-content";
import { Frame } from "./frame";

function MiniTerminalTransition({
  height = 100,
  title = "bash",
  prev,
  prevKey,
  next,
  nextKey,
  progress,
}: {
  height?: number;
  title?: string;
  prev: string;
  prevKey?: React.Key;
  next: string;
  nextKey?: React.Key;
  progress: number;
}) {
  return (
    <Frame title={title} height={height}>
      <InnerTerminalTransition
        {...{ prev, prevKey, next, nextKey, progress }}
      />
    </Frame>
  );
}

function InnerTerminalTransition({
  prev,
  prevKey,
  next,
  nextKey,
  progress,
}: {
  height?: number;
  title?: string;
  prev: string;
  prevKey?: React.Key;
  next: string;
  nextKey?: React.Key;
  progress: number;
}) {
  return (
    <div
      style={{
        fontSize: "14px",
        height: "100%",
        boxSizing: "border-box",
        background: "rgb(30, 30, 30)",
        color: "#fafafa",
        overflow: "hidden",
        padding: "0 8px 8px",
        fontFamily:
          "Ubuntu,Droid Sans,-apple-system,BlinkMacSystemFont,Segoe WPC,Segoe UI,sans-serif",
      }}
    >
      <div
        style={{
          position: "relative",
          transform: `translateY(-${progress * 100}%)`,
        }}
      >
        <TerminalContent
          text={prev}
          progress={1}
          key={prevKey}
        ></TerminalContent>
        <TerminalContent
          style={{ position: "absolute" }}
          text={next}
          progress={progress}
          key={nextKey}
        />
      </div>
    </div>
  );
}

export { MiniTerminalTransition, InnerTerminalTransition };
