import React from "react";
import { WindowButtons, Back, Forward, Refresh, Open } from "./buttons.tsx";

function MiniBrowser({
  height = 100,
  url,
  style,
  children,
}: {
  height?: number;
  style?: React.CSSProperties;
  url: string;
  children: React.ReactNode;
}) {
  return (
    <div style={style}>
      <div
        className="shadow"
        style={{
          height,
          borderRadius: "6px",
          // border: '1px solid rgba(175, 173, 169, 0.15)',
          boxShadow:
            "0 13px 27px -5px rgba(50,50,93,.25), 0 8px 16px -8px rgba(0,0,0,.3), 0 -6px 16px -6px rgba(0,0,0,.025)",
          overflow: "hidden",
          fontFamily:
            "Ubuntu,Droid Sans,-apple-system,BlinkMacSystemFont,Segoe WPC,Segoe UI,sans-serif",
        }}
      >
        <Bar url={url} />
        <div
          style={{
            backgroundColor: "#fafafa",
            height: "calc(100% - 28px)",
          }}
        >
          {children || (
            <iframe
              src={url}
              height="100%"
              width="100%"
              style={{ border: "none" }}
              // sandbox={sandbox}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function Bar({ url }: { url: string }) {
  return (
    <div
      style={{
        height: "28px",
        background: "rgb(45, 45, 45)",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        color: "#fafafa",
      }}
    >
      <WindowButtons />
      <Back />
      <Forward />
      <Refresh />
      <input
        style={{
          height: "18px",
          fontSize: "11px",
          borderRadius: "9px",
          border: "none",
          boxShadow: "none",
          flex: 1,
          padding: "0 10px",
          color: "#544",
        }}
        value={url}
        readOnly
      />
      <Open href={url} />
    </div>
  );
}

export { MiniBrowser };
