import React from "react";
import { Back, Forward, Open } from "./buttons";
import { MiniFrame, FrameButtons } from "@code-hike/mini-frame";
import "./mini-browser.css";

type MiniBrowserProps = {
  height?: number;
  url: string;
  children: React.ReactNode;
  zoom?: number;
} & React.PropsWithoutRef<JSX.IntrinsicElements["div"]>;

function MiniBrowser({ height, url, children, ...props }: MiniBrowserProps) {
  return (
    <MiniFrame
      {...props}
      className={`ch-mini-browser ${props.className || ""}`}
      style={{ height, ...props.style }}
      titleBar={<Bar url={url} />}
    >
      {children || (
        <iframe
          src={url}
          // sandbox={sandbox}
        />
      )}
    </MiniFrame>
  );
}

function Bar({ url }: { url: string }) {
  return (
    <>
      <FrameButtons />
      <Back />
      <Forward />
      {/* <Refresh /> */}
      <input value={url} readOnly />
      <Open href={url} />
    </>
  );
}

export { MiniBrowser };
