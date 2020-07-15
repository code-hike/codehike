import React from "react";
import { useSpring } from "use-spring";
import { Range } from "react-range";
import { PauseIcon, PlayIcon, LeftIcon, RightIcon } from "./icons";
export { StepsRange, useStepsProgress };

function useStepsProgress({ delay, stepsCount } = {}) {
  const max = stepsCount - 1;
  function reducer(state, action) {
    const { target, backwards, playing } = state;
    switch (action.type) {
      case "seek": {
        const newTarget = action.target;
        return {
          ...state,
          target: newTarget,
          teleport: true,
          back: newTarget < target,
        };
      }
      case "next": {
        const newTarget = Math.min(Math.floor(target + 1), max);
        return {
          ...state,
          target: newTarget,
          teleport: false,
          back: newTarget < target,
        };
      }
      case "prev": {
        const newTarget = Math.max(Math.ceil(target - 1), 0);
        return {
          ...state,
          target: newTarget,
          teleport: false,
          back: newTarget < target,
        };
      }
      case "toggle":
        return {
          ...state,
          playing: !playing,
        };
      case "auto":
        if (target >= max || (backwards && target > 0)) {
          const newTarget = Math.max(Math.ceil(target - 1), 0);
          return {
            ...state,
            target: newTarget,
            backwards: true,
            teleport: false,
            back: newTarget < target,
          };
        } else {
          const newTarget = Math.min(Math.floor(target + 1), max);
          return {
            ...state,
            target: newTarget,
            backwards: false,
            teleport: false,
            back: newTarget < target,
          };
        }
      default:
        throw new Error();
    }
  }
  const [state, dispatch] = React.useReducer(reducer, {
    target: 0,
    teleport: false,
    backwards: false,
    playing: true,
    back: false,
  });

  const { target, teleport, backwards, playing } = state;
  const [progress] = useSpring(target, {
    teleport,
    decimals: 3,
    stiffness: 80,
    damping: 48,
    mass: 8,
  });

  const fast = backwards && target > 0;
  useInterval(!playing ? null : fast ? delay / 5 : delay, () => {
    dispatch({ type: "auto" });
  });

  const props = { state, dispatch, stepsCount, progress };

  return [progress, state.back, props];
}

function StepsRange({ state, dispatch, stepsCount, progress }) {
  const { playing } = state;

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginTop: "24px",
          color: "#7387c4",
        }}
      >
        <Button
          onClick={() => dispatch({ type: "prev" })}
          aria-label="Previous Step"
        >
          <LeftIcon style={{ display: "block" }} />
        </Button>
        <Button onClick={() => dispatch({ type: "toggle" })}>
          {playing ? (
            <PauseIcon
              style={{ display: "block", padding: "1px 3px" }}
              aria-label="Pause"
            />
          ) : (
            <PlayIcon
              style={{ display: "block", padding: "1px 3px" }}
              aria-label="Play"
            />
          )}
        </Button>
        <Button
          onClick={() => dispatch({ type: "next" })}
          aria-label="Next Step"
        >
          <RightIcon style={{ display: "block" }} />
        </Button>
        <RangeInput {...{ progress, dispatch, stepsCount }} />
        <div
          style={{
            fontWeight: "bolder",
            width: 70,
            flexShrink: 0,
            textAlign: "center",
            fontSize: "1.1em",
          }}
        >
          {progress.toFixed(2)}
        </div>
      </div>
    </>
  );
}

function Button(props) {
  return (
    <>
      <button {...props} />
      <style jsx>
        {`
          button {
            font: inherit;
            background-color: transparent;
            cursor: pointer;
            user-select: none;
            padding: 1px 0;
            border: none;
            color: #7387c4;
            height: 26px;
          }
        `}
      </style>
    </>
  );
}

function useInterval(delay, callback) {
  const savedCallback = React.useRef();
  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  React.useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay > 0) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

function RangeInput({ progress, dispatch, stepsCount }) {
  return (
    <Range
      values={[progress]}
      step={0.01}
      min={0}
      max={stepsCount - 1}
      onChange={(values) => {
        dispatch({ type: "seek", target: values[0] });
      }}
      renderTrack={({ props, children }) => (
        <div
          onMouseDown={props.onMouseDown}
          onTouchStart={props.onTouchStart}
          style={{
            ...props.style,
            height: "32px",
            display: "flex",
            width: "100%",
            margin: "0 10px",
          }}
        >
          <div
            ref={props.ref}
            style={{
              height: "4px",
              width: "100%",
              borderRadius: "4px",
              background: "#7387c4",
              alignSelf: "center",
            }}
          >
            {children}
          </div>
        </div>
      )}
      renderThumb={({ props, isDragged }) => (
        <div
          {...props}
          style={{
            ...props.style,
            height: "18px",
            width: "18px",
            borderRadius: "50%",
            border: `${isDragged ? 5 : 3}px solid #7387c4`,
            backgroundColor: "#fafafa",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxSizing: "border-box",
          }}
        />
      )}
    />
  );
}
