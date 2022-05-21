import MonacoEditor from "@monaco-editor/react";
import { useState } from "react";

export function Editor({ setCode, defaultCode }) {
  function handleEditorChange(value, event) {
    setCode(value);
  }

  const [tab, setTab] = useState("mdx");
  return (
    <div className="editor-side">
      <nav>
        <span
          className="editor-tab"
          data-active={tab === "mdx"}
          onClick={() => setTab("mdx")}
        >
          MDX
        </span>
        <span
          className="editor-tab"
          data-active={tab === "css"}
          onClick={() => setTab("css")}
        >
          CSS
        </span>
        <span
          className="editor-tab"
          data-active={tab === "config"}
          onClick={() => setTab("config")}
        >
          Config
        </span>
      </nav>
      <MonacoEditor
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
    </div>
  );
}
