import MonacoEditor from "@monaco-editor/react";
import { useState } from "react";

const tabs = {
  mdx: {
    lang: "markdown",
    code: (input) => input.mdx,
  },
  css: {
    lang: "css",
    code: (input) => input.css,
  },
  config: {
    lang: "json",
    code: (input) => JSON.stringify(input.config, null, 2),
  },
};

export function Editor({ setInput, input }) {
  const [tab, setTab] = useState("mdx");

  function handleEditorChange(code, event) {
    let value = code;
    if (tab === "config") {
      console.log({ code });
      value = JSON.parse(code);
    }
    setInput((prev) => ({ ...prev, [tab]: value }));
  }

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
        theme="vs-dark"
        path={tab}
        defaultLanguage={tabs[tab].lang}
        defaultValue={tabs[tab].code(input)}
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
