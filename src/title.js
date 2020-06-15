import React from "react";
import s from "./title.module.css";

export { Title };

function Title() {
  return (
    <div className={s.titleContainer}>
      <Logo />
      <div />
      <div className={s.textContainer}>
        <span className={s.code}>Code</span>
        <span className={s.hike}>Hike</span>
      </div>
    </div>
  );
}

function Logo() {}
