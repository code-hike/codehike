import React from "react"
import { Page } from "./utils"
import { Hike, Focus } from "@code-hike/scrollycoding"
import "@code-hike/scrollycoding/dist/index.css"

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

const steps = fillProps([
  {
    content: <LoremIpsum number={1} />,
    codeProps: {
      files: {
        "App.js": {
          code: `import React from 'react';

export default function App() {
  return <h1>Hello World</h1>
}`,
          lang: "jsx",
        },
      },
      activeFile: "App.js",
    },
  },
  {
    content: <LoremIpsum number={2} />,
    codeProps: {
      files: {
        "App.js": {
          code: `import React from 'react';

export default function Page() {
  return <h1>Hello Planet</h1>
}`,
          lang: "jsx",
        },
      },
      activeFile: "App.js",
    },
  },
  {
    content: <LoremIpsum number={3} />,
    codeProps: {
      files: {
        "App.js": {
          code: `import React from 'react';
import Button from './Button';

export default function Page() {
  return <div><h3>Hello Planet</h3><Button/></div>;
}`,
          lang: "jsx",
        },
        "Button.js": {
          code: `import React from 'react';

export default function Button() {
  return <button>Click Me</button>
}`,
          lang: "jsx",
        },
      },
      activeFile: "App.js",
    },
  },
  {
    content: <LoremIpsum number={4} />,
    codeProps: {
      focus: "5",
      files: {
        "App.js": {
          code: `import React from 'react';
import Button from './Button';

export default function Page() {
  return <><h1>Hello Planet</h1><Button/></>;
}`,
          lang: "jsx",
        },
        "Button.js": {
          code: `import React from 'react';

export default function Button() {
  return <button>Click Me</button>
}`,
          lang: "jsx",
        },
      },
      activeFile: "App.js",
    },
  },
])

function LoremIpsum({ number }) {
  return (
    <div>
      <h2>Section{number}</h2>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing
        elit. <Focus on="1[2:5]">Phasellus</Focus> sed felis
        fringilla, ornare risus{" "}
        <Focus on="1[2:5]">ac</Focus>, malesuada magna.
        Nulla ultricies mattis tortor feugiat eleifend.
        Integer vehicula nulla in elit ornare tristique.
        Vestibulum faucibus, enim at rutrum fermentum, nunc
        massa pulvinar justo, ac convallis nibh mi sed
        augue. Aenean pulvinar, odio dictum porta tempus,
        sem lorem pretium quam, sed blandit turpis velit ut
        mauris. Vivamus eget convallis leo.
      </p>
      <p style={{ lineHeight: "4rem", fontSize: "2rem" }}>
        Suspendisse pretium risus at erat pellentesque elit.{" "}
        <Focus on="1[2:5]">Phasellus</Focus> sed felis
        fringilla, ornare risus{" "}
        <Focus on="1[2:5]">ac</Focus>, malesuada magna.
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

function fillProps(preSteps) {
  return preSteps.map(({ codeProps, ...rest }) => ({
    codeProps,
    ...rest,
    previewProps: {
      files: { "/dApp.js": { code: "" } },
    },
  }))
}
