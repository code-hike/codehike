import React from "react";
import s from "./index.module.css";
import { MiniEditor } from "@code-hike/mini-editor";
import { MiniBrowser } from "@code-hike/mini-browser";
import { Range, getTrackBackground } from "react-range";

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
              zoom={0.4}
              url="http://localhost:3000/scroller"
            />
          </div>
          <div className={s.div3}>
            <Author />
          </div>
        </div>
        <VideoControls />
      </main>
    </div>
  );
}

function Author() {
  return (
    <div className={s.video}>
      <video
        src="000.mp4"
        style={{
          height: "100%",
          float: "right",
          marginRight: -30,
        }}
        loop
        autoPlay
        muted
      />
      <div
        className={s.details}
        style={{
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <div>
          <span style={{ fontSize: "1.2em" }}>@pomber</span>
          <div style={{ height: 5 }} />
          <span style={{ fontSize: "1.8em" }}>Rodrigo</span>
          <br />
          <span style={{ fontSize: "2em" }}>Pombo</span>
          <div style={{ height: 10 }} />
          <span style={{ fontSize: "1.3em" }}>
            FOO CONF
          </span>
        </div>
      </div>
    </div>
  );
}

const MIN = 0;
const MAX = 100;

function VideoControls() {
  const [value, setValue] = React.useState(10);
  return (
    <Range
      step={0.1}
      min={MIN}
      max={MAX}
      values={[value]}
      onChange={(values) => setValue(values[0])}
      renderTrack={({ props, children }) => (
        <div
          {...props}
          style={{
            ...props.style,
            height: "5px",
            width: "100%",
            background: getTrackBackground({
              values: [value],
              colors: ["red", "#ccc"],
              min: MIN,
              max: MAX,
            }),
          }}
        >
          {children}
        </div>
      )}
      renderThumb={({ props }) => (
        <div
          {...props}
          style={{
            ...props.style,
            height: "15px",
            width: "15px",
            borderRadius: "50%",
            backgroundColor: "red",
          }}
        />
      )}
    />
  );
}
