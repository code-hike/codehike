import React from "react";
import s from "./landing.module.css";
import { CodeHikeLogo } from "./code-hike-logo";
import { LeftIcon, RightIcon } from "./icons";
import { CodeHikeHead } from "./code-hike-head";
import Link from "next/link";

export { LandingPage };

function LandingPage() {
  return (
    <div className={s.main}>
      <CodeHikeHead />
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
        <div className={s.listContainer}>
          <ul className={s.list}>
            <li className={s.box}>BLOG POST</li>
            <li>
              <Link href="demo/hooks-talk">
                <a className={s.box}>VIDEO TUTORIAL</a>
              </Link>
            </li>
            <li className={s.box}>TALK SLIDES</li>
          </ul>
          <button className={s.prev} aria-label="Previous Demo">
            <LeftIcon />
          </button>
          <button className={s.next} aria-label="Next Demo">
            <RightIcon />
          </button>
        </div>
      </div>
      <div className={s.tools}>
        <h2>Tools</h2>
        <ul className={s.list}>
          <li>
            <Link href="mini-terminal">
              <a className={s.box}>MINI TERMINAL</a>
            </Link>
          </li>
          <li className={s.box}>MINI EDITOR</li>
          <li className={s.box}>MINI BROWSER</li>
          <li className={s.box}>MINI PHONE</li>
          <li className={s.box}>PLAYER</li>
          <li className={s.box}>SIM USER</li>
          <li className={s.box}>STEP SCROLLER</li>
          <li className={s.box}>COMING SOON</li>
        </ul>
      </div>
      <footer className={s.footer}>
        <a href="https://github.com/code-hike/codehike">GitHub</a>
        <a href="https://twitter.com/pomber">Twitter</a>
        <a href="https://opencollective.com/codehike">Open Collective</a>
      </footer>
    </div>
  );
}
