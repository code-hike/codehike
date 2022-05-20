import Editor from "@monaco-editor/react";
import { useState } from "react";
import { Preview } from "./preview";

const defaultCode = `
# Hello

This is a markdown editor.

<CH.Code style={{height: 200}}>

~~~py foo.py
print "Hello, world!";
~~~

</CH.Code>

`;

function App() {
  const [code, setCode] = useState(defaultCode);
  function handleEditorChange(value, event) {
    setCode(value);
  }

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
        <Preview code={code} />
      </main>
    </div>
  );
}

export default App;
