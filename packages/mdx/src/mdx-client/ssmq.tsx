// server-side-media-queries-for-react
// from: https://github.com/pomber/server-side-media-queries-for-react
import React from "react"

let suffixCounter = 0

/**
 * @typedef SwapProps
 * @prop {[string, JSX.Element][]} match
 */

/**
 * Swap between different components depending on the media queries
 * @param {SwapProps} props
 */

export function Swap({ match }) {
  const queries = match.map(([q]) => q)
  const { isServer, matchedIndex } = useMedia(queries)
  const mainClassName = isServer
    ? "ssmq-" + suffixCounter++
    : ""

  return isServer ? (
    <React.Fragment>
      <style
        className={mainClassName}
        dangerouslySetInnerHTML={{
          __html: getStyle(queries, mainClassName),
        }}
      />
      {match.map(([query, element]) => (
        <div
          key={query}
          className={`${mainClassName} ${getClassName(
            query
          )}`}
        >
          {element}
        </div>
      ))}
      <script
        className={mainClassName}
        dangerouslySetInnerHTML={{
          __html: getScript(match, mainClassName),
        }}
      />
    </React.Fragment>
  ) : (
    <React.Fragment>
      <div>{match[matchedIndex][1]}</div>
    </React.Fragment>
  )
}

function getStyle(queries, mainClass) {
  const reversedQueries = queries.slice().reverse()
  const style = reversedQueries
    .map(query => {
      const currentStyle = `.${mainClass}.${getClassName(
        query
      )}{display:block}`
      const otherStyle = `.${mainClass}:not(.${getClassName(
        query
      )}){display: none;}`

      if (query === "default") {
        return `${currentStyle}${otherStyle}`
      } else {
        return `@media ${query}{${currentStyle}${otherStyle}}`
      }
    })
    .join("\n")
  return style
}

function getScript(match, mainClass) {
  const queries = match.map(([query]) => query)
  const classes = queries.map(getClassName)
  return `(function() {
  var qs = ${JSON.stringify(queries)};
  var clss = ${JSON.stringify(classes)};
  var mainCls = "${mainClass}";

  var scrEls = document.getElementsByTagName("script");
  var scrEl = scrEls[scrEls.length - 1];
  var parent = scrEl.parentNode;

  var el = null;
  for (var i = 0; i < qs.length - 1; i++) {
    if (window.matchMedia(qs[i]).matches) {
      el = parent.querySelector(":scope > ." + mainCls + "." + clss[i]);
      break;
    }
  }
  if (!el) {
    var defaultClass = clss.pop();
    el = parent.querySelector(":scope > ." + mainCls + "." + defaultClass);
  }
  el.removeAttribute("class");

  parent.querySelectorAll(":scope > ." + mainCls).forEach(function (e) {
    parent.removeChild(e);
  });
})();`
}

function getClassName(string) {
  return (
    "ssmq-" +
    string
      .replace(
        /[!\"#$%&'\(\)\*\+,\.\/:;<=>\?\@\[\\\]\^`\{\|\}~\s]/g,
        ""
      )
      .toLowerCase()
  )
}

function useMedia(queries) {
  const isServer = typeof window === "undefined"

  const allQueries = queries.slice(0, -1)

  if (queries[queries.length - 1] !== "default") {
    console.warn("last media query should be 'default'")
  }

  const [, setValue] = React.useState(0)

  const mediaQueryLists = isServer
    ? []
    : allQueries.map(q => window.matchMedia(q))

  React.useEffect(() => {
    const handler = () => setValue(x => x + 1)
    mediaQueryLists.forEach(mql => mql.addListener(handler))
    return () =>
      mediaQueryLists.forEach(mql =>
        mql.removeListener(handler)
      )
  }, [])

  const matchedIndex = mediaQueryLists.findIndex(
    mql => mql.matches
  )
  return {
    isServer,
    matchedIndex:
      matchedIndex < 0 ? queries.length - 1 : matchedIndex,
  }
}
