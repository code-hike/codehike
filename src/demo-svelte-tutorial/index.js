import React from "react";
import { CodeHikeHead } from "src/code-hike-head";
import s from "./index.module.css";
import { Step, Scroller } from "packages/scroller/scroller";
import { MiniTerminalTransitions } from "packages/mini-terminal";
import { useSpring } from "use-spring";
import { steps } from "./steps";

const M = steps[0].text;
const M1 = steps[1].text;

export { Demo };

function Demo() {
  const [index, setIndex] = React.useState(0);
  const [currentIndex] = useSpring(index);
  return (
    <>
      <CodeHikeHead title="Blog Post Demo | Code Hike" />

      <div className={s.page}>
        <main>
          <h1>Blog Post Demo</h1>
          <div className={s.content}>
            <Scroller onStepChange={setIndex}>
              <div className={s.text}>
                <Step index={0}>
                  <M />
                </Step>
                <Step index={1}>
                  <M1 />
                </Step>
                <Step index={2}>Something something 2</Step>
                <Step index={3}>Something something 3</Step>
              </div>
            </Scroller>
            <div className={s.stickerContainer}>
              <div className={s.sticker}>
                <MiniTerminalTransitions
                  height="200px"
                  progress={currentIndex}
                  steps={[
                    "$ npx degit sveltejs/template my-svelte-project",
                    "$ cd my-svelte-project",
                    "$ npm install",
                    "$ npm run dev",
                  ]}
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
