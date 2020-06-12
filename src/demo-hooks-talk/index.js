import React from "react";
import { MiniBrowser } from "packages/mini-browser/mini-browser";
import { MiniEditor } from "packages/mini-editor/mini-editor";
import { Player } from "packages/player/player";
import { useSpring } from "use-spring";
import { editorSteps, browserSteps, playerSteps } from "./steps";
import { CodeHikeLogo } from "src/code-hike-logo";
import Link from "next/link";
import { CodeHikeHead } from "src/code-hike-head";
import s from "./index.module.css";

export function Demo() {
  const [state, setState] = React.useState({
    currentIndex: 0,
    stepProgress: 0,
    isPlaying: true,
  });

  const [progress] = useSpring(state.currentIndex, {
    decimals: 3,
    stiffness: 80,
    damping: 48,
    mass: 8,
  });
  return (
    <>
      <CodeHikeHead title="Hooks Talk Demo | Code Hike" />
      <GenerateScaleVar />
      <div className={s.page}>
        <main>
          <div className={s.pageTop} />
          <div className={s.content}>
            <div className={s.editor}>
              <MiniEditor
                progress={progress}
                steps={editorSteps}
                style={{ height: "100%" }}
              />
            </div>
            <div className={s.rightCol}>
              <div className={s.browser}>
                <MiniBrowser
                  url="http://localhost:3000/"
                  style={{ height: "100%" }}
                  children={browserSteps[state.currentIndex]}
                />
              </div>
              <div className={s.player}>
                <Player
                  videoId="dpw9EHDh2bM"
                  style={{ height: "100%" }}
                  steps={playerSteps}
                  stepIndex={state.currentIndex}
                  stepProgress={state.stepProgress}
                  isPlaying={state.isPlaying}
                  onChange={({ stepIndex, stepProgress, isPlaying }) =>
                    setState(() => ({
                      isPlaying,
                      currentIndex: stepIndex,
                      stepProgress,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div className={s.pageBottom}>
            <Footer />
          </div>
        </main>
      </div>
    </>
  );
}

function Footer() {
  return (
    <footer className={s.footer}>
      <div>
        Built with{" "}
        <Link href="/">
          <a>
            <CodeHikeLogo
              width="1.2em"
              height="1.2em"
              style={{ display: "inline-block", verticalAlign: "top" }}
            />{" "}
            <span
              style={{ fontFamily: `'Code', sans-serif`, fontSize: "1.2em" }}
            >
              Code
            </span>{" "}
            <span
              style={{ fontFamily: `'Hike', sans-serif`, fontWeight: "600" }}
            >
              Hike
            </span>
          </a>
        </Link>{" "}
        by <a href="https://twitter.com/pomber">@pomber</a>
      </div>
      <div>
        Content from{" "}
        <a href="https://www.youtube.com/watch?v=dpw9EHDh2bM">
          Dan Abramov's talk
        </a>
      </div>
    </footer>
  );
}

function GenerateScaleVar() {
  const js = `
(function() {
  function resetScale() {
    const M = 24;
    const W = 1024 
    const H = (W - M * 2) / 1.618 + M * 5;
    const root = document.documentElement;
    const scale = Math.min(1, root.clientWidth / W, root.clientHeight / H);
    root.style.setProperty('--scale', scale);
  }
  resetScale()
  window.addEventListener('resize', resetScale)
})()`;
  React.useLayoutEffect(() => {
    const M = 24;
    const W = 1024;
    const H = (W - M * 2) / 1.618 + M * 5;
    const root = document.documentElement;
    const scale = Math.min(1, root.clientWidth / W, root.clientHeight / H);
    root.style.setProperty("--scale", scale);
  }, []);
  return <script dangerouslySetInnerHTML={{ __html: js }} />;
}
