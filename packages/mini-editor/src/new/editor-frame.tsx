import React from "react"
import {
  MiniFrame,
  FrameButtons,
} from "@code-hike/mini-frame"
import { useClasser, Classes } from "@code-hike/classer"

export {
  EditorFrameProps,
  getPanelStyles,
  Snapshot,
  OutputPanel,
  TabsSnapshot,
  Tab,
}

type Tab = {
  title: string
  active: boolean
  style: React.CSSProperties
}

type OutputPanel = {
  tabs: Tab[]
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
      overflow="unset"
      className={c("frame")}
      titleBar={
        <TabsContainer
          tabs={northPanel.tabs}
          showFrameButtons={true}
          button={button}
          panel="north"
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
          <div
            className={"ch-frame-title-bar"}
            style={{ background: "none" }}
          >
            <TabsContainer
              tabs={southPanel.tabs}
              showFrameButtons={false}
              topBorder={true}
              panel="south"
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
  tabs: Tab[]
  button?: React.ReactNode
  showFrameButtons: boolean
  topBorder?: boolean
  panel: "north" | "south"
}
function TabsContainer({
  tabs,
  button,
  showFrameButtons,
  topBorder,
  panel,
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
      {showFrameButtons ? <FrameButtons /> : <div />}
      {tabs.map(({ title, active, style }) => (
        <div
          key={title}
          title={title}
          data-ch-tab={panel}
          className={c("", active ? "active" : "inactive")}
          style={style}
        >
          <div>{title}</div>
        </div>
      ))}
      <div style={{ flex: 1 }} />
      {button}
    </>
  )
}

type TabsSnapshot = Record<
  string,
  { left: number; active: boolean }
>
type Snapshot = {
  titleBarHeight: number
  northKey: any
  northHeight: number
  northTabs: TabsSnapshot
  southKey: any
  southHeight: number | null
  southTabs: TabsSnapshot | null
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
    console.log("1")
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
    next.northKey !== prev.southKey
  ) {
    console.log("2")
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
    console.log("3")
    return {
      northStyle: {
        height: prev.northHeight,
      },
      southStyle: {
        position: "relative",
        height: tween(
          prev.southHeight,
          next.northHeight + next.titleBarHeight,
          t
        ),
        transform: `translateY(${tween(
          0,
          -(prev.northHeight + prev.titleBarHeight),
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
    prev.northKey !== next.southKey
  ) {
    console.log("Hey")
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
    console.log("5")
    return {
      northStyle: {
        height: next.northHeight,
      },
      southStyle: {
        position: "relative",
        height: tween(
          prev.northHeight + prev.titleBarHeight,
          next.southHeight!,
          t
        ),
        transform: `translateY(${tween(
          -(next.northHeight + next.titleBarHeight),
          0,
          t
        )}px)`,
      },
    }
  }

  console.log("6")
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
