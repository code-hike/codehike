const lorem0 = require(`!!raw-loader!./steps/lorem.0.js`).default;
const lorem1 = require(`!!raw-loader!./steps/lorem.1.js`).default;
const lorem2 = require(`!!raw-loader!./steps/lorem.2.js`).default;

const editorSteps = [
  {
    code: lorem0,
    file: "lorem.js",
    lang: "js",
  },
  {
    code: lorem1,
    file: "lorem.js",
    lang: "js",
  },
  {
    code: lorem1,
    focus: "10:18",
    file: "lorem.js",
    lang: "js",
  },
  { code: lorem2, file: "lorem.js", lang: "js" },
  { code: lorem2, file: "lorem.js", lang: "js" },
];

const editorTexts = [
  "Lorem ipsum dolor sit amet consectetur adipiscing elit.",
  "Eiusmod tempor incididunt ut labore et dolore.",
  "Magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat",
  "In voluptate velit esse cillum dolore. Eu fugiat nulla pariatur.",
];

export { editorSteps, editorTexts };
