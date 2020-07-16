import React from "react";
import { useSpring } from "use-spring";
import { MiniTerminal } from "@code-hike/mini-terminal";
import { MiniEditor } from "@code-hike/mini-editor";
import { Scroller, Step } from "@code-hike/scroller";
import { CodeHikeHead } from "src/code-hike-head";
import { editorSteps, editorTexts } from "./editor-steps";
import { terminalSteps, terminalTexts } from "./terminal-steps";
import s from "./index.module.css";

export { Demo };

const terminalHeight = 260;
const editorHeight = 300;
function Demo() {
  return (
    <div className={s.page}>
      <Header />
      <Section
        title="First"
        stickerHeight={terminalHeight}
        Sticker={TerminalSticker}
        texts={terminalTexts}
      />
      <Section
        title="Second"
        stickerHeight={editorHeight}
        Sticker={EditorSticker}
        texts={editorTexts}
      />
      <Footer />
    </div>
  );
}

function TerminalSticker({ progress }) {
  return (
    <MiniTerminal
      title="bash"
      height={terminalHeight - 25}
      progress={progress}
      steps={terminalSteps}
    />
  );
}

function EditorSticker({ progress }) {
  return (
    <MiniEditor
      height={editorHeight - 25}
      progress={progress}
      steps={editorSteps}
    />
  );
}

function Section({ title, stickerHeight, Sticker, texts }) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [progress] = useSpring(currentIndex, {
    decimals: 3,
    stiffness: 80,
    damping: 48,
    mass: 8,
  });
  return (
    <section>
      <h3 className={s.sectionTitle}>{title}</h3>
      <div
        className={s.sticker}
        style={{
          top: `calc(100vh - ${stickerHeight}px)`,
          height: stickerHeight + 1,
        }}
      >
        <Sticker progress={progress} />
      </div>
      <div>
        <Scroller
          onStepChange={setCurrentIndex}
          getRootMargin={(vh) =>
            `-${(vh - (stickerHeight - 120)) / 2 - 2}px 0px -${
              (vh + (stickerHeight - 120)) / 2 - 2
            }px`
          }
        >
          <ol
            style={{
              marginTop: -stickerHeight + 30,
              paddingBottom: stickerHeight - 30,
            }}
          >
            {texts.map((text, i) => (
              <Step
                as="li"
                key={i}
                index={i + 1}
                style={{ opacity: currentIndex === i + 1 ? 0.999 : 0.15 }}
                className={s.step}
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
      <CodeHikeHead title="Apple Landing Demo | Code Hike" />
      <header>
        <h3>Cloning Apple landing page, with Code&nbsp;Hike.</h3>
        <p>
          <a href="/">Go to Code Hike home</a>
        </p>
      </header>
      <div className={s.step}>
        Lorem ipsum dolor sit amet, cons ectetur adi piscing elit. Vesti bulum
        id elit vitae quam laoreet posuere in eu nisl.
      </div>
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
