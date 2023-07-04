// server-side-media-queries-for-react
// from: https://github.com/pomber/server-side-media-queries-for-react
import React from "react"

let suffixCounter = 0
const PREFERS_STATIC_KEY = "ch-prefers-static"

export function toggleStatic() {
  localStorage.setItem(
    "ch-prefers-static",
    localStorage.getItem("ch-prefers-static") === "true"
      ? "false"
      : "true"
  )
  window.dispatchEvent(
    new StorageEvent("storage", {
      key: "ch-prefers-static",
    })
  )
}

export function StaticToggle({
  viewDynamicText = "View dynamic version",
  viewStaticText = "View static version",
}) {
  const [forceStatic, toggleStatic] = useStaticToggle()
  return (
    <button
      onClick={toggleStatic}
      className="ch-static-toggle"
      data-ch-static={forceStatic}
    >
      {forceStatic ? viewDynamicText : viewStaticText}
    </button>
  )
}

export function useStaticToggle() {
  const { showStatic: forceStatic } = useMedia(
    "screen and (max-width: 0px)"
  )

  const [firstRender, setFirstRender] = React.useState(true)

  React.useLayoutEffect(() => {
    if (forceStatic) {
      setFirstRender(false)
    }
  }, [])

  return [
    firstRender ? false : forceStatic,
    toggleStatic,
  ] as const
}

/**
 * @typedef SwapProps
 * @prop {[string, JSX.Element][]} match
 */

/**
 * Swap between different components depending on the media queries
 * @param {SwapProps} props
 */

export function Swap({ query, staticElement, children }) {
  const dynamicElement = children

  const { isServer, showStatic } = useMedia(query)
  const mainClassName = isServer
    ? "ssmq-" + suffixCounter++
    : ""
  return isServer ? (
    <React.Fragment>
      <style
        className={mainClassName}
        dangerouslySetInnerHTML={{
          __html: getStyle(query, mainClassName),
        }}
      />
      <div className={`${mainClassName} ssmq-static`}>
        {staticElement}
      </div>
      <div className={`${mainClassName} ssmq-dynamic`}>
        {dynamicElement}
      </div>
      <script
        className={mainClassName}
        dangerouslySetInnerHTML={{
          __html: getScript(query, mainClassName),
        }}
      />
    </React.Fragment>
  ) : (
    <React.Fragment>
      <div>
        {showStatic ? staticElement : dynamicElement}
      </div>
    </React.Fragment>
  )
}

function getStyle(query, mainClass) {
  return `.${mainClass}.ssmq-dynamic { display: block; }
.${mainClass}.ssmq-static { display: none; }
@media ${query} {
  .${mainClass}.ssmq-dynamic { display: none; }
  .${mainClass}.ssmq-static { display: block; }
}
`
}

function getScript(query, mainClass) {
  return `(function() {
  var q = ${JSON.stringify(query)};
  var mainCls = "${mainClass}";

  var dynamicEl = document.querySelector(
    "." + mainCls + ".ssmq-dynamic"
  )
  var staticEl = document.querySelector(
    "." + mainCls + ".ssmq-static"
  )
  var parent = dynamicEl.parentNode

  if (window.matchMedia(q).matches || localStorage.getItem("${PREFERS_STATIC_KEY}") === 'true') {
    staticEl.removeAttribute("class")
  } else {
    dynamicEl.removeAttribute("class")
  }

  parent
    .querySelectorAll(":scope > ." + mainCls)
    .forEach(function (e) {
      parent.removeChild(e)
    })
})();`
}

function useMedia(query) {
  const isServer = typeof window === "undefined"

  if (isServer) {
    return { isServer, showStatic: false }
  }

  const [, setValue] = React.useState(0)

  const mql = window.matchMedia(query)
  React.useEffect(() => {
    const handler = () => setValue(x => x + 1)
    mql.addEventListener("change", handler)
    window.addEventListener("storage", event => {
      if (event.key === PREFERS_STATIC_KEY) {
        handler()
      }
    })
    return () => {
      mql.removeEventListener("change", handler)
      window.removeEventListener("storage", handler)
    }
  }, [])

  const showStatic =
    mql.matches ||
    localStorage.getItem(PREFERS_STATIC_KEY) === "true"

  return {
    isServer,
    showStatic,
  }
}
