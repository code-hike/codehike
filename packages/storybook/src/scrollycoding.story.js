import React from "react"
import { Page } from "./utils"
import { Hike, Focus } from "@code-hike/scrollycoding"

export default {
  title: "ScrollyCoding",
}
export const basic = () => {
  return (
    <Page
      style={{
        outline: "2px solid darkblue",
        maxWidth: 800,
      }}
    >
      <Hike steps={steps} />
    </Page>
  )
}

const steps = [
  {
    content: <LoremIpsum number={1} />,
    code: "console.log(1)",
  },
  {
    content: <LoremIpsum number={2} />,
    code: "console.log(2)",
  },
  {
    content: <LoremIpsum number={3} />,
    code: "console.log(3)",
  },
  {
    content: <LoremIpsum number={4} />,
    code: "console.log(4)",
  },
]

function LoremIpsum({ number }) {
  return (
    <div>
      <h2>Section{number}</h2>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing
        elit. <Focus focus="1[2:5]">Phasellus</Focus> sed
        felis fringilla, ornare risus ac, malesuada magna.
        Nulla ultricies mattis tortor feugiat eleifend.
        Integer vehicula nulla in elit ornare tristique.
        Vestibulum faucibus, enim at rutrum fermentum, nunc
        massa pulvinar justo, ac convallis nibh mi sed
        augue. Aenean pulvinar, odio dictum porta tempus,
        sem lorem pretium quam, sed blandit turpis velit ut
        mauris. Vivamus eget convallis leo.
      </p>
      <p>
        Suspendisse pretium risus at erat pellentesque
        faucibus. Praesent placerat venenatis mollis.
        Integer dapibus tristique tincidunt. Ut eu odio
        efficitur, fermentum tellus at, aliquet arcu. Donec
        placerat vestibulum lacus. Vivamus ac urna vel massa
        finibus mattis et vel lacus. Sed posuere aliquam
        metus, ut semper nisi facilisis commodo. Ut at
        tempus quam. Donec placerat laoreet finibus. In
        maximus nisi eu eleifend mollis.
      </p>
    </div>
  )
}
