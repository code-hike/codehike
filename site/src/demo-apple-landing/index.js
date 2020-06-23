import React from "react";
import s from "./index.module.css";
import { CodeHikeHead } from "src/code-hike-head";
import { MiniTerminal } from "@code-hike/mini-terminal";
import { Scroller, Step } from "@code-hike/scroller";

export { Demo };

function Demo() {
  return (
    <div className={s.page}>
      <CodeHikeHead title="Apple Landing Demo | Code Hike" />
      <header>
        <h3>Cloning Apple landing page, with Code Hike.</h3>
        <p>
          <a href="/">Go to Code Hike home</a>
        </p>
      </header>
      <div className={s.step}>
        Lorem ipsum dolor sit amet, cons ectetur adi piscing elit. Vesti bulum
        id elit vitae quam laoreet posuere in eu nisl.
      </div>
      <Section title="First" />
      <Section title="Second" />
      <footer>
        <p>
          Built with <a href="/">Code Hike</a>
        </p>
        <nav>
          <a href="https://twitter.com/codehike_">Twitter</a> •{" "}
          <a href="https://opencollective.com/code-hike">Open Collective</a> •{" "}
          <a href="https://github.com/code-hike/codehike">GitHub</a>
        </nav>
      </footer>
    </div>
  );
}

function Section({ title }) {
  const [currentIndex, setCurrentIndex] = React.useState(null);
  const h = 260;
  return (
    <section>
      <h3 className={s.sectionTitle}>{title}</h3>
      <div
        className={s.sticker}
        style={{ top: `calc(100vh - ${h}px)`, height: h + 1 }}
      >
        <Sticker style={{ height: h - 40 }} index={currentIndex} />
        {/* <MiniTerminal text="$ foo" height={h - 50} style={{ width: 300 }} /> */}
      </div>
      <div>
        <Scroller onStepChange={setCurrentIndex}>
          <ol style={{ marginTop: -h + 30, paddingBottom: h }}>
            <Step
              as="li"
              index={0}
              className={s.step}
              style={{ opacity: currentIndex === 0 ? 1 : 0.5 }}
            >
              Lorem ipsum dolor sit amet consectetur adipiscing elit.
            </Step>
            <Step
              as="li"
              index={1}
              className={s.step}
              style={{ opacity: currentIndex === 1 ? 1 : 0.5 }}
            >
              Eiusmod tempor incididunt ut labore et dolore.
            </Step>
            <Step
              as="li"
              index={2}
              className={s.step}
              style={{ opacity: currentIndex === 2 ? 1 : 0.5 }}
            >
              Magna aliqua ut enim ad minim veniam quis nostrud exercitation
              ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </Step>
            <Step
              as="li"
              index={3}
              className={s.step}
              style={{ opacity: currentIndex === 3 ? 1 : 0.5 }}
            >
              In voluptate velit esse cillum dolore. Eu fugiat nulla pariatur.
            </Step>
            <Step
              as="li"
              index={4}
              className={s.step}
              style={{ opacity: currentIndex === 4 ? 1 : 0.5 }}
            >
              Excepteur sint occaecat cupidatat non proident sunt in culpa qui
              officia deserunt.
            </Step>
          </ol>
        </Scroller>
      </div>
    </section>
  );
}

function Sticker({ index, style }) {
  return (
    <div
      style={{
        ...style,
        background: "rgb(42,42,42)",
        border: "1px solid rgb(58,58,58)",
        borderRadius: 6,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: 60,
        color: "rgb(100,100,100)",
      }}
    >
      {index}
    </div>
  );
}
