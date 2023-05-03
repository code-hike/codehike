import MonacoEditor from "@monaco-editor/react";
import { useState } from "react";
import { themeList } from "./themes";

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

  function handleEditorChange(code) {
    let value = code;
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
      {tab === "config" ? (
        <ConfigEditor config={input.config} onChange={handleEditorChange} />
      ) : (
        <div className="editor">
          <MonacoEditor
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
      )}
    </div>
  );
}

function ConfigEditor({ config, onChange }) {
  return (
    <form className="editor config-editor">
      <label>
        <input
          type="checkbox"
          checked={config.lineNumbers}
          onChange={(e) =>
            onChange({ ...config, lineNumbers: e.target.checked })
          }
        />
        Line Numbers
      </label>
      <label>
        <input
          type="checkbox"
          checked={config.showCopyButton}
          onChange={(e) =>
            onChange({ ...config, showCopyButton: e.target.checked })
          }
        />
        Copy Button
      </label>
      <label>
        <input
          type="checkbox"
          checked={config.autoLink}
          onChange={(e) => onChange({ ...config, autoLink: e.target.checked })}
        />
        Auto Link
      </label>
      <label>
        Theme:
        <br />
        <select
          value={config.theme}
          onChange={(e) => onChange({ ...config, theme: e.target.value })}
        >
          {themeList().map((theme) => (
            <option key={theme}>{theme}</option>
          ))}
        </select>
      </label>
    </form>
  );
}
