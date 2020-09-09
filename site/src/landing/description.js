import React from "react"
import s from "./description.module.css"
import Tooltip from "rc-tooltip"

export function Description() {
  return (
    <p className={s.description}>
      Code Hike is an{" "}
      <Tooltip
        overlayClassName={s.overlay}
        placement="top"
        trigger={["click"]}
        overlay={
          <div className={s.experimental}>
            <span className={s.label}>
              September 2020 status:
            </span>{" "}
            <p>
              <a href="https://www.npmjs.com/org/code-hike">
                Experimental versions on NPM
              </a>
              . Still very unstable, very undocumented, very
              buggy, and not very fast. Codesandbox examples
              coming soon for early adopters.
            </p>
          </div>
        }
      >
        <span className={s.hovereable}>experimental*</span>
      </Tooltip>{" "}
      open-source toolset for building all types of{" "}
      <strong>code walkthroughs</strong>: blog posts,
      tutorials, quickstarts, slides, videos, workshops,
      docs, and so on.
    </p>
  )
}
