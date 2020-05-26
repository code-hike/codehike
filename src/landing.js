import React from "react";
import s from "./landing.module.css";
import { CodeHikeLogo } from "./code-hike-logo";

export { LandingPage };

function LandingPage() {
  return (
    <div className={s.main}>
      <header className={s.header}>
        <CodeHikeLogo className={s.logo} />
        <div className={s.space} />
        <h1>
          <span className={s.code}>Code</span>
          <span className={s.space} />
          <span className={s.hike}>Hike</span>
        </h1>
      </header>
      <p className={s.description}>
        An <strong>open source</strong> tool set to build marvellous{" "}
        <strong>code walkthroughs</strong>. Code Hike provides the building
        blocks for video tutorials, blog posts, talk slides, codebase
        onboarding, docs, and on and on.
      </p>
      <div className={s.demos}>
        <h2>Demos</h2>
        <ul className={s.list}>
          <li className={s.box}>1</li>
          <li className={s.box}>2</li>
          <li className={s.box}>3</li>
          <li className={s.box}>4</li>
        </ul>
      </div>
      <div className={s.tools}>
        <h2>Tools</h2>
        <ul className={s.list}>
          <li className={s.box}>1</li>
          <li className={s.box}>2</li>
          <li className={s.box}>3</li>
          <li className={s.box}>4</li>
          <li className={s.box}>5</li>
          <li className={s.box}>6</li>
          <li className={s.box}>7</li>
          <li className={s.box}>8</li>
        </ul>
      </div>
      <footer className={s.footer}>
        <span>GitHub</span>
        <span>Twitter</span>
        <span>Open Collective</span>
      </footer>
    </div>
  );
}
