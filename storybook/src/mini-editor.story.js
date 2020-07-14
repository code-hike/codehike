import React from "react";
import { MiniEditor } from "@code-hike/mini-editor";
import { Page, WithProgress } from "./utils";

export default {
  title: "Mini Editor",
};

export const basic = () => (
  <Page>
    <MiniEditor />
  </Page>
);

export const code = () => (
  <Page>
    <MiniEditor
      code="console.log()"
      lang="js"
      steps={[{ file: "foo.js" }, { file: "foo.js" }]}
    />
  </Page>
);

export const terminal = () => (
  <WithProgress>
    {(progress, backward) => (
      <MiniEditor
        style={{ height: 500 }}
        code="console.log()"
        lang="js"
        progress={progress}
        steps={[{ file: "foo.js" }, { file: "bar.js", terminal: "$ bar" }]}
      />
    )}
  </WithProgress>
);
