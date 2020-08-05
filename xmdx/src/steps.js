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
];

export const editorSteps = steps.map((s) => s.editor);
export const browserSteps = steps.map((s) => s.browser);
export const videoSteps = steps.map((s) => s.video);
