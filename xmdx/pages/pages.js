import React from "react";
import { MDXProvider } from "@mdx-js/react";

import Content from "./content/scroller.mdx";

function Step({ children }) {
  return (
    <div style={{ border: "1px solid blue" }}>
      {children}
    </div>
  );
}

function Sticker({ children }) {
  return (
    <div
      style={{
        border: "1px solid green",
        borderRadius: 7,
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
}

function Wrapper({ children, ...props }) {
  const steps = React.Children.toArray(
    children
  ).filter((c) => c.props.mdxType === "Step");
  const [page, setPage] = React.useState(0);

  const currentStep = steps[page];

  return (
    <main {...props}>
      {currentStep}
      <div>
        <button onClick={() => setPage(page - 1)}>
          Back
        </button>
        <button onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
    </main>
  );
}

const components = {
  Step,
  Sticker,
  wrapper: Wrapper,
};

export default function Page() {
  return (
    <MDXProvider components={components}>
      <Content />
    </MDXProvider>
  );
}
