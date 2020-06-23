import React from "react";
import s from "./index.module.css";
import { CodeHikeHead } from "src/code-hike-head";
import { MiniTerminalTransitions } from "@code-hike/mini-terminal";
import { MiniEditor } from "@code-hike/mini-editor";
import { Scroller, Step } from "@code-hike/scroller";
import { useSpring } from "use-spring";
import { editorSteps, editorTexts } from "./editor-steps";
import { terminalSteps, terminalTexts } from "./terminal-steps";

export { Demo };

function Demo() {
  return (
    <div className={s.page}>
      <Header />
      <FirstSection />
      <SecondSection />
      <Footer />
    </div>
  );
}

function FirstSection() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [progress] = useSpring(currentIndex, {
    decimals: 3,
    stiffness: 80,
    damping: 48,
    mass: 8,
  });
  const h = 260;
  return (
    <section>
      <h3 className={s.sectionTitle}>First</h3>
      <div
        className={s.sticker}
        style={{ top: `calc(100vh - ${h}px)`, height: h + 1 }}
      >
        <MiniTerminalTransitions
          title="bash"
          height={h - 50}
          progress={progress}
          steps={terminalSteps}
        />
      </div>
      <div>
        <Scroller onStepChange={setCurrentIndex} center={h}>
          <ol style={{ marginTop: -h + 30, paddingBottom: h }}>
            {terminalTexts.map((text, i) => (
              <Step
                as="li"
                key={i}
                index={i + 1}
                style={{ opacity: currentIndex === i + 1 ? 1 : 0.5 }}
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

function SecondSection() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [progress] = useSpring(currentIndex, {
    decimals: 3,
    stiffness: 80,
    damping: 48,
    mass: 8,
  });
  const h = 300;
  return (
    <section>
      <h3 className={s.sectionTitle}>Second</h3>
      <div
        className={s.sticker}
        style={{ top: `calc(100vh - ${h}px)`, height: h + 1 }}
      >
        <MiniEditor height={h - 50} progress={progress} steps={editorSteps} />
      </div>
      <div>
        <Scroller onStepChange={setCurrentIndex} center={h}>
          <ol style={{ marginTop: -h + 30, paddingBottom: h }}>
            {editorTexts.map((text, i) => (
              <Step
                as="li"
                key={i}
                index={i + 1}
                style={{ opacity: currentIndex === i + 1 ? 1 : 0.5 }}
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

const terminalHeight = 260;
function TerminalSticker({ progress }) {
  return (
    <MiniTerminalTransitions
      title="bash"
      height={terminalHeight - 50}
      progress={progress}
      steps={terminalSteps}
    />
  );
}

const editorHeight = 300;
function EditorSticker({ progress }) {
  return (
    <MiniEditor
      height={editorHeight - 50}
      progress={progress}
      steps={editorSteps}
    />
  );
}

function Section({ title, stickerHeight, Sticker }) {
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
        <Scroller onStepChange={setCurrentIndex} center={stickerHeight}>
          <ol
            style={{
              marginTop: -stickerHeight + 30,
              paddingBottom: stickerHeight,
            }}
          >
            {editorTexts.map((text, i) => (
              <Step
                as="li"
                key={i}
                index={i + 1}
                style={{ opacity: currentIndex === i + 1 ? 1 : 0.5 }}
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
