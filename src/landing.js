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
      <Tools />
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

function Tools() {
  return (
    <div className={s.tools}>
      <h2>Building Blocks</h2>
      <ul className={s.list}>
        <Tool
          title="MINI TERMINAL"
          img="/mini-terminal.jpg"
          href="mini-terminal"
        />
        <Tool title="MINI EDITOR" href="mini-terminal" />
        <Tool title="MINI BROWSER" href="mini-terminal" />
        <Tool title="PLAYER" href="mini-terminal" />
        <Tool title="SIM USER" href="mini-terminal" />
        <Tool title="STEP SCROLLER" href="mini-terminal" />
        <Tool title="MORE COMING SOON" href="mini-terminal" />
      </ul>
    </div>
  );
}

function Tool({ title, img, href }) {
  return (
    <li>
      <Link href={href}>
        <a className={s.box}>
          {img ? (
            <img src={img} alt={title} />
          ) : (
            <div className={s.noMedia}>
              <div>?</div>
            </div>
          )}
          <h3>{title}</h3>
        </a>
      </Link>
    </li>
  );
}
