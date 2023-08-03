import { Code } from "../src/smooth-tokens"
import { tokenize, tokenizeSync } from "../src/differ"
import {
  THEME_NAMES,
  LANG_NAMES,
  getThemeColorsSync,
  preload,
} from "@code-hike/lighter"
import React from "react"

const theme = "github-dark"

export default function Page() {
  const [list, setList] = React.useState([])

  React.useEffect(() => {
    Promise.all(
      code.map((c, i) => tokenize(c, langs[i], theme))
    ).then(setList)
  }, [])

  if (!list.length) {
    return (
      <main
        style={{
          height: "100vh",
          background: "rgb(13, 17, 23)",
          padding: "1rem",
          boxSizing: "border-box",
          transition: "background 0.5s",
        }}
      />
    )
  }

  return <Main list={list} />
}

function Main({ list }) {
  const themeColors = getThemeColorsSync(theme)

  const [i, setI] = React.useState(0)
  const tokens = list[i]

  return (
    <main
      style={{
        minHeight: "100vh",
        background: themeColors.background,
        color: themeColors.foreground,
        padding: "1rem",
        boxSizing: "border-box",
        transition: "background 0.5s",
      }}
    >
      <style>
        {`
        pre::selection, pre ::selection {
          background: ${themeColors.editor.selectionBackground};
        }
        `}
      </style>

      <div
        style={{
          width: 280,
          margin: "1rem auto",
          display: "block",
        }}
      >
        <button
          style={{
            width: 40,
          }}
          onClick={() =>
            setI((i - 1 + list.length) % list.length)
          }
          // onClick={() => setRight(!right)}
        >
          {`<`}
        </button>
        <button
          style={{
            width: 200,
          }}
          onClick={() => setI((i + 1) % list.length)}
          // onClick={() => setRight(!right)}
        >
          Play
        </button>
        <button
          style={{
            width: 40,
          }}
          onClick={() => setI((i + 1) % list.length)}
          // onClick={() => setRight(!right)}
        >
          {`>`}
        </button>
      </div>
      <Code tokens={tokens} />
    </main>
  )
}

const langs = [
  "python",
  "javascript",
  "java",
  "csharp",
  "ruby",
  "cpp",
]

// prettier-ignore
const code = [`
# Python

def factorial(n):
    if n == 0:
        return 1
    else:
        return n * factorial(n - 1)
`.trim(),`
// JavaScript

function factorial(n) {
    if (n === 0) {
        return 1;
    } else {
        return n * factorial(n - 1);
    }
}
`.trim(),`
// Java

public class Factorial {
    public static int factorial(int n) {
        if (n == 0) {
            return 1;
        } else {
            return n * factorial(n - 1);
        }
    }
}
`.trim(),`
// C#

class Program
{
    static int Factorial(int n)
    {
        if (n == 0)
        {
            return 1;
        }
        else
        {
            return n * Factorial(n - 1);
        }
    }
}
`.trim(),`
# Ruby

def factorial(n)
    if n == 0
        return 1
    else
        return n * factorial(n - 1)
    end
end
`.trim(),`
// C++

int factorial(int n) {
  if (n == 0) {
      return 1;
  } else {
      return n * factorial(n - 1);
  }
}
`.trim()
]
