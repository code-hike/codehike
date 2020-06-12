import { MiniBrowser } from "packages/mini-browser/mini-browser";
import { MiniEditor } from "packages/mini-editor/mini-editor";

const yarnCommands = `$ yarn install
Fetching packages...
Done.
$ yarn dev
Compiled successfully - ready on http://localhost:3000`;

const editorSteps = [
  {},
  {
    code: require(`!!raw-loader!./steps/0.1.package.jsonx`).default,
    tabs: ["package.json"],
    file: "package.json",
    lang: "json",
  },
  {
    code: require(`!!raw-loader!./steps/0.2.index`).default,
    tabs: ["package.json", "pages/index.js"],
    file: "pages/index.js",
    lang: "jsx",
  },
  {
    code: require(`!!raw-loader!./steps/0.2.index`).default,
    tabs: ["package.json", "pages/index.js"],
    file: "pages/index.js",
    lang: "jsx",
    terminal: yarnCommands,
    focus: "2[1]",
  },
];

const steps = [
  step("0.0", [
    <Box1 height={100} />,
    <MiniBrowser height={300} url="https://nextjs-static-props.now.sh/">
      <video
        autoPlay
        loop
        muted
        playsInline
        type="video/mp4"
        src="https://pomb.us/static/demo-75c5b2395f634c494e40b8008eef20eb.mp4"
      />
    </MiniBrowser>,
  ]),
  step("0.1", [<MiniEditor steps={editorSteps} height={300} />]),
  step("0.2", [<MiniEditor steps={editorSteps} height={300} />]),
  step("0.3", [<MiniEditor steps={editorSteps} height={300} />]),
];

function step(number, sticker) {
  return {
    text: require(`./steps/${number}.mdx`).default,
    sticker,
  };
}

export { steps };

function Box1({ height, progress }) {
  return (
    <div style={{ height, background: "lime", width: "100%" }}>{progress}</div>
  );
}
