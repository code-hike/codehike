import React, { useState } from "react";
import { Editor } from "./editor";
import { readHash, writeHash } from "./hash";
import { Preview } from "./preview";
import SplitPane from "react-split-pane";
import "./resizer.css";

const defaultCode = `
# Hello

Edit me.

\`\`\`python hello.py
# mark[16:24]
print("This is Code Hike")
\`\`\`

`;

const defaultCss = `.preview-container { 
  margin: 8px; 
}`;

function App() {
  const data = React.useMemo(() => {
    const input = readHash() || {
      mdx: defaultCode,
      css: defaultCss,
      config: {
        lineNumbers: false,
        showCopyButton: false,
        autoLink: false,
        theme: "material-darker",
      },
    };
    const params = new URL(location).searchParams;
    const standalonePreview = !!params.get("preview");
    return { input, standalonePreview };
  }, []);
  const [input, setInput] = useState(data.input);

  React.useEffect(() => {
    writeHash(input);
  }, [input]);

  // when the width changes we want to re-render the preview
  const [refreshKey, setRefreshKey] = useState(0);

  return data.standalonePreview ? (
    <Preview input={input} standalone={true} />
  ) : (
    <div className="app">
      <header>
        <a className="code-hike" href="https://codehike.org">
          <CodeHikeLogo />
          <h1>
            Code Hike
            <span>v{__APP_VERSION__}</span>
          </h1>
        </a>
        <a href="https://codehike.org/docs">Docs</a>
        <a href="https://codehike.org/#demos">Demos</a>
      </header>
      <main>
        <SplitPane
          split="vertical"
          minSize={200}
          defaultSize="50%"
          onDragFinished={(e) => setRefreshKey(e)}
        >
          <Editor setInput={setInput} input={input} />
          <Preview input={input} refreshKey={refreshKey} />
        </SplitPane>
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
