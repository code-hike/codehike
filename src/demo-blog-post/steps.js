import { MiniBrowser } from "packages/mini-browser/mini-browser";
import { MiniEditor } from "packages/mini-editor/mini-editor";

const yarnCommands = `$ yarn install
Fetching packages...
Done.
$ yarn dev
Compiled successfully - ready on http://localhost:3000`;
const pr = (id) => `https://github.com/pomber/ssg-demo/pull/${id}/files`;

const files = {
  "01": {
    code: require(`!!raw-loader!./steps/01.package.jsonx`).default,
    tabs: ["package.json"],
    file: "package.json",
    lang: "json",
    link: pr("1/files#diff-b9cfc7f2cdf78a7f4b91a753d10865a2"),
  },
  "02": {
    code: require(`!!raw-loader!./steps/02.index.js`).default,
    tabs: ["package.json", "pages/index.js"],
    file: "pages/index.js",
    lang: "jsx",
    link: pr("1/files#diff-e14ec8fd2b038fbccea5f8090d26ace4"),
  },
  "04.index.js": {
    code: require("!!raw-loader!./steps/04.index.js").default,
    lang: "jsx",
    file: "pages/index.js",
    tabs: ["package.json", "pages/index.js"],
    link: pr(2),
  },
  "05.index.js": {
    code: require("!!raw-loader!./steps/05.index.js").default,
    lang: "jsx",
    file: "pages/index.js",
    link: pr(3),
  },
  "06.0.index.js": {
    code: require("!!raw-loader!./steps/06.0.index.js").default,
    lang: "jsx",
    file: "pages/index.js",
    link: pr(4),
  },
  "07.index.js": {
    code: require("!!raw-loader!./steps/07.index.js").default,
    lang: "jsx",
    file: "pages/index.js",
    link: pr(5),
  },
  "08.index.js": {
    code: require("!!raw-loader!./steps/08.index.js").default,
    lang: "jsx",
    file: "pages/index.js",
    link: pr(6),
  },
  "09.0.index.js": {
    code: require("!!raw-loader!./steps/09.0.index.js").default,
    lang: "jsx",
    file: "pages/index.js",
    link: pr(22),
  },
  "11.index.js": {
    code: require("!!raw-loader!./steps/11.index.js").default,
    lang: "jsx",
    file: "pages/index.js",
    link: pr(23),
  },
  "12.index.js": {
    code: require("!!raw-loader!./steps/12.index.js").default,
    lang: "jsx",
    file: "pages/index.js",
    link: pr(24),
  },
  "13.0.index.js": {
    code: require("!!raw-loader!./steps/13.0.index.js").default,
    lang: "jsx",
    file: "pages/index.js",
    link: pr(25),
  },
  "13.1.index.js": {
    code: require("!!raw-loader!./steps/13.1.index.js").default,
    lang: "jsx",
    file: "pages/index.js",
    link: pr(26),
  },
  "14.country.js": {
    code: require("!!raw-loader!./steps/14.country.js").default,
    lang: "jsx",
    file: "pages/country/[name].js",
    link: pr(27),
  },
  "15.country.js": {
    code: require("!!raw-loader!./steps/15.country.js").default,
    lang: "jsx",
    file: "pages/country/[name].js",
    link: pr(28),
  },
  "16.country.js": {
    code: require("!!raw-loader!./steps/16.country.js").default,
    lang: "jsx",
    file: "pages/country/[name].js",
    link: pr(29),
  },
  "17.country.js": {
    code: require("!!raw-loader!./steps/17.country.js").default,
    lang: "jsx",
    file: "pages/country/[name].js",
    link: pr(30),
  },
};

const defaultProps = {
  [MiniEditor]: { height: 350 },
  [MiniBrowser]: { height: 300 },
};

const steps = p(
  s(
    "00",
    <Box1 height={100} />,
    <MiniBrowser url="https://nextjs-static-props.now.sh/">
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
    <MiniBrowser url="https://ssg-demo-lcyw9q4p0.now.sh/" />
  ),
  s(
    "05",
    <MiniEditor step={files["04.index.js"]} />,
    <MiniBrowser url="https://ssg-demo-6t2d6smox.now.sh/" />
  ),
  s(
    "06",
    <MiniEditor step={{ ...files["05.index.js"], focus: "13[80],18:28" }} />,
    <MiniBrowser url="https://ssg-demo-6840hkb70.now.sh/" />
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

console.log(steps);
export { steps };

function Box1({ height, progress }) {
  return (
    <div style={{ height, background: "lime", width: "100%" }}>{progress}</div>
  );
}
