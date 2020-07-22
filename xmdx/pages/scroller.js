import React from "react";
import { MDXProvider } from "@mdx-js/react";
import { Scroller, Step as ScrollerStep } from "../src/scroller.tsx";

import Content from "./content/scroller.mdx";
import s from "./scroller.module.css";

function Step({ children }) {
  return <div style={{ border: "1px solid blue" }}>{children}</div>;
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

function Component({ stickers, contents }) {
  const [currentIndex, setIndex] = React.useState(0);
  return (
    <div className={s.main}>
      <div className={s.content}>
        <Scroller onStepChange={setIndex}>
          {contents.map((c, i) => (
            <ScrollerStep
              key={i}
              index={i}
              className={s.step}
              style={{
                opacity: currentIndex === i ? 0.99 : 0.4,
                boxShadow:
                  "0 6px 12px -2px rgba(50,50,93,.25), 0 3px 7px -3px rgba(0,0,0,.3)",
                borderRadius: "6px",
                padding: "32px",
                boxSizing: "border-box",
              }}
            >
              {c}
            </ScrollerStep>
          ))}
        </Scroller>
      </div>
      <div className={s.sticker}>
        <div>{stickers[currentIndex]}</div>
      </div>
    </div>
  );
}

function Wrapper({ children, ...props }) {
  const steps = React.Children.toArray(children).filter(
    (c) => c.props.mdxType === "Step"
  );
  const contents = steps.map((s) =>
    React.Children.toArray(s.props.children).filter(
      (c) => c.props.mdxType !== "Sticker"
    )
  );
  const stickers = steps.map((s) =>
    React.Children.toArray(s.props.children).filter(
      (c) => c.props.mdxType === "Sticker"
    )
  );

  return (
    <main {...props} style={{ background: "#eee" }}>
      <Component contents={contents} stickers={stickers} />
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
