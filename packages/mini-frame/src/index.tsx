import React from "react";
import "./index.css";

type MiniFrameProps = React.PropsWithoutRef<JSX.IntrinsicElements["div"]>;

export function MiniFrame({ children, ...props }: MiniFrameProps) {
  return (
    <div {...props}>
      <div className="ch-frame">
        <div className="ch-title-bar"></div>
        <div className="ch-frame-content">{children}</div>
      </div>
    </div>
  );
}
