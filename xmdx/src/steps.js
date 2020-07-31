export const steps = [
  {
    editor: {
      code: require("!!raw-loader!../pages/hello.md")
        .default,
      file: "hello.md",
      tabs: ["hello.md"],
      lang: "md",
    },
    browser: {
      url: "http://localhost:3000/hello",
      zoom: 1.5,
    },
    video: { src: "000.mp4", start: 0, end: 5 },
  },
  {
    editor: {
      code: require("!!raw-loader!../pages/content/scroller.mdx")
        .default,
      focus: "10:20",
      file: "scroller.mdx",
      lang: "md",
      tabs: ["hello.md", "scroller.mdx"],
    },
    browser: {
      url: "http://localhost:3000/scroller",
      zoom: 0.4,
    },
    video: { src: "000.mp4", start: 0, end: 5 },
  },
  {
    editor: {
      code: require("!!raw-loader!../pages/content/scroller.mdx")
        .default,
      focus: "20:30",
      file: "scroller.mdx",
      lang: "md",
      tabs: ["hello.md", "scroller.mdx"],
    },
    browser: {
      url: "http://localhost:3000/scroller",
      zoom: 0.4,
    },
    video: { src: "000.mp4", start: 0, end: 5 },
  },
];

export const editorSteps = steps.map((s) => s.editor);
export const browserSteps = steps.map((s) => s.browser);
export const videoSteps = steps.map((s) => s.video);
