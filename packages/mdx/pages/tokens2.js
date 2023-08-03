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
  const [playing, setPlaying] = React.useState(false)
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
          onClick={() => {
            setPlaying(!playing)
            if (!playing) {
              setI((i + 1) % list.length)
            }
          }}
        >
          {playing ? "Pause" : "Play"}
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
      <Code
        tokens={tokens}
        onTransitioned={() => {
          if (!playing) return
          setTimeout(() => {
            setI((i + 1) % list.length)
          }, 1000)
        }}
      />
    </main>
  )
}

const langs = [
  "java",
  "scala",
  "python",
  "ruby",
  "matlab",
  "r",
  "javascript",
  "cpp",
  "kotlin",
  "go",
  "swift",
  "rust",
  "fsharp",
  "scheme",
]

// prettier-ignore
const code = [`
// Java

public class Main {
    public static int factorial(int n) {
        if (n == 0) {
            return 1;
        } else {
            return n * factorial(n - 1);
        }
    }
}
`.trim(),`
// Scala

object Main {
  def factorial(n: Int): Int = {
    if (n == 0) {
      return 1
    } else {
      return n * factorial(n - 1)
    }
  }
}
`.trim(),`
# Python

def factorial(n):
    if n == 0:
        return 1
    else:
        return n * factorial(n - 1)
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
% MATLAB

function result = factorial(n)
    if n == 0
        result = 1;
    else
        result = n * factorial(n - 1);
    end
end
`.trim(),`
# R

factorial <- function(n) {
    if (n == 0) {
        return(1)
    } else {
        return(n * factorial(n - 1))
    }
}
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
// C++

int factorial(int n) {
    if (n == 0) {
        return 1;
    } else {
        return n * factorial(n - 1);
    }
}
`.trim(),`
// Kotlin

fun factorial(n: Int): Int {
    return if (n == 0) {
        1
    } else {
        n * factorial(n - 1)
    }
}
`.trim(),`
// Go

func factorial(n int) int {
    if n == 0 {
        return 1
    } else {
        return n * factorial(n - 1)
    }
}
`.trim(),`
// Swift

func factorial(n: Int) -> Int {
    if n == 0 {
        return 1
    } else {
        return n * factorial(n: n - 1)
    }
}
`.trim(),`
// Rust

fn factorial(n: i32) -> i32 {
    if n == 0 {
        return 1;
    } else {
        return n * factorial(n - 1);
    }
}
`.trim(),`
// F#

let rec factorial n =
    if n = 0 then
        1
    else
        n * factorial (n - 1)
`.trim(),`
;; Scheme

(define (factorial n)
  (if (= n 0)
      1
      (* n (factorial (- n 1)))))
`.trim()
]
