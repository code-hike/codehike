import React from "react";

export { Scroller, Step };

const ObserverContext = React.createContext<IntersectionObserver | undefined>(
  undefined
);

type ScrollerProps = {
  onStepChange: (stepIndex: number) => void;
  children: React.ReactNode;
  getRootMargin?: (vh: number) => string;
};

type StepElement = {
  stepIndex: any;
};

function defaultRootMargin(vh: number) {
  return `-${vh / 2 - 2}px 0px`;
}

function Scroller({
  onStepChange,
  children,
  getRootMargin = defaultRootMargin,
}: ScrollerProps) {
  const [observer, setObserver] = React.useState<IntersectionObserver>();
  const vh = useWindowHeight();

  React.useLayoutEffect(() => {
    const windowHeight = vh || 0;
    const handleIntersect: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.intersectionRatio > 0) {
          // ref.current = entry.target.stepInfo
          const stepElement = (entry.target as unknown) as StepElement;
          onStepChange(+stepElement.stepIndex);
        }
      });
      // console.log(entries[0].rootBounds, entries);
      // const rrect = document.getElementById("root-rect")!;
      // const bounds = entries[0].rootBounds;
      // rrect.style.top = bounds?.top + "px";
      // rrect.style.left = bounds?.left + "px";
      // rrect.style.height = bounds?.height + "px";
      // rrect.style.width = bounds?.width + "px";

      // const irect = document.getElementById("entry-rect")!;
      // const ibounds = entries[0].intersectionRect;
      // irect.style.top = ibounds?.top + "px";
      // irect.style.left = ibounds?.left + "px";
      // irect.style.height = ibounds?.height + "px";
      // irect.style.width = ibounds?.width + "px";
    };
    const observer = new IntersectionObserver(handleIntersect, {
      rootMargin: getRootMargin(windowHeight),
      threshold: 0.000001,
      root: document as any,
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

function Step({ as = "section", index, ...props }: { as: any; index: number }) {
  const ref = React.useRef<HTMLElement>(null!);
  const observer = React.useContext(ObserverContext);

  React.useLayoutEffect(() => {
    if (observer) {
      observer.observe(ref.current);
    }
    return () => observer && observer.unobserve(ref.current);
  }, [observer]);

  React.useLayoutEffect(() => {
    const stepElement = (ref.current as unknown) as StepElement;
    stepElement.stepIndex = index;
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
