import React from "react";
import "./mini-frame.css";

type MiniFrameProps = {
  title?: string;
  titleBar?: React.ReactNode;
  zoom?: number;
} & React.PropsWithoutRef<JSX.IntrinsicElements["div"]>;

export function MiniFrame({
  title,
  children,
  titleBar,
  zoom = 1,
  ...props
}: MiniFrameProps) {
  const bar = titleBar || <DefaultTitleBar title={title} />;
  return (
    <div {...props}>
      <div className="ch-frame">
        <div className="ch-title-bar">{bar}</div>
        <div className="ch-frame-content">
          <div
            className="ch-frame-zoom"
            style={{ "--ch-frame-zoom": zoom } as React.CSSProperties}
          >
            {children}
          </div>
        </div>
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
      <div className="ch-middle-bar">{title}</div>
      <div className="ch-right-bar"></div>
    </>
  );
}

export function FrameButtons() {
  return (
    <div className="ch-frame-buttons">
      <div className="ch-frame-button red" />
      <div className="ch-frame-button-space" />
      <div className="ch-frame-button yellow" />
      <div className="ch-frame-button-space" />
      <div className="ch-frame-button green" />
    </div>
  );
}
