import React from "react";
import { useSpring } from "use-spring";
import { MiniEditor } from "@code-hike/mini-editor";
import { Scroller, Step } from "@code-hike/scroller";
import { CodeHikeHead } from "src/code-hike-head";
import { editorSteps, editorTexts } from "./steps";
import s from "./index.module.css";

export { Demo };

function Demo() {
  return (
    <div className={s.page}>
      <Header />
      <Walkthrough />
      <Footer />
    </div>
  );
}

function Walkthrough() {
  const editorHeight = 300;
  const scrollerRootMargin = (vh) =>
    `-${(vh - (editorHeight - 120)) / 2 - 2}px 0px -${
      (vh + (editorHeight - 120)) / 2 - 2
    }px`;

  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [progress] = useSpring(currentIndex, {
    decimals: 3,
    stiffness: 80,
    damping: 48,
    mass: 8,
  });
  return (
    <section>
      <div
        className={s.sticker}
        style={{
          top: `calc(100vh - ${editorHeight}px)`,
          height: editorHeight + 1,
        }}
      >
        <MiniEditor
          height={editorHeight - 25}
          progress={progress}
          steps={editorSteps}
        />
      </div>
      <div>
        <Scroller
          onStepChange={setCurrentIndex}
          getRootMargin={scrollerRootMargin}
        >
          <ol
            style={{
              marginTop: -editorHeight + 30,
              paddingBottom: editorHeight - 30,
            }}
          >
            {editorTexts.map((text, i) => (
              <Step
                as="li"
                className={s.step}
                key={i}
                index={i}
                style={{ opacity: currentIndex === i ? 0.999 : 0.15 }}
              >
                {text}
              </Step>
            ))}
          </ol>
        </Scroller>
      </div>
    </section>
  );
}

function Header() {
  return (
    <>
      <CodeHikeHead title="SWR MiniDocs Demo | Code Hike" />
      <header>
        <h1>SWR</h1>
        <h3>React Hooks for Remote Data Fetching</h3>
        <p>
          <a href="https://swr.now.sh/">Go to official docs</a>
        </p>
      </header>
    </>
  );
}

function Footer() {
  return (
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
  );
}
