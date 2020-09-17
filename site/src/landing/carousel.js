import React from "react"
import s from "./carousel.module.css"
import { useSpring } from "use-spring"

export { Carousel }

function Carousel({ children }) {
  const kids = React.Children.toArray(children)
  const [step, setStep] = React.useState(0)
  const [progress] = useSpring(step, { decimals: 3 })
  const {
    leftIndex,
    middleIndex,
    rigthIndex,
    translatePercentage,
    leftOpacity,
    middleOpacity,
    rightOpacity,
  } = getIndexes(progress, kids.length)
  return (
    <div className={s.carousel}>
      <div className={s.container}>
        <div
          className={s.centerContainer}
          style={{
            transform: `translateX(${-translatePercentage}%)`,
          }}
        >
          <Slide key={middleIndex} opacity={middleOpacity}>
            {kids[middleIndex]}
          </Slide>
          <Slide
            className={s.left}
            key={leftIndex}
            opacity={leftOpacity}
          >
            {kids[leftIndex]}
          </Slide>
          <Slide
            className={s.right}
            key={rigthIndex}
            opacity={rightOpacity}
          >
            {kids[rigthIndex]}
          </Slide>
        </div>
        <button
          className={`${s.carouselButton} ${s.left}`}
          onClick={() => setStep(step - 1)}
        >
          <ButtonArrow rotate />
        </button>
        <button
          className={`${s.carouselButton} ${s.right}`}
          onClick={() => setStep(step + 1)}
        >
          <ButtonArrow />
        </button>
      </div>
    </div>
  )
}

function Slide({ children, className, opacity }) {
  return (
    <div
      className={`${s.slideContainer} ${className || ""}`}
      style={{ "--opacity": opacity }}
    >
      <div className={s.slide}>{children}</div>
    </div>
  )
}

function getIndexes(progress, listLength) {
  const stepProgress = progress % 1
  const middle =
    stepProgress <= 0.5
      ? Math.floor(progress)
      : Math.ceil(progress)
  const left = middle - 1
  const right = middle + 1

  const middleOpacity = 1 - Math.abs(progress - middle)
  const leftOpacity = 1 - Math.abs(progress - left)
  const rightOpacity = 1 - Math.abs(progress - right)

  return {
    leftIndex: modulo(left, listLength),
    middleIndex: modulo(middle, listLength),
    rigthIndex: modulo(right, listLength),
    leftOpacity,
    middleOpacity,
    rightOpacity,
    translatePercentage: (progress - middle) * 100,
  }
}

function modulo(i, listLength) {
  return (i + listLength) % listLength
}

function ButtonArrow({ rotate }) {
  return (
    <svg
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        display: "block",
        transform: rotate && "rotate(180deg)",
      }}
    >
      <g clipPath="url(#clip0)">
        <path
          d="M190.825 367.841C178.817 381.785 180.354 402.785 194.258 414.746C208.162 426.707 229.168 425.1 241.175 411.155L190.825 367.841ZM329.537 257.649L304.361 235.992L304.361 235.992L329.537 257.649ZM329.54 255.237L354.777 233.483L354.777 233.483L329.54 255.237ZM241.237 101.63C229.269 87.732 208.269 86.2052 194.33 98.2198C180.392 110.234 178.795 131.241 190.763 145.139L241.237 101.63ZM241.175 411.155L354.712 279.306L304.361 235.992L190.825 367.841L241.175 411.155ZM354.777 233.483L241.237 101.63L190.763 145.139L304.303 276.992L354.777 233.483ZM354.712 279.306C366.071 266.115 366.099 246.63 354.777 233.483L304.303 276.992C294.173 265.228 294.197 247.795 304.361 235.992L354.712 279.306Z"
          fill="#8b9bce"
        />
      </g>
    </svg>
  )
}
