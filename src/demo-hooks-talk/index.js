import React from "react";
import { MiniBrowser } from "packages/mini-browser/mini-browser";
import { MiniEditor } from "packages/mini-editor/mini-editor";
import { Player } from "packages/player/player";
import { useSpring } from "use-spring";
import { editorSteps, browserSteps, playerSteps } from "./steps";
import { CodeHikeLogo } from "src/code-hike-logo";
import Link from "next/link";

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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: "calc(100vh - 16px)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            height: 600,
            width: "100%",
          }}
        >
          <MiniEditor
            style={{ width: 600 }}
            progress={progress}
            steps={editorSteps}
          />
          <div style={{ width: 30 }} />
          <div style={{}}>
            <MiniBrowser
              url="http://localhost:3000/"
              height={385}
              style={{ width: 440 }}
            >
              {browserSteps[state.currentIndex]}
            </MiniBrowser>
            <div style={{ height: 30 }} />
            <Player
              videoId="dpw9EHDh2bM"
              style={{ height: 185 }}
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
      <Footer />
      <style jsx global>{`
        html {
          height: 100%;
          background: #ece9e6;
          background: -webkit-linear-gradient(
            -16deg,
            #ffffff,
            #d8d8d8,
            #ffffff
          );
          background: linear-gradient(-16deg, #ffffff, #d8d8d8, #ffffff);
        }
      `}</style>
    </>
  );
}

function Footer() {
  return (
    <footer
      style={{
        position: "fixed",
        bottom: 30,
        right: 30,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily:
          "Ubuntu,Droid Sans,-apple-system,BlinkMacSystemFont,Segoe WPC,Segoe UI,sans-serif",
      }}
    >
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
      <div style={{ height: "0.2em" }} />
      <div>
        Content from{" "}
        <a href="https://www.youtube.com/watch?v=dpw9EHDh2bM">
          Dan Abramov's talk
        </a>
      </div>
      <style jsx>{`
        a {
          color: ;
        }
      `}</style>
    </footer>
  );
}
