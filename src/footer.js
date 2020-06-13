import React from "react";
import s from "./footer.module.css";

export { Footer };

function Footer() {
  return (
    <footer className={s.footer}>
      <a href="https://github.com/code-hike/codehike">GitHub</a>
      <a href="https://twitter.com/codehike_">Twitter</a>
      <a href="https://opencollective.com/codehike">Open Collective</a>
    </footer>
  );
}
