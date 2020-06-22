import React from "react";
import "./index.css";

type MiniFrameProps = {
  title?: string;
  titleBar?: React.ReactNode;
} & React.PropsWithoutRef<JSX.IntrinsicElements["div"]>;

export function MiniFrame({
  title,
  children,
  titleBar,
  ...props
}: MiniFrameProps) {
  const bar = titleBar || <DefaultTitleBar title={title} />;
  return (
    <div {...props}>
      <div className="ch-frame">
        <div className="ch-title-bar">{bar}</div>
        <div className="ch-frame-content">{children}</div>
      </div>
    </div>
  );
}

function DefaultTitleBar({ title }: { title?: string }) {
  return (
    <>
      <div className="ch-left-bar">
        <FrameButtons />
      </div>
      <div className="ch-title">{title}</div>
      <div className="ch-right-bar"></div>
    </>
  );
}

export function FrameButtons() {
  return (
    <div className="ch-frame-buttons">
      <div className="ch-frame-button red" />
      <div className="ch-frame-button yellow" />
      <div className="ch-frame-button green" />
    </div>
  );
}
