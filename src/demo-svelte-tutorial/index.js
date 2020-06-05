import React from "react";
import { CodeHikeHead } from "src/code-hike-head";
import s from "./index.module.css";

export { Demo };

function Demo() {
  return (
    <>
      <CodeHikeHead title="Svelte Tutorial Demo | Code Hike" />

      <div className={s.page}>
        <main>
          <h1>Mini Svelte Tutorial</h1>
          <div className={s.content}>
            <div className={s.text}>
              <section>Something something</section>
              <section>Something something</section>
              <section>Something something</section>
              <section>Something something</section>
            </div>
            <div className={s.stickerContainer}>
              <div className={s.sticker}>Sticker</div>
            </div>
          </div>
          <footer>Foo Bar</footer>
        </main>
      </div>
    </>
  );
}
