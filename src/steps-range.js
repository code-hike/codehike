import React from "react";
import { useSpring } from "use-spring";
import { Range } from "react-range";
export { StepsRange, useStepsProgress };

function useStepsProgress({ auto, stepsCount } = {}) {
  // change to reducer
  const [state, setState] = React.useState({
    target: 0,
    teleport: false,
    backwards: false,
    auto,
    delay: auto,
  });
  const { target, teleport, backwards, delay } = state;
  const [progress] = useSpring(target, { teleport });

  const fast = backwards && target > 0;
  useInterval(fast ? delay / 5 : delay, () => {
    const max = stepsCount - 1;
    setState(({ target, backwards, ...rest }) => {
      if (backwards && target <= 0) {
        return {
          ...rest,
          target: 1,
          teleport: false,
          backwards: false,
        };
      } else if (backwards && target > 0) {
        return {
          ...rest,
          target: Math.max(Math.ceil(target - 1), 0),
          teleport: false,
          backwards: true,
        };
      } else if (!backwards && target >= max) {
        return {
          ...rest,
          target: max - 1,
          teleport: false,
          backwards: true,
        };
      } else if (!backwards && target < max) {
        return {
          ...rest,
          target: Math.min(Math.floor(target + 1), max),
          teleport: false,
          backwards: false,
        };
      }
    });
  });

  const props = { state, setState, stepsCount, progress };

  return [progress, props];
}

function StepsRange({ state, setState, stepsCount, progress }) {
  const { delay } = state;

  const max = stepsCount - 1;
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
          onClick={() =>
            setState(({ target, ...rest }) => ({
              ...rest,
              teleport: false,
              target: Math.max(Math.ceil(target - 1), 0),
            }))
          }
        >
          {"<"}
        </Button>
        <Button
          onClick={() =>
            setState(({ auto, delay, ...rest }) => ({
              ...rest,
              auto,
              delay: delay ? null : auto,
            }))
          }
        >
          {delay ? "S" : "P"}
        </Button>
        <Button
          onClick={() =>
            setState(({ target, ...rest }) => ({
              ...rest,
              teleport: false,
              target: Math.min(Math.floor(target + 1), max),
            }))
          }
        >
          {">"}
        </Button>
        <RangeInput {...{ progress, updateProgress: setState, stepsCount }} />
        <div style={{ fontWeight: "bolder" }}>{progress.toFixed(2)}</div>
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
            color: inherit;
            background-color: transparent;
            cursor: pointer;
            user-select: none;
            padding: 2px 8px;
            border: none;
            border-radius: 6px;
            color: #7387c4;
            font-weight: bolder;
          }
        `}
      </style>
    </>
  );
}

function useInterval(delay, callback) {
  const savedCallback = React.useRef();

  // Remember the latest callback.
  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
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

function RangeInput({ progress, updateProgress, stepsCount }) {
  return (
    <Range
      values={[progress]}
      step={0.01}
      min={0}
      max={stepsCount - 1}
      onChange={(values) => {
        updateProgress((rest) => ({
          ...rest,
          target: values[0],
          teleport: true,
        }));
      }}
      renderTrack={({ props, children }) => (
        <div
          onMouseDown={props.onMouseDown}
          onTouchStart={props.onTouchStart}
          style={{
            ...props.style,
            height: "36px",
            display: "flex",
            width: "100%",
            margin: "0 24px",
          }}
        >
          <div
            ref={props.ref}
            style={{
              height: "5px",
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
            height: "20px",
            width: "20px",
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
