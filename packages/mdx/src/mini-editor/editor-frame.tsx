import React from "react"
import { FrameButtons } from "../mini-frame"
import { useClasser, Classes } from "../classer"
import { EditorTheme, getColor, ColorName } from "../utils"

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
  theme: EditorTheme
  terminalPanel?: React.ReactNode
  height?: number
  button?: React.ReactNode
  classes?: Classes
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
    button,
    theme,
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
      style={{
        background: getColor(
          theme,
          ColorName.EditorGroupHeaderBackground
        ),
        ...style,
      }}
    >
      <div className={"ch-frame-title-bar"}>
        <TabsContainer
          tabs={northPanel.tabs}
          showFrameButtons={true}
          button={button}
          panel="north"
          theme={theme}
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
            className={"ch-frame-title-bar"}
            style={{
              transform: southPanel.style?.transform,
            }}
          >
            <TabsContainer
              tabs={southPanel.tabs}
              showFrameButtons={false}
              topBorder={true}
              panel="south"
              theme={theme}
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
  theme: EditorTheme
  onTabClick?: (filename: string) => void
}
function TabsContainer({
  tabs,
  button,
  showFrameButtons,
  topBorder,
  panel,
  theme,
  onTabClick,
}: TabsContainerProps) {
  const c = useClasser("ch-editor-tab")
  return (
    <>
      {topBorder && (
        <div
          style={{
            position: "absolute",
            height: "1px",
            background: getColor(
              theme,
              ColorName.EditorGroupBorder
            ),
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
          style={{
            ...style,
            background: getColor(
              theme,
              active
                ? ColorName.ActiveTabBackground
                : ColorName.InactiveTabBackground
            ),
            color: getColor(
              theme,
              active
                ? ColorName.ActiveTabForeground
                : ColorName.InactiveTabForeground
            ),
            borderRightColor: getColor(
              theme,
              ColorName.TabBorder
            ),
            borderBottomColor: getColor(
              theme,
              active
                ? ColorName.ActiveTabBottomBorder
                : ColorName.InactiveTabBackground
            ),
          }}
          onClick={onTabClick && (() => onTabClick(title))}
        >
          <TabTitle title={title} />
        </div>
      ))}
      <div style={{ flex: 1 }} />
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
