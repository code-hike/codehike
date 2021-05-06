import React from "react"
import {
  MiniFrame,
  FrameButtons,
} from "@code-hike/mini-frame"
import { useClasser, Classes } from "@code-hike/classer"

export { EditorFrameProps, getPanelStyles, Snapshot }

type OutputPanel = {
  tabs: string[]
  active: string
  style: React.CSSProperties
  children: React.ReactNode
}

type EditorFrameProps = {
  northPanel: OutputPanel
  southPanel?: OutputPanel | null
  terminalPanel?: React.ReactNode
  height?: number
  button?: React.ReactNode
  classes?: Classes
} & React.PropsWithoutRef<JSX.IntrinsicElements["div"]>

const DEFAULT_HEIGHT = 200

export const EditorFrame = React.forwardRef<
  HTMLDivElement,
  EditorFrameProps
>(function InnerEditorFrame(
  {
    northPanel,
    southPanel,
    terminalPanel,
    style,
    height,
    button,
    ...rest
  },
  ref
) {
  const c = useClasser("ch-editor")
  return (
    <MiniFrame
      ref={ref}
      style={{ height: height ?? DEFAULT_HEIGHT, ...style }}
      overflow="hidden"
      titleBar={
        <TabsContainer
          files={northPanel.tabs}
          active={northPanel.active}
          showFrameButtons={true}
          button={button}
        />
      }
      {...rest}
    >
      <div
        data-ch-panel="north"
        className={c("body")}
        style={northPanel.style}
        children={northPanel.children}
      />
      {southPanel && (
        <div
          data-ch-panel="south"
          style={{
            display: "flex",
            flexDirection: "column",
            ...southPanel.style,
          }}
        >
          <div className={"ch-frame-title-bar"}>
            <TabsContainer
              files={southPanel.tabs}
              active={southPanel.active}
              showFrameButtons={false}
              topBorder={true}
            />
          </div>
          <div
            className={c("body")}
            children={southPanel.children}
            style={{
              flexGrow: 1,
              flexShrink: 1,
              minHeight: 0,
            }}
          />
        </div>
      )}
      {terminalPanel}
    </MiniFrame>
  )
})

type TabsContainerProps = {
  files: string[]
  active: string
  button?: React.ReactNode
  showFrameButtons: boolean
  topBorder?: boolean
}
function TabsContainer({
  files,
  active,
  button,
  showFrameButtons,
  topBorder,
}: TabsContainerProps) {
  const c = useClasser("ch-editor-tab")
  return (
    <>
      {topBorder && (
        <div
          style={{
            position: "absolute",
            height: "1px",
            background: "#151515",
            width: "100%",
            top: 0,
            zIndex: 1,
          }}
        />
      )}
      {showFrameButtons ? (
        <FrameButtons />
      ) : (
        <div style={{ width: "30px" }} />
      )}
      {files.map(fileName => (
        <div
          key={fileName}
          title={fileName}
          className={c(
            "",
            fileName === active ? "active" : "inactive"
          )}
        >
          <div>{fileName}</div>
        </div>
      ))}
      <div style={{ flex: 1 }} />
      {button}
    </>
  )
}

type Snapshot = {
  northKey: any
  northHeight: number
  southKey: any
  southHeight: number | null
}

function getPanelStyles(
  prev: Snapshot,
  next: Snapshot,
  t: number
): {
  northStyle: React.CSSProperties
  southStyle?: React.CSSProperties
} {
  // +---+---+
  // | x | x |
  // +---+---+
  // |   |   |
  // +---+---+
  if (
    prev.southHeight === null &&
    next.southHeight === null
  ) {
    return {
      northStyle: {
        height: prev.northHeight,
      },
    }
  }

  // +---+---+
  // | x | x |
  // +---+---+
  // | y |   |
  // +---+---+
  if (
    prev.southHeight !== null &&
    next.southHeight === null &&
    prev.northKey === next.northKey
  ) {
    return {
      northStyle: {
        height: tween(
          prev.northHeight,
          next.northHeight,
          t
        ),
      },
      southStyle: {
        height: prev.southHeight,
      },
    }
  }

  // +---+---+
  // | x | y |
  // +---+---+
  // | y |   |
  // +---+---+
  if (
    prev.southHeight !== null &&
    next.southHeight === null &&
    prev.southKey === next.northKey
  ) {
    return {
      northStyle: {
        height: prev.northHeight,
      },
      southStyle: {
        position: "relative",
        height: tween(
          prev.southHeight,
          next.northHeight,
          t
        ),
        transform: `translateY(${tween(
          0,
          -prev.northHeight,
          t
        )}px)`,
      },
    }
  }

  // +---+---+
  // | x | x |
  // +---+---+
  // |   | y |
  // +---+---+
  if (
    prev.southHeight === null &&
    next.southHeight !== null &&
    prev.northKey === next.northKey
  ) {
    return {
      northStyle: {
        height: tween(
          prev.northHeight,
          next.northHeight,
          t
        ),
      },
      southStyle: {
        position: "relative",
        height: next.southHeight!,
      },
    }
  }

  // +---+---+
  // | y | x |
  // +---+---+
  // |   | y |
  // +---+---+
  if (
    prev.southHeight === null &&
    next.southHeight !== null &&
    prev.northKey === next.southKey
  ) {
    return {
      northStyle: {
        height: next.northHeight,
      },
      southStyle: {
        position: "relative",
        height: tween(
          prev.northHeight,
          next.southHeight!,
          t
        ),
        transform: `translateY(${tween(
          -next.northHeight,
          0,
          t
        )}px)`,
      },
    }
  }

  // +---+---+
  // | x | x |
  // +---+---+
  // | y | y |
  // +---+---+
  return {
    northStyle: {
      height: tween(prev.northHeight, next.northHeight, t),
    },
    southStyle: {
      height: tween(
        prev.southHeight!,
        next.southHeight!,
        t
      ),
    },
  }
}

function tween(a: number, b: number, t: number) {
  return a + (b - a) * t
}
