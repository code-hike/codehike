import { CodeBrowser } from "../src/mini-editor/code-browser"
import React from "react"

const files = [
  {
    name: "package.json",
    focus: "",
    code: {
      lines: [
        {
          tokens: [
            {
              content: "{",
              props: {
                style: {
                  color: "#ECEFF4",
                },
              },
            },
          ],
        },
        {
          tokens: [
            {
              content: "  ",
              props: {
                style: {
                  color: "#D8DEE9FF",
                },
              },
            },
            {
              content: '"',
              props: {
                style: {
                  color: "#ECEFF4",
                },
              },
            },
            {
              content: "name",
              props: {
                style: {
                  color: "#8FBCBB",
                },
              },
            },
            {
              content: '"',
              props: {
                style: {
                  color: "#ECEFF4",
                },
              },
            },
            {
              content: ":",
              props: {
                style: {
                  color: "#ECEFF4",
                },
              },
            },
            {
              content: " ",
              props: {
                style: {
                  color: "#D8DEE9FF",
                },
              },
            },
            {
              content: '"',
              props: {
                style: {
                  color: "#ECEFF4",
                },
              },
            },
            {
              content: "package.json",
              props: {
                style: {
                  color: "#A3BE8C",
                },
              },
            },
            {
              content: '"',
              props: {
                style: {
                  color: "#ECEFF4",
                },
              },
            },
          ],
        },
        {
          tokens: [
            {
              content: "}",
              props: {
                style: {
                  color: "#ECEFF4",
                },
              },
            },
          ],
        },
      ],
      lang: "json",
    },
    annotations: [],
  },
  {
    name: "pages/index.js",
    focus: "",
    code: {
      lines: [
        {
          tokens: [
            {
              content: "function",
              props: {
                style: {
                  color: "#81A1C1",
                },
              },
            },
            {
              content: " ",
              props: {
                style: {
                  color: "#D8DEE9FF",
                },
              },
            },
            {
              content: "IndexPage",
              props: {
                style: {
                  color: "#88C0D0",
                },
              },
            },
            {
              content: "()",
              props: {
                style: {
                  color: "#ECEFF4",
                },
              },
            },
            {
              content: " ",
              props: {
                style: {
                  color: "#D8DEE9FF",
                },
              },
            },
            {
              content: "{",
              props: {
                style: {
                  color: "#ECEFF4",
                },
              },
            },
          ],
        },
        {
          tokens: [
            {
              content: "  ",
              props: {
                style: {
                  color: "#D8DEE9FF",
                },
              },
            },
            {
              content: "return",
              props: {
                style: {
                  color: "#81A1C1",
                },
              },
            },
            {
              content: " ",
              props: {
                style: {
                  color: "#D8DEE9FF",
                },
              },
            },
            {
              content: "1",
              props: {
                style: {
                  color: "#B48EAD",
                },
              },
            },
          ],
        },
        {
          tokens: [
            {
              content: "}",
              props: {
                style: {
                  color: "#ECEFF4",
                },
              },
            },
          ],
        },
      ],
      lang: "js",
    },
    annotations: [],
  },
  {
    name: "pages/post/[slug].js",
    focus: "",
    code: {
      lines: [
        {
          tokens: [
            {
              content: "function",
              props: {
                style: {
                  color: "#81A1C1",
                },
              },
            },
            {
              content: " ",
              props: {
                style: {
                  color: "#D8DEE9FF",
                },
              },
            },
            {
              content: "PostPage",
              props: {
                style: {
                  color: "#88C0D0",
                },
              },
            },
            {
              content: "()",
              props: {
                style: {
                  color: "#ECEFF4",
                },
              },
            },
            {
              content: " ",
              props: {
                style: {
                  color: "#D8DEE9FF",
                },
              },
            },
            {
              content: "{",
              props: {
                style: {
                  color: "#ECEFF4",
                },
              },
            },
          ],
        },
        {
          tokens: [
            {
              content: "  ",
              props: {
                style: {
                  color: "#D8DEE9FF",
                },
              },
            },
            {
              content: "return",
              props: {
                style: {
                  color: "#81A1C1",
                },
              },
            },
            {
              content: " ",
              props: {
                style: {
                  color: "#D8DEE9FF",
                },
              },
            },
            {
              content: "1",
              props: {
                style: {
                  color: "#B48EAD",
                },
              },
            },
          ],
        },
        {
          tokens: [
            {
              content: "}",
              props: {
                style: {
                  color: "#ECEFF4",
                },
              },
            },
          ],
        },
      ],
      lang: "js",
    },
    annotations: [],
  },
  {
    name: "pages/alpha.ts",
    focus: "",
    code: {
      lines: [
        {
          tokens: [
            {
              content: "function",
              props: {
                style: {
                  color: "#81A1C1",
                },
              },
            },
            {
              content: " ",
              props: {
                style: {
                  color: "#D8DEE9FF",
                },
              },
            },
            {
              content: "AlphaPage",
              props: {
                style: {
                  color: "#88C0D0",
                },
              },
            },
            {
              content: "()",
              props: {
                style: {
                  color: "#ECEFF4",
                },
              },
            },
            {
              content: " ",
              props: {
                style: {
                  color: "#D8DEE9FF",
                },
              },
            },
            {
              content: "{",
              props: {
                style: {
                  color: "#ECEFF4",
                },
              },
            },
          ],
        },
        {
          tokens: [
            {
              content: "  ",
              props: {
                style: {
                  color: "#D8DEE9FF",
                },
              },
            },
            {
              content: "return",
              props: {
                style: {
                  color: "#81A1C1",
                },
              },
            },
            {
              content: " ",
              props: {
                style: {
                  color: "#D8DEE9FF",
                },
              },
            },
            {
              content: "1",
              props: {
                style: {
                  color: "#B48EAD",
                },
              },
            },
          ],
        },
        {
          tokens: [
            {
              content: "}",
              props: {
                style: {
                  color: "#ECEFF4",
                },
              },
            },
          ],
        },
      ],
      lang: "js",
    },
    annotations: [],
  },
  {
    name: "src/styles.css",
    focus: "",
    code: {
      lines: [
        {
          tokens: [
            {
              content: ".",
              props: {
                style: {
                  color: "#ECEFF4",
                },
              },
            },
            {
              content: "alpha",
              props: {
                style: {
                  color: "#8FBCBB",
                },
              },
            },
            {
              content: " ",
              props: {
                style: {
                  color: "#D8DEE9FF",
                },
              },
            },
            {
              content: "{",
              props: {
                style: {
                  color: "#ECEFF4",
                },
              },
            },
          ],
        },
        {
          tokens: [
            {
              content: "  ",
              props: {
                style: {
                  color: "#D8DEE9FF",
                },
              },
            },
            {
              content: "color",
              props: {
                style: {
                  color: "#D8DEE9",
                },
              },
            },
            {
              content: ":",
              props: {
                style: {
                  color: "#ECEFF4",
                },
              },
            },
            {
              content: " ",
              props: {
                style: {
                  color: "#D8DEE9FF",
                },
              },
            },
            {
              content: "red;",
              props: {
                style: {
                  color: "#81A1C1",
                },
              },
            },
          ],
        },
        {
          tokens: [
            {
              content: "}",
              props: {
                style: {
                  color: "#ECEFF4",
                },
              },
            },
          ],
        },
      ],
      lang: "css",
    },
    annotations: [],
  },
  {
    name: "src/comp.js",
    focus: "",
    code: {
      lines: [
        {
          tokens: [
            {
              content: "function",
              props: {
                style: {
                  color: "#81A1C1",
                },
              },
            },
            {
              content: " ",
              props: {
                style: {
                  color: "#D8DEE9FF",
                },
              },
            },
            {
              content: "AlphaPage",
              props: {
                style: {
                  color: "#88C0D0",
                },
              },
            },
            {
              content: "()",
              props: {
                style: {
                  color: "#ECEFF4",
                },
              },
            },
            {
              content: " ",
              props: {
                style: {
                  color: "#D8DEE9FF",
                },
              },
            },
            {
              content: "{",
              props: {
                style: {
                  color: "#ECEFF4",
                },
              },
            },
          ],
        },
        {
          tokens: [
            {
              content: "  ",
              props: {
                style: {
                  color: "#D8DEE9FF",
                },
              },
            },
            {
              content: "return",
              props: {
                style: {
                  color: "#81A1C1",
                },
              },
            },
            {
              content: " ",
              props: {
                style: {
                  color: "#D8DEE9FF",
                },
              },
            },
            {
              content: "<div",
              props: {
                style: {
                  color: "#81A1C1",
                },
              },
            },
            {
              content: " ",
              props: {
                style: {
                  color: "#D8DEE9FF",
                },
              },
            },
            {
              content: "className",
              props: {
                style: {
                  color: "#8FBCBB",
                },
              },
            },
            {
              content: "=",
              props: {
                style: {
                  color: "#81A1C1",
                },
              },
            },
            {
              content: '"',
              props: {
                style: {
                  color: "#ECEFF4",
                },
              },
            },
            {
              content: "alpha",
              props: {
                style: {
                  color: "#A3BE8C",
                },
              },
            },
            {
              content: '"',
              props: {
                style: {
                  color: "#ECEFF4",
                },
              },
            },
            {
              content: ">",
              props: {
                style: {
                  color: "#81A1C1",
                },
              },
            },
            {
              content: "1",
              props: {
                style: {
                  color: "#D8DEE9FF",
                },
              },
            },
            {
              content: "</div>",
              props: {
                style: {
                  color: "#81A1C1",
                },
              },
            },
          ],
        },
        {
          tokens: [
            {
              content: "}",
              props: {
                style: {
                  color: "#ECEFF4",
                },
              },
            },
          ],
        },
      ],
      lang: "js",
    },
    annotations: [],
  },
]

export default function Page() {
  return (
    <div>
      <CodeBrowser
        files={files}
        startingFileName="package.json"
      />
    </div>
  )
}
