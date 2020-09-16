import React from "react"
import s from "./showcase.module.css"
import { Carousel } from "./carousel"

export { Showcase }

function Showcase() {
  return (
    <section className={s.showcase}>
      <Carousel>
        <TalkDemo />
        <TutorialDemo />
        <MiniDocsDemo />
      </Carousel>
      {/* <div className={s.rect}>
        <TalkDemo />
      </div>
      <div className={s.rect}>
        <MiniDocsDemo />
      </div>
      <div className={s.rect}>
        <TutorialDemo />
      </div> */}
    </section>
  )
}

function TalkDemo() {
  return (
    <div className={s.demo}>
      <Browser>
        <img src="talk-cover.png" />
      </Browser>
      <h3>A Conference Talk</h3>
    </div>
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

function TutorialDemo() {
  return (
    <div className={s.demo}>
      <Browser>
        <img src="tutorial-cover.png" />
      </Browser>
      <h3>A Tutorial</h3>
    </div>
  )
}

function MiniDocsDemo() {
  return (
    <div
      className={s.demo}
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
    </div>
  )
}
