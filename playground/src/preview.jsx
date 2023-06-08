import React, { useRef, useEffect, useState } from "react";
import * as runtime from "react/jsx-runtime";
import { compile, run } from "@mdx-js/mdx";
import { remarkCodeHike } from "@code-hike/mdx";
import { CH } from "@code-hike/mdx/components";
import "@code-hike/mdx/styles.css";
import { ErrorBoundary } from "react-error-boundary";
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

async function compileAndRun(input) {
  try {
    const c = await compile(input.mdx, {
      outputFormat: "function-body",
      remarkPlugins: [
        [
          remarkCodeHike,
          {
            ...input.config,
            autoImport: false,
            theme: input.config.theme,
          },
        ],
      ],
    });
    const x = await run(String(c), runtime);
    return { content: x.default, error: undefined };
  } catch (e) {
    return { content: undefined, error: e.message };
  }
}

let effectId = 0;

function useInput(input) {
  const [{ Content, error }, setState] = useState({
    Content: undefined,
    error: undefined,
  });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const id = effectId;
    // console.log("compiling...", id);
    setLoading(true);
    compileAndRun(input).then(({ content, error }) => {
      // console.log("compiled", id, error);
      if (id !== effectId) {
        // console.log("skipping", id);
        return;
      }
      setState((state) => ({
        Content: content || state.Content,
        error,
      }));
      setLoading(false);
    });
    return () => {
      // console.log("cancelling", id);
      effectId++;
    };
  }, [input.mdx, input.css, input.config]);

  return { Content, error, loading };
}

function InnerPreview({ input, standalone, refreshKey }) {
  const { Content, error, loading } = useInput(input);
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
        <div style={{ opacity: loading ? 1 : 0 }} className="loading-border" />
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
