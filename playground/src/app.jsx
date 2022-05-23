import React, { useState } from "react";
import { Editor } from "./editor";
import { readHash, writeHash } from "./hash";
import { Preview } from "./preview";

const defaultCode = `
# Hello

Edit me.

~~~python hello.py
# mark[16:24]
print("This is Code Hike")
~~~

`;

function App() {
  const defaultInput = React.useMemo(() => {
    return (
      readHash() || {
        mdx: defaultCode,
        css: ".preview-container { border: 1px solid blue; }",
        config: { lineNumbers: false, showCopyButton: false },
      }
    );
  }, []);
  const [input, setInput] = useState(defaultInput);

  React.useEffect(() => {
    writeHash(input);
  }, [input]);

  return (
    <div className="app">
      <header>
        <a className="code-hike" href="https://codehike.org">
          <CodeHikeLogo />
          <h1>
            Code Hike
            <span>v0.5.1</span>
          </h1>
        </a>
      </header>
      <main>
        <Editor setInput={setInput} input={input} />
        <Preview input={input} />
      </main>
    </div>
  );
}

function CodeHikeLogo(props) {
  return (
    <svg viewBox="-100 -100 200 200" fill="currentColor" {...props}>
      <path d="M 70 60 L 42 -27 L 72 -27 L 100 60 Z" />
      <path d="M 20.419540229885058 40.05357142857142 L 42 -27 L 72 -27 L 50.41954022988506 40.05357142857142 Z" />
      <path d="M 20.419540229885058 40.05357142857142 L -15 -70 L 15 -70 L 50.41954022988506 40.05357142857142 Z" />
      <path d="M -50.41954022988506 40.05357142857142 L -15 -70 L 15 -70 L -20.419540229885058 40.05357142857142 Z" />
      <path d="M -50.41954022988506 40.05357142857142 L -72 -27 L -42 -27 L -20.419540229885058 40.05357142857142 Z" />
      <path d="M -100 60 L -72 -27 L -42 -27 L -70 60 Z" />
    </svg>
  );
}

export default App;
