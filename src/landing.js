import React from "react";
import s from "./landing.module.css";
import { LeftIcon, RightIcon } from "./icons";
import { CodeHikeHead } from "./code-hike-head";
import Link from "next/link";
import { Header } from "./header";

export { LandingPage };

function LandingPage() {
  return (
    <div className={s.main}>
      <CodeHikeHead />
      <Header />
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
            <li className={s.box}>
              <h3>BLOG POST</h3>
            </li>
            <li>
              <Link href="demo/hooks-talk">
                <a className={s.box}>
                  <img src="/video-tutorial.jpg" />
                  <h3>VIDEO TUTORIAL</h3>
                </a>
              </Link>
            </li>
            <li className={s.box}>
              <h3>TALK SLIDES</h3>
            </li>
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
              <a className={s.box}>
                <img src="/mini-terminal.jpg" />
                <h3>MINI TERMINAL</h3>
              </a>
            </Link>
          </li>
          <li className={s.box}>
            <h3>MINI EDITOR</h3>
          </li>
          <li className={s.box}>
            <h3>MINI BROWSER</h3>
          </li>
          <li className={s.box}>
            <h3>MINI PHONE</h3>
          </li>
          <li className={s.box}>
            <h3>PLAYER</h3>
          </li>
          <li className={s.box}>
            <h3>SIM USER</h3>
          </li>
          <li className={s.box}>
            <h3>STEP SCROLLER</h3>
          </li>
          <li className={s.box}>
            <h3>COMING SOON</h3>
          </li>
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
