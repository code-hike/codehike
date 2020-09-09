import React from "react"
import s from "./landing.module.css"
import { CodeHikeHead } from "./code-hike-head"
import Link from "next/link"
import { Header } from "./header"
import { Footer } from "./footer"
import { Description } from "./landing/description"

export { LandingPage }

function LandingPage() {
  return (
    <div className={s.main}>
      <CodeHikeHead title="Marvellous code walkthroughs - Code Hike" />
      <Header className={s.header} />
      <Description />
      <Showcase />
      <Sponsors />
      <Tools />
      <Footer />
    </div>
  )
}

function Showcase() {
  return (
    <div className={s.demos}>
      <h2>Showcase</h2>
      <div className={s.listContainer}>
        <ul className={s.list}>
          <li>
            <Link href="demo/hooks-talk">
              <a className={s.box}>
                <h3>Player Demo</h3>
                <img
                  src="/video-tutorial.png"
                  style={{ padding: "2.32% 0" }}
                />
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
  )
}

function Sponsors() {
  return (
    <section>
      <h2>Sponsors</h2>
    </section>
  )
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
        <Tool
          title="MINI EDITOR"
          img="/mini-editor.png"
          href="mini-editor"
        />
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
  )
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
  )
}
