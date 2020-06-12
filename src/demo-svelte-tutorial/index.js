import React from "react";
import { CodeHikeHead } from "src/code-hike-head";
import s from "./index.module.css";
import { Step, Scroller } from "packages/scroller/scroller";
import { useSpring } from "use-spring";
import { steps } from "./steps";
import { SmoothColumn } from "packages/smooth-column/smooth-column";

export { Demo };

function Demo() {
  const [index, setIndex] = React.useState(0);
  const [currentIndex] = useSpring(index, {
    decimals: 3,
    stiffness: 24,
    damping: 12,
  });
  const backwards = index < currentIndex;
  return (
    <>
      <CodeHikeHead title="Blog Post Demo | Code Hike" />

      <div className={s.page}>
        <main>
          <h1>Blog Post Demo</h1>
          <div className={s.content}>
            <Scroller onStepChange={setIndex}>
              <div className={s.text}>
                {steps.map((step, i) => {
                  const Content = step.text;
                  return (
                    <Step
                      index={i}
                      key={i}
                      style={{
                        borderLeft: "10px solid",
                        borderColor:
                          index === i ? "var(--accent-color)" : "#eee",
                      }}
                    >
                      <Content />
                    </Step>
                  );
                })}
              </div>
            </Scroller>
            <div className={s.stickerContainer}>
              <div className={s.sticker}>
                <SmoothColumn
                  steps={steps.map((s) => s.sticker)}
                  progress={currentIndex}
                  backwards={backwards}
                />
              </div>
            </div>
          </div>
          <footer>Foo Bar</footer>
        </main>
      </div>
    </>
  );
}
