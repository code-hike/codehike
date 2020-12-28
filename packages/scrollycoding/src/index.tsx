import * as React from "react"
import { MiniEditorWithState as Editor } from "@code-hike/mini-editor"
import { Scroller, Step } from "@code-hike/scroller"
import { MiniBrowser } from "@code-hike/mini-browser"
import {
  classNamesWithPrefix,
  Classes,
} from "@code-hike/utils"
import "./index.scss"

const c = classNamesWithPrefix("ch-hike")

interface HikeStep {
  focus: string | undefined
  content: React.ReactNode[]
  code: string
  demo: string
}

const HikeContext = React.createContext<{
  currentFocus: string | undefined
  setFocus: (
    code: string,
    focus: string | undefined
  ) => void
  resetFocus: () => void
  classes: Classes
} | null>(null)

const StepContext = React.createContext<HikeStep | null>(
  null
)

export interface HikeProps {
  steps: HikeStep[]
  classes?: Classes
}

export function Hike({ steps, classes = {} }: HikeProps) {
  const [{ index, focus, code }, setState] = React.useState(
    {
      index: 0,
      code: steps[0].code,
      focus: steps[0].focus,
    }
  )

  const currentStep = steps[index]
  const setFocus = (
    code: string,
    focus: string | undefined
  ) =>
    setState(({ index }) => ({
      index,
      code,
      focus: focus,
    }))
  const resetFocus = () =>
    setState(({ index }) => ({
      index,
      code: steps[index].code,
      focus: steps[index].focus,
    }))
  const changeStep = (newIndex: number) =>
    setState({
      index: newIndex,
      code: steps[newIndex].code,
      focus: steps[newIndex].focus,
    })

  return (
    <HikeContext.Provider
      value={{
        currentFocus: focus,
        setFocus,
        resetFocus,
        classes,
      }}
    >
      <section className={c("", classes)}>
        <div className={c("-content", classes)}>
          <Scroller onStepChange={changeStep}>
            {steps.map((step, index) => (
              <StepContext.Provider
                value={step}
                key={index}
              >
                <Step
                  as="div"
                  index={index}
                  key={index}
                  className={c("-step", classes)}
                >
                  <div
                    className={c("-step-content", classes)}
                  >
                    {step.content}
                  </div>
                  <div
                    className={c("-step-output", classes)}
                  >
                    <div
                      className={c("-step-editor", classes)}
                    >
                      <Editor
                        code={step.code}
                        minColumns={46}
                        file="App.js"
                        classes={classes}
                        lang="jsx"
                        focus={step.focus}
                        style={{ height: "100%" }}
                        button={
                          <CodeSandboxIcon
                            url={step.demo}
                          />
                        }
                      />
                    </div>
                    <div
                      className={c(
                        "-step-browser",
                        classes
                      )}
                    >
                      <MiniBrowser
                        url={step.demo}
                        classes={classes}
                      />
                    </div>
                  </div>
                </Step>
              </StepContext.Provider>
            ))}
          </Scroller>
        </div>
        <aside className={c("-sticker-column", classes)}>
          <div className={c("-sticker", classes)}>
            <div className={c("-editor", classes)}>
              <Editor
                code={code}
                minColumns={46}
                file="App.js"
                classes={classes}
                lang="jsx"
                focus={focus}
                style={{ height: "100%" }}
                button={
                  <CodeSandboxIcon url={currentStep.demo} />
                }
              />
            </div>
            <div className={c("-preview", classes)}>
              <MiniBrowser
                url={currentStep.demo}
                classes={classes}
              />
            </div>
          </div>
        </aside>
      </section>
    </HikeContext.Provider>
  )
}

function CodeSandboxIcon({ url }: { url: string }) {
  return (
    <a
      style={{ margin: "0 1em 0 1em", color: "inherit" }}
      title="Open in CodeSandbox"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="1.3em"
        width="1.3em"
        stroke="currentColor"
        fill="currentColor"
        viewBox="0 0 512 512"
        style={{ display: "block" }}
      >
        <path d="M234.4 452V267.5L75.6 176.1v105.2l72.7 42.2v79.1l86.1 49.4zm41.2 1.1l87.6-50.5v-81l73.2-42.4V175.3l-160.8 92.8v185zm139.6-313.2l-84.5-49-74.2 43.1-74.8-43.1-85.3 49.6 159.1 91.6 159.7-92.2zM34.4 384.7V129L256 0l221.6 128.4v255.9L256 512 34.4 384.7z"></path>
      </svg>
    </a>
  )
}

export interface FocusProps {
  children?: React.ReactNode
  focus: string
}

export function Focus({ children, focus }: FocusProps) {
  const {
    setFocus,
    currentFocus,
    resetFocus,
    classes,
  } = React.useContext(HikeContext)!
  const { code: stepCode } = React.useContext(StepContext)!

  const isFocused = currentFocus === focus

  return (
    <a
      className={c(
        [
          "-focus",
          isFocused ? "-focus-active" : "-focus-inactive",
        ],
        classes
      )}
      title="Show code"
      onClick={() =>
        isFocused ? resetFocus() : setFocus(stepCode, focus)
      }
    >
      {children}{" "}
      <svg
        fill="none"
        stroke="currentColor"
        className={c("-focus-icon", classes)}
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d={
            isFocused
              ? "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
              : "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
          }
        />
      </svg>
    </a>
  )
}
