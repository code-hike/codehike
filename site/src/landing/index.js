import React from "react"
import s from "./landing.module.css"
import { CodeHikeHead } from "../code-hike-head"
import Link from "next/link"
import { Header } from "../header"
import { Description } from "./description"
import { Showcase } from "./showcase"
import { Sponsors } from "./sponsors"

export { LandingPage }

function LandingPage({ sponsors }) {
  return (
    <div className={s.main}>
      <CodeHikeHead title="Marvellous code walkthroughs - Code Hike" />
      <div className={s.linksBar}>
        <a href="https://github.com/code-hike/codehike">
          GitHub
        </a>
        <a href="https://twitter.com/codehike_">Twitter</a>
        <a href="https://opencollective.com/codehike">
          Open Collective
        </a>
      </div>
      <section>
        <Header className={s.header} />
        <Description />
      </section>
      <section className={s.dark}>
        <SectionTitle>Showcase</SectionTitle>
        <Showcase />
      </section>
      {/* <ShowcaseX /> */}
      <section className={s.blue}>
        <SectionTitle>Sponsors</SectionTitle>
        <Sponsors sponsors={sponsors} />
      </section>
      <section>
        <SectionTitle id="building-blocks">
          Building Blocks
        </SectionTitle>
        <Tools />
      </section>
    </div>
  )
}

function Tools() {
  return (
    <div className={s.tools} id="building-blocks">
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

function SectionTitle({ children, id }) {
  return (
    <div className={s.titleContainer}>
      {/* <div className={s.line} /> */}
      <h2 className={s.title} id={id}>
        {children}
      </h2>
      {/* <div className={s.line} /> */}
    </div>
  )
}
