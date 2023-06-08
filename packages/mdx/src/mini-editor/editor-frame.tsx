import React from "react"
import { FrameButtons } from "../mini-frame"

export { getPanelStyles }
export type {
  EditorFrameProps,
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
  northButton?: React.ReactNode
  southButton?: React.ReactNode
  onTabClick?: (filename: string) => void
} & React.PropsWithoutRef<JSX.IntrinsicElements["div"]>

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
    northButton,
    southButton,
    className,
    onTabClick,
    ...rest
  },
  ref
) {
  return (
    <div
      ref={ref}
      {...rest}
      className="ch-editor-frame"
      style={style}
    >
      <div className="ch-frame-title-bar">
        <TabsContainer
          tabs={northPanel.tabs}
          showFrameButtons={true}
          button={northButton}
          panel="north"
          onTabClick={onTabClick}
        />
      </div>
      <div
        data-ch-panel="north"
        style={northPanel.style}
        children={northPanel.children}
      />
      {southPanel && (
        <>
          <div
            className="ch-frame-title-bar"
            style={{
              transform: southPanel.style?.transform,
            }}
          >
            <TabsContainer
              tabs={southPanel.tabs}
              showFrameButtons={false}
              button={southButton}
              topBorder={true}
              panel="south"
              onTabClick={onTabClick}
            />
          </div>
          <div
            data-ch-panel="south"
            children={southPanel.children}
            style={southPanel.style}
          />
        </>
      )}
    </div>
  )
})

type TabsContainerProps = {
  tabs: Tab[]
  button?: React.ReactNode
  showFrameButtons: boolean
  topBorder?: boolean
  panel: "north" | "south"
  onTabClick?: (filename: string) => void
}
function TabsContainer({
  tabs,
  button,
  showFrameButtons,
  topBorder,
  panel,
  onTabClick,
}: TabsContainerProps) {
  return (
    <>
      {topBorder && (
        <div className="ch-editor-group-border" />
      )}
      {showFrameButtons ? <FrameButtons /> : <div />}
      {tabs.map(({ title, active, style }) => (
        <div
          key={title}
          title={title}
          data-ch-tab={panel}
          data-active={active}
          className="ch-editor-tab"
          style={style}
          onClick={onTabClick && (() => onTabClick(title))}
        >
          <TabTitle title={title} />
        </div>
      ))}
      <div style={{ flex: 1, minWidth: "0.8em" }} />
      {button}
    </>
  )
}

function TabTitle({ title }: { title: string }) {
  if (!title) {
    return <div />
  }

  const separatorIndex = title.lastIndexOf("/") + 1
  const filename = title.substring(separatorIndex)
  const folder = title.substring(0, separatorIndex)

  return (
    <div>
      <span style={{ opacity: 0.5 }}>{folder}</span>
      {filename}
    </div>
  )
}

type TabsSnapshot = Record<
  string,
  { left: number; active: boolean; width: number }
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
