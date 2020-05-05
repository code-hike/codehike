import React from "react";
import { GitHubCorner } from "../src/github-corner";
import { MiniTerminalTransitions } from "@code-hike/mini-terminal";
import { CodeHikeLogo } from "../src/code-hike-logo";
import { useSpring } from "use-spring";
import Head from "next/head";

export default function Page() {
  const [{ target, teleport }, setState] = React.useState({
    target: 0,
    teleport: false,
  });
  const [progress] = useSpring(target, { teleport });
  console.log(target, progress);
  const max = steps.length - 1;
  return (
    <>
      <Head>
        <title>Mini Terminal - Code Hike</title>
        <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
      </Head>
      <header
        style={{
          margin: "120px 0 60px 0",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#4f4f4f",
          fontFamily: `Roboto, -apple-system, BlinkMacSystemFont, Segoe UI,
              Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji,
              Segoe UI Symbol`,
        }}
      >
        <CodeHikeLogo style={{ height: 128, width: 128 }} />
        <div style={{ width: 40 }} />
        <div>
          <h1 style={{ margin: 0 }}>Code Hike</h1>
          <div style={{ height: 10 }} />
          <h1 style={{ margin: 0 }}>Mini Terminal</h1>
        </div>
      </header>
      <GitHubCorner repo="https://github.com/code-hike/mini-terminal" />
      <div style={{ width: 500, margin: "50px auto" }}>
        <MiniTerminalTransitions
          title="loremsh"
          height={300}
          progress={progress}
          steps={steps}
        />
        <div
          style={{ display: "flex", alignItems: "center", marginTop: "30px" }}
        >
          <button
            style={{ userSelect: "none" }}
            onClick={() =>
              setState(({ target }) => ({
                teleport: false,
                target: Math.max(Math.ceil(target - 1), 0),
              }))
            }
          >
            prev
          </button>
          <input
            type="range"
            max={max}
            step={0.01}
            style={{ width: "100%" }}
            onChange={(e) =>
              setState({ target: +e.target.value, teleport: true })
            }
            value={progress}
          />
          <button
            style={{ userSelect: "none" }}
            onClick={() =>
              setState(({ target }) => ({
                teleport: false,
                target: Math.min(Math.floor(target + 1), max),
              }))
            }
          >
            next
          </button>
        </div>
      </div>
    </>
  );
}

const steps = [
  `$ lorem ipsum
dolor sit amet
consectetur adipiscing elit
$ sed do`,
  `$ eiusmod tempor incididunt
ut labore et dolore`,
  `$ magna aliqua
ut enim ad minim veniam
quis nostrud
exercitation ullamco laboris nisi ut aliquip
ex ea commodo consequat
$ duis aute irure dolor
in reprehenderit`,
  `$ in voluptate
velit esse cillum dolore
$ eu fugiat nulla pariatur`,
  `$ excepteur sint occaecat
cupidatat non proident
sunt in culpa qui
officia deserunt
$ mollit anim id est laborum
$ `,
];
