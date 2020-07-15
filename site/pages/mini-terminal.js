import React from "react";
import Head from "next/head";
import { MiniTerminal } from "@code-hike/mini-terminal";
import { useStepsProgress, StepsRange } from "../src/steps-range";
import { ExternalLinkButton, LinkButton } from "../src/button";
import { LogoHeader } from "../src/logo-header";

export default function Page() {
  return (
    <div
      style={{
        width: 500,
        maxWidth: "90vw",
        minWidth: "288px",
        margin: "0 auto 30px",
      }}
    >
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Mini Terminal - Code Hike</title>
        <meta
          name="description"
          content="React component for terminal walkthroughs."
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
      </Head>
      <Header />
      <Demo />
      <div style={{ fontSize: "1.4rem", marginBottom: 48 }}>
        React component for terminal walkthroughs. It transitions smoothly
        between a given list of steps using the <code>progress</code> prop.
      </div>
      <div style={{ display: "flex" }}>
        <ExternalLinkButton
          style={{ flex: 1 }}
          href="https://codesandbox.io/s/gifted-jennings-p4co1?file=/src/App.js"
        >
          {/* <CodeSandboxIcon size="1.4em" style={{ marginRight: "0.5rem" }} /> */}
          Try it
        </ExternalLinkButton>
        <div style={{ width: 12 }} />
        <LinkButton style={{ flex: 1 }} href="mini-terminal/docs">
          {/* <DocsIcon size="1.4em" style={{ marginRight: "0.5rem" }} /> */}
          Docs
        </LinkButton>
        <div style={{ width: 12 }} />
        <ExternalLinkButton
          style={{ flex: 1 }}
          href="https://github.com/code-hike/mini-terminal"
        >
          {/* <GitHubIcon size="1.2em" style={{ marginRight: "0.5rem" }} /> */}
          GitHub
        </ExternalLinkButton>
      </div>
    </div>
  );
}

function Header() {
  return (
    <>
      <LogoHeader />
      <h1 style={{ margin: 0, textAlign: "center" }}>Mini Terminal</h1>
      <style jsx>{`
        h1 {
          font-size: 2.8rem;
        }
        @media only screen and (max-width: 500px) {
          h1 {
            font-size: 2.4rem;
          }
        }
      `}</style>
    </>
  );
}

function Demo() {
  const [progress, backward, rangeProps] = useStepsProgress({
    stepsCount: steps.length,
    delay: 3000,
  });
  return (
    <div>
      <MiniTerminal
        title="bash"
        style={{ height: 200 }}
        progress={progress}
        backward={backward}
        steps={steps}
      />
      <StepsRange {...rangeProps} />
      <style jsx>{`
        div {
          margin: 48px auto 24px;
        }
        @media only screen and (max-width: 500px) {
          div {
            margin: 24px auto 24px;
          }
        }
      `}</style>
    </div>
  );
}

const steps = [
  {
    text: `$ lorem ipsum
dolor sit amet
consectetur adipiscing elit
$ sed do`,
  },
  {
    text: `$ eiusmod tempor incididunt
ut labore et dolore`,
  },
  {
    text: `$ magna aliqua
ut enim ad minim veniam
quis nostrud
exercitation ullamco laboris nisi ut aliquip
ex ea commodo consequat
$ duis aute irure dolor
in reprehenderit`,
  },
  {
    text: `$ in voluptate
velit esse cillum dolore
$ eu fugiat nulla pariatur`,
  },
  {
    text: `$ excepteur sint occaecat
cupidatat non proident
sunt in culpa qui
officia deserunt
$ mollit anim id est laborum
$ `,
  },
];
