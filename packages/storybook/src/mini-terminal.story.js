import React from "react"
import {
  MiniTerminal,
  InnerTerminal,
} from "@code-hike/mini-terminal"
import { WithProgress, Page } from "./utils"
import "@code-hike/mini-terminal/dist/index.css"

export default {
  title: "Test/Mini Terminal",
}

export const basic = () => (
  <Page>
    <MiniTerminal style={{ width: 300 }} text="$ foo" />
  </Page>
)

const steps = [
  {
    text: `$ lorem ipsum
dolor sit amet
consectetur adipiscing elit
$ sed do`,
  },
  {
    text: `$ eiusmod tempor incididunt
ut labore et dolore`,
  },
  {
    text: `$ magna aliqua
ut enim ad minim veniam
quis nostrud
exercitation ullamco laboris nisi ut aliquip
ex ea commodo consequat
$ duis aute irure dolor
in reprehenderit`,
  },
  {},
  {
    text: `$ excepteur sint occaecat
cupidatat non proident
sunt in culpa qui
officia deserunt
$ mollit anim id est laborum
$ `,
  },
]

export const transitions = () => (
  <WithProgress length={steps.length}>
    {progress => (
      <MiniTerminal
        progress={progress}
        steps={steps}
        style={{ height: 200 }}
      />
    )}
  </WithProgress>
)

export const inner = () => (
  <WithProgress length={steps.length}>
    {progress => (
      <InnerTerminal progress={progress} steps={steps} />
    )}
  </WithProgress>
)
