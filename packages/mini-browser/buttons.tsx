import React from "react";

function WindowButtons() {
  return (
    <div
      style={{
        margin: "auto 10px auto 4px",
      }}
    >
      <WindowButton border="#e33e41" bg="#ff5c5c" />
      <WindowButton border="#e09e3e" bg="#ffbd4c" />
      <WindowButton border="#14ae46" bg="#00ca56" />
    </div>
  );
}

function WindowButton({ bg, border }: { bg: string; border: string }) {
  return (
    <div
      style={{
        background: bg,
        width: "10px",
        height: "10px",
        border: `1px solid ${border}`,
        borderRadius: "50%",
        display: "inline-block",
        marginLeft: "6px",
      }}
    />
  );
}

function Back() {
  return (
    <svg
      fill="currentColor"
      preserveAspectRatio="xMidYMid meet"
      height="1em"
      width="1em"
      viewBox="0 0 40 40"
      style={{ verticalAlign: "middle", marginRight: 6, color: "#999" }}
    >
      <g>
        <path d="m26.5 12.1q0 0.3-0.2 0.6l-8.8 8.7 8.8 8.8q0.2 0.2 0.2 0.5t-0.2 0.5l-1.1 1.1q-0.3 0.3-0.6 0.3t-0.5-0.3l-10.4-10.4q-0.2-0.2-0.2-0.5t0.2-0.5l10.4-10.4q0.3-0.2 0.5-0.2t0.6 0.2l1.1 1.1q0.2 0.2 0.2 0.5z" />
      </g>
    </svg>
  );
}

function Forward() {
  return (
    <svg
      fill="currentColor"
      preserveAspectRatio="xMidYMid meet"
      height="1em"
      width="1em"
      viewBox="0 0 40 40"
      style={{ verticalAlign: "middle", marginRight: 6, color: "#999" }}
    >
      <g>
        <path d="m26.3 21.4q0 0.3-0.2 0.5l-10.4 10.4q-0.3 0.3-0.6 0.3t-0.5-0.3l-1.1-1.1q-0.2-0.2-0.2-0.5t0.2-0.5l8.8-8.8-8.8-8.7q-0.2-0.3-0.2-0.6t0.2-0.5l1.1-1.1q0.3-0.2 0.5-0.2t0.6 0.2l10.4 10.4q0.2 0.2 0.2 0.5z" />
      </g>
    </svg>
  );
}

function Refresh() {
  return (
    <svg
      fill="currentColor"
      preserveAspectRatio="xMidYMid meet"
      height="1em"
      width="1em"
      viewBox="0 0 40 40"
      style={{ verticalAlign: "middle", marginRight: 6 }}
    >
      <path d="M29.5 10.5l3.9-3.9v11.8H21.6L27 13c-1.8-1.8-4.3-3-7-3-5.5 0-10 4.5-10 10s4.5 10 10 10c4.4 0 8.1-2.7 9.5-6.6h3.4c-1.5 5.7-6.6 10-12.9 10-7.3 0-13.3-6.1-13.3-13.4S12.7 6.6 20 6.6c3.7 0 7 1.5 9.5 3.9z" />
    </svg>
  );
}

function Open({ href }: { href: string }) {
  return (
    <a
      style={{ margin: "0 10px 0 6px", color: "inherit" }}
      title="Open in new tab"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        viewBox="0 0 24 24"
        style={{ height: "14px", width: "14px", display: "block" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"></path>
      </svg>
    </a>
  );
}

export { WindowButtons, Back, Forward, Refresh, Open };
