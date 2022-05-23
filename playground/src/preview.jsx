import React, { useRef, useEffect, useState } from "react";
import * as runtime from "react/jsx-runtime.js";
import { compile, run } from "@mdx-js/mdx";
import { remarkCodeHike } from "@code-hike/mdx";
import { CH } from "@code-hike/mdx/components";
import "@code-hike/mdx/styles.css";
import { ErrorBoundary } from "react-error-boundary";
import { getTheme } from "./themes";

export function Preview(props) {
  return (
    <div className="preview">
      <ErrorBoundary
        resetKeys={[props.input.mdx, props.input.css, props.input.config]}
        FallbackComponent={ErrorFallback}
      >
        <InnerPreview {...props} />
      </ErrorBoundary>
    </div>
  );
}
function ErrorFallback({ error }) {
  return (
    <div className="preview-error">
      <p>Something went wrong:</p>
      <pre>{String(error)}</pre>
    </div>
  );
}

function InnerPreview({ input }) {
  const [Content, setContent] = useState(undefined);
  const [error, setError] = useState(undefined);
  useEffect(() => {
    compile(input.mdx, {
      outputFormat: "function-body",
      remarkPlugins: [
        [
          remarkCodeHike,
          {
            ...input.config,
            autoImport: false,
            theme: getTheme(input.config.theme),
          },
        ],
      ],
    })
      .then((c) => {
        return run(String(c), runtime);
      })
      .then((x) => {
        setContent(() => x.default);
        setError(undefined);
      })
      .catch((e) => {
        setError(e.message);
        console.error({ e });
      });
  }, [input.mdx, input.css, input.config]);
  // console.log(error);
  return (
    <>
      <style>{input.css}</style>
      <div className="preview-container">
        {Content ? <Content components={{ CH }} /> : null}
      </div>
      {error ? <div className="preview-error">{error}</div> : null}
    </>
  );
}
