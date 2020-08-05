import React from "react";
import { MDXProvider } from "@mdx-js/react";
import Content from "../docs/hello.md";

const components = {
  wrapper: ({ children }) => (
    <ShowChildrenObjectJSON children={children} />
  ),
};

export default function Page() {
  return (
    <MDXProvider components={components}>
      <Content />
    </MDXProvider>
  );
}

function ShowChildrenObjectJSON({ children }) {
  console.log(children);
  return <pre>{children}</pre>;
}
