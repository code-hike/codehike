import React from "react";
import { MDXProvider } from "@mdx-js/react";

import One from "./lorem.md";

function Section({ children }) {
  return <div style={{ background: "salmon" }}>{children}</div>;
}

const components = {
  h1: (props) => <h1 style={{ color: "tomato" }} {...props} />,
  pre: (props) => <div {...props} />,
  code: (props) => <pre style={{ color: "tomato" }} {...props} />,
  Section,
};

export default function Page() {
  return (
    <MDXProvider components={components}>
      <One />
    </MDXProvider>
  );
}
