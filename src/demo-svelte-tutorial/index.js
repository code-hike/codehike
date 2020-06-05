import React from "react";
import { CodeHikeHead } from "src/code-hike-head";
import s from "./index.module.css";
import { Step, Scroller } from "packages/scroller/scroller";
import { MiniTerminalTransitions } from "packages/mini-terminal";
import { useSpring } from "use-spring";

export { Demo };

function Demo() {
  const [index, setIndex] = React.useState(0);
  const [currentIndex] = useSpring(index);
  return (
    <>
      <CodeHikeHead title="Svelte Tutorial Demo | Code Hike" />

      <div className={s.page}>
        <main>
          <h1>Mini Svelte Tutorial</h1>
          <div className={s.content}>
            <Scroller onStepChange={setIndex}>
              <div className={s.text}>
                <Step index={0}>Something something 0</Step>
                <Step index={1}>Something something 1</Step>
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
