import React from "react"
import s from "./showcase.module.css"
import { Carousel } from "./carousel"

export { Showcase }

function Showcase() {
  return (
    <section className={s.showcase}>
      <Carousel>
        <TalkDemo />
        <MiniDocsDemo />
        <TutorialDemo />
      </Carousel>
    </section>
  )
}

function TalkDemo() {
  return (
    <a
      className={s.demo}
      href="https://egghead.io/lessons/mdx-the-x-in-mdx"
    >
      <Browser>
        <img src="talk-cover.png" />
      </Browser>
      <h3>A Conference Talk</h3>
    </a>
  )
}

function TutorialDemo() {
  return (
    <a
      className={s.demo}
      href="https://pomb.us/nextjs-static-props/"
    >
      <Browser>
        <img src="tutorial-cover.png" />
      </Browser>
      <h3>A Tutorial</h3>
    </a>
  )
}

function MiniDocsDemo() {
  return (
    <a
      className={s.demo}
      href="https://swr-minidocs.codehike.org/"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className={s.phone}>
        <img src="minidocs-cover.png" />
      </div>
      <h3>
        A <br />
        Landing <br /> Page
      </h3>
    </a>
  )
}

function Browser({ children }) {
  return (
    <div className={s.browser}>
      <div className={s.menuBar}>
        <div className={s.circle} />
        <div className={s.circle} />
        <div className={s.circle} />
      </div>
      {children}
    </div>
  )
}
