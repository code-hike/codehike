import React from "react";
import s from "./landing.module.css";
import { LeftIcon, RightIcon } from "./icons";
import { CodeHikeHead } from "./code-hike-head";
import Link from "next/link";
import { Header } from "./header";
import { Footer } from "./footer";

export { LandingPage };

function LandingPage() {
  return (
    <div className={s.main}>
      <CodeHikeHead />
      <Header className={s.header} />
      <p className={s.description}>
        An <strong>open source</strong> tool set to build marvellous{" "}
        <strong>code walkthroughs</strong>. Code Hike provides the building
        blocks for video tutorials, blog posts, talk slides, codebase
        onboarding, docs, and on and on.
      </p>
      <div className={s.experimental}>
        <span className={s.label}>June 2020 status:</span>{" "}
        <p>
          Packages aren't published yet. I'm building different kind of demos to
          use them as a guide to define the right APIs. Follow{" "}
          <a href="https://twitter.com/codehike_">@codehike_</a> for updates.
        </p>
      </div>
      <Demos />
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
      <Footer />
    </div>
  );
}

function Demos() {
  return (
    <div className={s.demos}>
      <div className={s.listContainer}>
        <ul className={s.list}>
          <li>
            <Link href="demo/hooks-talk">
              <a className={s.box}>
                <h3>Player Demo</h3>
                <img src="/video-tutorial.png" style={{ padding: "2.32% 0" }} />
              </a>
            </Link>
          </li>
          <li className={s.box}>
            <Link href="demo/blog-post">
              <a className={s.box}>
                <h3>Blog Demo</h3>
                <img src="/post-thumb.png" />
              </a>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
