import { MiniBrowser } from "packages/mini-browser/mini-browser";
import { MiniEditor } from "packages/mini-editor/mini-editor";

const yarnCommands = `$ yarn install
Fetching packages...
Done.
$ yarn dev
Compiled successfully - ready on http://localhost:3000`;

const files = {
  "01": {
    code: require(`!!raw-loader!./steps/01.package.jsonx`).default,
    tabs: ["package.json"],
    file: "package.json",
    lang: "json",
  },
  "02": {
    code: require(`!!raw-loader!./steps/02.index`).default,
    tabs: ["package.json", "pages/index.js"],
    file: "pages/index.js",
    lang: "jsx",
  },
};

const defaultProps = {
  [MiniEditor]: { height: 300 },
  [MiniBrowser]: { height: 300 },
};

const steps = p(
  s(
    "00",
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
    </MiniBrowser>
  ),
  s("01", <MiniEditor step={files["01"]} />),
  s("02", <MiniEditor step={files["02"]} />),
  s(
    "03",
    <MiniEditor
      step={{ ...files["02"], terminal: yarnCommands, focus: "2[1]" }}
    />
  ),
  s(
    "04",
    <MiniEditor step={files["02"]} />,
    <MiniBrowser url="https://nextjs-static-props.now.sh/" />
  )
);

function s(mdx, ...rows) {
  return {
    text: require(`./steps/${mdx}.mdx`).default,
    rows,
  };
}

function p(...ss) {
  const stepsByType = {};

  // find all types
  ss.forEach((s) =>
    s.rows.forEach((e) => {
      if (!(e.type in stepsByType))
        stepsByType[e.type] = Array(ss.length).fill({});
    })
  );

  // create a step list for each type based on the step prop
  ss.forEach((s, index) =>
    s.rows.forEach((e) => {
      const step = (e.props && e.props.step) || {};
      stepsByType[e.type][index] = step;
    })
  );

  // create the elements with the steps prop instead of step
  // add the default props for each type
  return ss.map((s) => {
    return {
      text: s.text,
      sticker: s.rows.map((e) => {
        const { step, ...props } = e.props || {};
        return React.createElement(e.type, {
          steps: stepsByType[e.type],
          ...defaultProps[e.type],
          ...props,
        });
      }),
    };
  });
}

export { steps };

function Box1({ height, progress }) {
  return (
    <div style={{ height, background: "lime", width: "100%" }}>{progress}</div>
  );
}
