export const steps = [
  {
    editor: {
      code: require("!!raw-loader!../docs/hello.md")
        .default,
      file: "docs/hello.md",
      tabs: ["docs/hello.md"],
      lang: "md",
    },
    browser: {
      url: "http://localhost:3000/hello.0",
      zoom: 1,
    },
    video: { src: "000.mp4", start: 0, end: 5 },
  },
  {
    editor: {
      code: require("!!raw-loader!../pages/hello.0.js")
        .default,
      file: "pages/hello.js",
      tabs: ["docs/hello.md", "pages/hello.js"],
      lang: "jsx",
    },
    browser: {
      url: "http://localhost:3000/hello.0",
      zoom: 1,
    },
    video: { src: "000.mp4", start: 0, end: 5 },
  },
  {
    editor: {
      code: require("!!raw-loader!../pages/hello.1.js")
        .default,
      file: "pages/hello.js",
      tabs: ["docs/hello.md", "pages/hello.js"],
      lang: "jsx",
    },
    browser: {
      url: "http://localhost:3000/hello.1",
      zoom: 1,
    },
    video: { src: "000.mp4", start: 0, end: 5 },
  },
  {
    editor: {
      code: require("!!raw-loader!../pages/hello.2.js")
        .default,
      file: "pages/hello.js",
      tabs: ["docs/hello.md", "pages/hello.js"],
      lang: "jsx",
    },
    browser: {
      url: "http://localhost:3000/hello.2",
      zoom: 1,
    },
    video: { src: "000.mp4", start: 0, end: 5 },
  },
  {
    editor: {
      code: require("!!raw-loader!../pages/hello.3.js")
        .default,
      file: "pages/hello.js",
      tabs: ["docs/hello.md", "pages/hello.js"],
      lang: "jsx",
    },
    browser: {
      url: "http://localhost:3000/hello.3",
      zoom: 1,
    },
    video: { src: "000.mp4", start: 0, end: 5 },
  },
  {
    editor: {
      code: require("!!raw-loader!../pages/hello.4.js")
        .default,
      file: "pages/hello.js",
      tabs: ["docs/hello.md", "pages/hello.js"],
      lang: "jsx",
    },
    browser: {
      url: "http://localhost:3000/hello.4",
      zoom: 1,
    },
    video: { src: "000.mp4", start: 0, end: 5 },
  },
  {
    editor: {
      code: require("!!raw-loader!../docs/steps.mdx")
        .default,
      file: "docs/steps.mdx",
      tabs: ["docs/steps.mdx", "pages/steps.js"],
      lang: "md",
    },
    browser: {
      url: "http://localhost:3000/steps.0",
      zoom: 1,
    },
    video: { src: "000.mp4", start: 0, end: 5 },
  },
  {
    editor: {
      code: require("!!raw-loader!../pages/steps.1.js")
        .default,
      file: "pages/steps.js",
      tabs: ["docs/steps.mdx", "pages/steps.js"],
      lang: "jsx",
      focus: "17:28",
    },
    browser: {
      url: "http://localhost:3000/steps.1",
      zoom: 0.8,
    },
    video: { src: "000.mp4", start: 0, end: 5 },
  },
  {
    editor: {
      code: require("!!raw-loader!../pages/steps.2.js")
        .default,
      file: "pages/steps.js",
      tabs: ["docs/steps.mdx", "pages/steps.js"],
      lang: "jsx",
    },
    browser: {
      url: "http://localhost:3000/steps.2",
      zoom: 0.4,
    },
    video: { src: "000.mp4", start: 0, end: 5 },
  },
  {
    editor: {
      code: require("!!raw-loader!../docs/steps.2.mdx")
        .default,
      file: "docs/steps.mdx",
      tabs: ["docs/steps.mdx", "pages/steps.js"],
      lang: "mdx",
    },
    browser: {
      url: "http://localhost:3000/steps.4",
      zoom: 0.4,
    },
    video: { src: "000.mp4", start: 0, end: 5 },
  },
  {
    editor: {
      code: require("!!raw-loader!../pages/steps.5.js")
        .default,
      file: "pages/steps.js",
      tabs: ["docs/steps.mdx", "pages/steps.js"],
      lang: "jsx",
    },
    browser: {
      url: "http://localhost:3000/steps.5",
      zoom: 0.4,
    },
    video: { src: "000.mp4", start: 0, end: 5 },
  },
  {
    editor: {
      code: require("!!raw-loader!../docs/steps.3.mdx")
        .default,
      file: "docs/steps.mdx",
      tabs: ["docs/steps.mdx", "pages/steps.js"],
      lang: "mdx",
      focus: "28",
    },
    browser: {
      url: "http://localhost:3000/steps.5",
      zoom: 0.4,
    },
    video: { src: "000.mp4", start: 0, end: 5 },
  },
  {
    editor: {
      code: require("!!raw-loader!../pages/steps.6.js")
        .default,
      file: "pages/steps.js",
      tabs: ["docs/steps.mdx", "pages/steps.js"],
      lang: "jsx",
    },
    browser: {
      url: "http://localhost:3000/steps.6",
      zoom: 0.4,
    },
    video: { src: "000.mp4", start: 0, end: 5 },
  },
  {
    editor: {
      code: require("!!raw-loader!../pages/steps.6.js")
        .default,
      file: "pages/steps.js",
      tabs: ["docs/steps.mdx", "pages/steps.js"],
      lang: "jsx",
    },
    browser: {
      url: "http://localhost:3000/",
      zoom: 0.4,
    },
    video: { src: "000.mp4", start: 0, end: 5 },
  },
  {
    editor: {
      code: require("!!raw-loader!../package.json.copy")
        .default,
      file: "package.json",
      tabs: [
        "docs/steps.mdx",
        "pages/steps.js",
        "package.json",
      ],
      lang: "json",
      focus: "4:15",
    },
    browser: {
      url: "https://codehike.org",
      zoom: 0.8,
    },
    video: { src: "000.mp4", start: 0, end: 5 },
  },
]

export const editorSteps = steps.map(s => s.editor)
export const browserSteps = steps.map(s => s.browser)
export const videoSteps = steps.map(s => s.video)
