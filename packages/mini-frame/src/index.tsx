import React from "react";

type MiniFrameProps = React.PropsWithoutRef<JSX.IntrinsicElements["div"]>;

export function MiniFrame({ children, ...props }: MiniFrameProps) {
  return (
    <div {...props}>
      <div
        className="ch-frame"
        style={{
          borderRadius: "6px",
          boxShadow:
            "0 13px 27px -5px rgba(50,50,93,.25), 0 8px 16px -8px rgba(0,0,0,.3), 0 -6px 16px -6px rgba(0,0,0,.025)",
          overflow: "hidden",
          fontFamily:
            "Ubuntu,Droid Sans,-apple-system,BlinkMacSystemFont,Segoe WPC,Segoe UI,sans-serif",
        }}
      >
        <div style={{ height: "28px", background: "#4f4f4f" }}></div>
        <div
          style={{
            backgroundColor: "#fafafa",
            height: "calc(100% - 28px)",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
