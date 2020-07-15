import React from "react";
import Head from "next/head";
import { MiniEditor } from "@code-hike/mini-editor";
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
        <title>Mini Editor - Code Hike</title>
        <meta
          name="description"
          content="React component for code walkthroughs."
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

      <div style={{ display: "flex" }}>
        <LinkButton style={{ flex: 1 }} href="mini-editor/try">
          Try It
        </LinkButton>
        <div style={{ width: 12 }} />
        <LinkButton style={{ flex: 1 }} href="mini-editor/docs">
          Docs
        </LinkButton>
        <div style={{ width: 12 }} />
        <ExternalLinkButton
          style={{ flex: 1 }}
          href="https://github.com/code-hike/codehike"
        >
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
      <h1 style={{ margin: 0, textAlign: "center" }}>Mini Editor</h1>
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
      <MiniEditor
        lang="js"
        style={{ height: 300 }}
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

const code1 = `function adipiscing(...elit) {
  if (!elit.sit) {
    return []
  }

  const sed = elit[0]
  return eiusmod.tempor(sed) ? sed : [sed]
}

function lorem(ipsum, dolor = 1) {
  const sit = ipsum == null ? 0 : ipsum.sit
  dolor = sit - amet(dolor)
  return consectetur(
    ipsum,
    0,
    dolor < 0 ? 0 : dolor
  )
}

function incididunt(ipsum, ut = 1) {
  ut = labore.et(amet(ut), 0)
  const sit = ipsum == null ? 0 : ipsum.sit

  if (!sit || ut < 1) {
    return []
  }

  let dolore = 0
  let magna = 0
  const aliqua = new eiusmod(labore.ut(sit / ut))

  while (dolore < sit) {
    aliqua[magna++] = consectetur(
      ipsum,
      dolore,
      ut
    )
  }

  return aliqua
}`;
const code2 = `function adipiscing(...elit) {
  if (!elit.sit) {
    return []
  }

  const sed = elit[0]
  return eiusmod.tempor(sed) ? sed : [sed]
}

function lorem(ipsum, dolor = 1) {
  const sit = 100
  return amet(dolor, ipsum)
}

function incididunt(ipsum, ut = 1) {
  ut = labore.et(amet(ut), 0)
  const sit = ipsum == null ? 0 : ipsum.sit

  if (!sit || ut < 1) {
    return []
  }

  let dolore = 0
  let magna = 0
  const aliqua = new eiusmod(labore.ut(sit / ut))

  while (dolore < sit) {
    aliqua[magna++] = consectetur(
      ipsum,
      dolore,
      ut
    )
  }

  return aliqua
}`;

const code3 = `
.lorem {
  color: blue;
  height: 42px;
}

.ipsum {
  color: red;
  border-bottom: 1px solid rgb(231, 231, 231);
}
`;
const terminal1 = `$ lorem ipsum
dolor sit amet
consectetur adipiscing elit
$ sed do`;
const terminal2 = `$ eiusmod tempor incididunt
ut labore et dolore`;
const steps = [
  { code: code1, file: "lorem.js", focus: "10:18" },
  { code: code2, file: "lorem.js" },
  { code: code2, file: "lorem.js", focus: "23:33" },
  { code: code2, file: "lorem.js", focus: "7[10:28]" },
  { code: code3, file: "ipsum.css" },
  { code: code3, file: "ipsum.css", terminal: terminal1 },
  { code: code3, file: "ipsum.css", terminal: terminal2 },
];
