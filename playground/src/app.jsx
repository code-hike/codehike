import { useRef, useEffect } from "react";
import * as runtime from "react/jsx-runtime.js";
import Editor from "@monaco-editor/react";
import { useState } from "react";

import { compile, run } from "@mdx-js/mdx";

const defaultCode = `
# Hello

This is a markdown editor.

~~~py foo.py
print "Hello, world!";
~~~

`;

function App() {
  const [code, setCode] = useState(defaultCode);
  const [Content, setContent] = useState(undefined);
  function handleEditorChange(value, event) {
    setCode(value);
  }

  useEffect(() => {
    compile(code, { outputFormat: "function-body" })
      .then((c) => run(String(c), runtime))
      .then((x) => setContent(x.default));
  }, [code]);
  return (
    <div className="app">
      <header>
        <h1>Code Hike</h1> v0.5.1
      </header>
      <main>
        <Editor
          className="editor"
          onChange={handleEditorChange}
          defaultLanguage="markdown"
          theme="vs-dark"
          defaultValue={defaultCode}
          options={{
            // https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.IEditorConstructionOptions.html
            minimap: {
              enabled: false,
            },
            lineNumbers: "off",
            scrollBeyondLastLine: false,
            hideCursorInOverviewRuler: true,
            matchBrackets: false,
            overviewRulerBorder: false,
            renderLineHighlight: "none",
            wordWrap: "on",
            tabSize: 2,
          }}
        />
        <div className="preview">{Content}</div>
      </main>
    </div>
  );
}

export default App;
