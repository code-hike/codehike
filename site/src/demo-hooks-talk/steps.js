import Demo0 from "./steps/0.0";
import Demo010 from "./steps/0.10.demo";
import Demo1 from "./steps/0.11.demo";
import { DemoContainer } from "./demo-container";

const steps = [
  chapter0("17:50-18:04", "0.0.js", <Demo0 name={`Mary`} />, { hide: true }),
  chapter0("18:04-18:23", "0.0.js", <Demo0 name={`Mary`} />),
  chapter0("18:25-18:39", "0.1.js", <Demo0 name={`Mary`} />),
  chapter0("18:39-18:44", "0.2.js", <Demo0 name={`Mary`} />),
  chapter0("18:44-18:55", "0.3.js", <Demo0 name={`Mary`} />),
  chapter0("18:55-18:59", "0.4.js", <Demo0 name={`Mary`} />),
  chapter0("19:09-19:15", "0.5.js", <Demo0 name={`Mary`} />),
  chapter0("19:15-19:18", "0.6.js", <Demo0 name={`Mary`} />),
  chapter0("19:18-19:24", "0.7.js", <Demo0 name={`Mary`} />),
  chapter0("19:24-19:33", "0.8.js", <Demo0 name={`Mary`} />),
  chapter0("19:33-19:40", "0.9.js", <Demo0 name={`Mary`} />),
  chapter0("19:40-19:44", "0.10.js", <Demo0 name={`Mary`} />),
  chapter0("19:44-19:48", "0.10.js", <Demo0 name={`Mary`} />),
  chapter0("19:48-19:52", "0.10.js", <Demo010 key="1" sim />),
  chapter0("19:52-19:55", "0.11.js", <Demo010 key="1" sim />),
  chapter0("19:55-19:59", "0.11.js", <Demo010 key="2" />, { hide: true }),
  chapter0("19:59-20:06", "0.11.js", <Demo1 />, { hide: true }),
  chapter0("20:06-20:12", "0.11.js", <Demo1 />),

  chapter1("20:12-20:28", "1.0.js", <Demo0 name={`Mary`} />),
  chapter1("20:28-20:31", "1.1.js", <Demo0 name={`Mary`} />),
  chapter1("20:31-20:42", "1.2.js", <Demo0 name={`Mary`} />),
  chapter1("20:42-20:51", "1.3.js", <Demo0 name={`Mary`} />),
  chapter1("20:51-20:58", "1.4.js", <Demo0 name={`Mary`} />),
  chapter1("20:58-21:13", "1.5.js", <Demo0 name={`Mary`} />),
  chapter1("21:13-21:20", "1.6.js", <Demo0 name={`Mary`} />),
  chapter1("21:20-21:22", "1.7.js", <Demo0 name={`Mary`} />),
  chapter1("21:31-21:48", "1.7.js", <Demo0 name={`Mary`} />, { focus: "5,6" }),
  chapter1("21:48-22:10", "1.8.js", <Demo0 name={`Mary`} />),
  chapter1("22:10-22:16", "1.9.js", <Demo0 name={`Mary`} />),
  chapter1("22:18-22:24", "1.10.js", <Demo0 name={`Mary`} />, { focus: "1,5" }),
  chapter1("22:24-22:26", "1.10.js", <Demo0 name={`Mary`} />),
  chapter1("22:26-22:39", "1.10.js", <Demo1 />),
];

function chapter0(time, file, demo, { focus, hide } = {}) {
  return {
    player: { hide, ...t(time) },
    demo,
    editor: {
      code: require(`!!raw-loader!./steps/${file}`).default,
      lang: "jsx",
      focus,
      file: "ClassExample.js",
      tabs: ["ClassExample.js"],
    },
  };
}

function chapter1(time, file, demo, { focus, hide } = {}) {
  return {
    player: { hide, ...t(time) },
    demo,
    editor: {
      code: require(`!!raw-loader!./steps/${file}`).default,
      lang: "jsx",
      focus,
      file: "FunctionExample.js",
      tabs: ["ClassExample.js", "FunctionExample.js"],
    },
  };
}

function t(ts) {
  const [startString, endString] = ts.split("-");
  const start = parseTime(startString);
  const end = parseTime(endString);
  const duration = end - start;
  return { start, end, duration };
}
function parseTime(string) {
  const [m, s] = string.split(":");
  return +m * 60 + +s;
}

export const playerSteps = steps.map((s) => s.player);
export const editorSteps = steps.map((s) => s.editor);
export const browserSteps = steps.map((s) => (
  <DemoContainer>{s.demo}</DemoContainer>
));
