import React from "react";
import s from "./index.module.css";
import { MiniEditor } from "@code-hike/mini-editor";
import { MiniBrowser } from "@code-hike/mini-browser";

const code = require("!!raw-loader!./content/scroller.mdx")
  .default;

export default function Page() {
  return (
    <div className={s.page}>
      <style global jsx>{`
        html,
        body,
        div#__next {
          height: 100%;
          margin: 0;
        }
      `}</style>
      <main className={s.main}>
        <div className={s.grid}>
          <div className={s.div1}>
            <MiniEditor
              style={{ height: "100%" }}
              file="index.mdx"
              lang="md"
              code={code}
              focus="10:20"
            />
          </div>
          <div className={s.div2}>
            <MiniBrowser
              style={{ height: "100%" }}
              url="http://localhost:3000/scroller"
            />
          </div>
          <div className={s.div3}>
            <Author />
          </div>
        </div>
      </main>
    </div>
  );
}

function Author() {
  return (
    <div className={s.author}>
      <div className={s.details}>
        @pomber
        <br />
        Rodrigo Pombo
        <br />
        Foo Conf
      </div>
      <div className={s.video}></div>
    </div>
  );
}
