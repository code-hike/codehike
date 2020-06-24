const app0 = require(`!!raw-loader!./steps/0.js`).default;
const app1 = require(`!!raw-loader!./steps/1.js`).default;
const app2 = require(`!!raw-loader!./steps/2.js`).default;
const app3 = require(`!!raw-loader!./steps/3.js`).default;
const app4 = require(`!!raw-loader!./steps/4.js`).default;
const app5 = require(`!!raw-loader!./steps/5.js`).default;
const app6 = require(`!!raw-loader!./steps/6.js`).default;

const steps = [
  {
    code: app0,
    text:
      "With SWR, components will get a stream of data updates constantly and automatically.",
  },
  {
    code: app0,
    focus: "4:7",
    text: "useSWR accepts a key and a fetcher function.",
  },
  {
    code: app0,
    focus: "5",
    text:
      "key is a unique identifier of the data, normally the URL of the API.",
  },
  {
    code: app0,
    focus: "6",
    text:
      "Then key will be passed to fetcher, which can be any asynchronous function which returns the data.",
  },
  {
    code: app1,
    focus: "2:5,10",
    text:
      "fetcher can be any asynchronous function, so you can use your favourite data-fetching library to handle that part.",
  },
  {
    code: app2,
    focus: "2:5,9,10",
    text: "Or use GraphQL.",
  },

  {
    code: app2,
    focus: "8[9:23]",
    text:
      "useSWR returns 2 values: data and error, based on the status of the request.",
  },
  {
    code: app2,
    focus: "8[11:14],14",
    text:
      "When the request (fetcher) is not yet finished, data will be undefined.",
  },
  {
    code: app2,
    focus: "8,13,15",
    text:
      "And when we get a response, it sets data and error based on the result of fetcher and rerenders the component.",
  },
  {
    code: app3,
    focus: "1[1:6,16:39],9:15",
    text:
      "The context SWRConfig can provide global configurations for all SWR hooks.",
  },
  {
    code: app3,
    focus: "10:12,20",
    text: "For example, we can define a default fetcher.",
  },
  {
    code: app4,
    text: "There are many options, these are just a few.",
  },
  {
    code: app5,
    focus: "10,14,15,23,25,26",
    text: "You can always override options for specific hook calls.",
  },
  {
    code: app6,
    focus: "3,13,16:20",
    text: "You can enable the suspense option to use SWR with React Suspense.",
  },
  {
    code: app6,
    focus: "16:20,25:28",
    text:
      "In Suspense mode, data is always the fetch response (so you don't need to check if it's undefined). But if an error occurred, you need to use an error boundary to catch it.",
  },
];

const editorSteps = steps.map((s) => ({ ...s, file: "app.js", lang: "jsx" }));
const editorTexts = steps.map((s) => s.text);

export { editorSteps, editorTexts };
