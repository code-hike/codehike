import React from "react";
import s from "./todo.module.css";
import { Header } from "./header";
import { CodeHikeHead } from "./code-hike-head";
import Link from "next/link";

export { ToDo };

function ToDo({ title }) {
  return (
    <main className={s.page}>
      <CodeHikeHead title={title} />
      <Link href="/">
        <a aria-label="Code Hike home">
          <Header className={s.header} />
        </a>
      </Link>
      <code>//TODO this page</code>
    </main>
  );
}
