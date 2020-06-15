import React from "react";

export { Scroller, Step };

const ObserverContext = React.createContext();

function Scroller({ onStepChange, children }) {
  const [observer, setObserver] = React.useState();
  const vh = useWindowHeight();

  React.useLayoutEffect(() => {
    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        if (entry.intersectionRatio > 0) {
          // ref.current = entry.target.stepInfo
          onStepChange(+entry.target.stepIndex);
        }
      });
      // setRootRect(entries[0].rootBounds)
      // setIntersections(entries.map(e => e.intersectionRect))
    };
    const observer = new IntersectionObserver(handleIntersect, {
      rootMargin: `-${vh / 2 - 2}px 0px`,
      threshold: 0.000001,
    });
    setObserver(observer);

    return () => observer.disconnect();
  }, [vh]);

  return (
    <ObserverContext.Provider value={observer}>
      {children}
    </ObserverContext.Provider>
  );
}

function Step({ as = "section", index, ...props }) {
  const ref = React.useRef();
  const observer = React.useContext(ObserverContext);

  React.useLayoutEffect(() => {
    if (observer) {
      observer.observe(ref.current);
    }
    return () => observer && observer.unobserve(ref.current);
  }, [observer]);

  React.useLayoutEffect(() => {
    ref.current.stepIndex = index;
  }, [index]);

  return React.createElement(as, { ...props, ref });
}

function useWindowHeight() {
  const isClient = typeof window === "object";
  function getHeight() {
    return isClient ? document.documentElement.clientHeight : undefined;
  }
  const [windowHeight, setWindowHeight] = React.useState(getHeight);
  React.useEffect(() => {
    function handleResize() {
      setWindowHeight(getHeight());
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  React.useLayoutEffect(() => {
    // FIX when an horizontal scrollbar is added after the first layout
    setWindowHeight(getHeight());
  }, []);
  return windowHeight;
}
