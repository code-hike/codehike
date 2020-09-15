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
    </section>
  )
}

function TalkDemo() {
  return (
    <div className={s.demo}>
      <img
        style={{
          opacity: "var(--opacity)",
          width: "100%",
          height: "auto",
          background: "#222",
          margin: "0 auto",
          transform: "translateZ(-40px)",
        }}
        src="talk-cover.png"
      />
      <h3
        style={{
          transform: "translateZ(20px)",
          opacity: "var(--opacity)",
          margin: 0,
          fontSize: "1.6em",
        }}
      >
        0 Talk
      </h3>
    </div>
  )
}

function TutorialDemo() {
  return (
    <div className={s.demo}>
      <img
        style={{
          opacity: "var(--opacity)",
          width: "100%",
          height: "auto",
          background: "#222",
          margin: "0 auto",
          transform: "translateZ(-40px)",
        }}
        src="talk-cover.png"
      />
      <h3
        style={{
          transform: "translateZ(20px)",
          opacity: "var(--opacity)",
          margin: 0,
          fontSize: "1.6em",
        }}
      >
        Tutorial
      </h3>
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
      <img
        style={{
          opacity: "var(--opacity)",
          width: "auto",
          height: "100%",
          background: "#222",
          transform: "translateZ(-40px)",
        }}
        src="minidocs-cover.png"
      />
      <h3
        style={{
          opacity: "var(--opacity)",
          transform: "translateZ(20px)",
          fontSize: "1.6em",
        }}
      >
        Mini <br /> Docs
      </h3>
    </div>
  )
}
