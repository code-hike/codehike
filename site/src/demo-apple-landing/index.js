import React from "react";
import s from "./index.module.css";
import { CodeHikeHead } from "src/code-hike-head";
import { MiniTerminal } from "@code-hike/mini-terminal";

export { Demo };

function Demo() {
  return (
    <div className={s.page}>
      <CodeHikeHead title="Apple Landing Demo | Code Hike" />
      <header>
        <h3>Cloning Apple landing page, with Code Hike.</h3>
        <p>
          <a href="/">Go to Code Hike home</a>
        </p>
      </header>
      <div className={s.step}>
        Lorem ipsum dolor sit amet, cons ectetur adi piscing elit. Vesti bulum
        id elit vitae quam laoreet posuere in eu nisl.
      </div>
      <Section title="First" />
      <Section title="Second" />
      <footer>
        <p>
          Built with <a href="/">Code Hike</a>
        </p>
        <nav>
          <a href="https://twitter.com/codehike_">Twitter</a> •{" "}
          <a href="https://opencollective.com/code-hike">Open Collective</a> •{" "}
          <a href="https://github.com/code-hike/codehike">GitHub</a>
        </nav>
      </footer>
    </div>
  );
}

function Section({ title }) {
  const h = 260;
  return (
    <section>
      <h3 className={s.sectionTitle}>{title}</h3>
      <div
        className={s.sticker}
        style={{ top: `calc(100vh - ${h}px)`, height: h + 1 }}
      >
        <MiniTerminal text="$ foo" height={h - 50} style={{ width: 300 }} />
      </div>
      <div>
        <ol style={{ marginTop: -h + 30, paddingBottom: h }}>
          <li className={s.step}>
            Lorem ipsum dolor sit amet consectetur adipiscing elit.
          </li>
          <li className={s.step}>
            Eiusmod tempor incididunt ut labore et dolore.
          </li>
          <li className={s.step}>
            Magna aliqua ut enim ad minim veniam quis nostrud exercitation
            ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </li>
          <li className={s.step}>
            In voluptate velit esse cillum dolore. Eu fugiat nulla pariatur.
          </li>
          <li className={s.step}>
            Excepteur sint occaecat cupidatat non proident sunt in culpa qui
            officia deserunt.
          </li>
        </ol>
      </div>
    </section>
  );
}
