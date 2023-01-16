import React, { useRef, useEffect, useState } from "react";
import * as runtime from "react/jsx-runtime";
import { compile, run } from "@mdx-js/mdx";
import { remarkCodeHike } from "@code-hike/mdx";
import { CH } from "@code-hike/mdx/components";
import "@code-hike/mdx/styles.css";
import { ErrorBoundary } from "react-error-boundary";
import { getTheme } from "./themes";
import { toHash } from "./hash";

export function Preview(props) {
  return (
    <div className={`preview ${props.standalone ? "standalone" : ""}`}>
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
      <h3>Runtime Error:</h3>
      <pre>{String(error)}</pre>
    </div>
  );
}

function InnerPreview({ input, standalone, refreshKey }) {
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
      {error ? (
        <div className="compile-error">
          <h3>Compliation Error:</h3>
          <pre>{error}</pre>
        </div>
      ) : null}
      {standalone ? (
        <a href={`/#${toHash(input)}`} className="standalone-link">
          <PlaygroundIcon />
        </a>
      ) : (
        <a href={`/?preview=1#${toHash(input)}`} className="standalone-link">
          <ExternalIcon />
        </a>
      )}
      <div className={`preview-container ${error ? "with-error" : ""}`}>
        {Content ? <Content components={{ CH }} key={refreshKey} /> : null}
      </div>
    </>
  );
}

function ExternalIcon() {
  return (
    <svg
      className="icon"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Open in new window</title>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
      />
    </svg>
  );
}
function PlaygroundIcon() {
  return (
    <svg
      className="icon"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Open playground</title>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
      />
    </svg>
  );
}
