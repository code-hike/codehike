import React from "react";
import s from "./landing.module.css";
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
        Code Hike is an open-source toolset for building all types of{" "}
        <strong>code walkthroughs</strong>: blog posts, tutorials, quickstarts,
        slides, videos, workshops, docs, and so on.
      </p>
      <div className={s.experimental}>
        <span className={s.label}>July 2020 status:</span>{" "}
        <p>
          Currently working on prototypes and refining the APIs and package's
          boundaries. No packages published to npm yet.
        </p>
        <p>
          Follow <a href="https://twitter.com/codehike_">@codehike_</a> for
          updates.{" "}
          <a href="https://github.com/sponsors/code-hike">Sponsor Code Hike</a>{" "}
          if you wanna help.
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
          img="/mini-terminal.png"
          href="mini-terminal"
        />
        <Tool title="MINI EDITOR" img="/mini-editor.png" href="mini-editor" />
        <Tool
          title="MINI BROWSER"
          img="/mini-browser.png"
          href="mini-browser"
        />
        <Tool title="PLAYER" href="player" />
        <Tool title="SIM USER" href="sim-user" />
        <Tool title="STEP SCROLLER" href="step-scroller" />
        <Tool title="MORE COMING SOON" href="#" />
        <Tool title="MORE COMING SOON" href="#" />
        <Tool title="MORE COMING SOON" href="#" />
      </ul>
    </div>
  );
}

function Tool({ title, img, href }) {
  return (
    <li>
      <Link href={href}>
        <a className={s.box}>
          <div className={s.container}>
            {img ? (
              <img src={img} alt={title} />
            ) : (
              <div className={s.noMedia}>
                <div>?</div>
              </div>
            )}
          </div>
          <h3>{title}</h3>
        </a>
      </Link>
    </li>
  );
}
