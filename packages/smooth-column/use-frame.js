import React from "react";

function getGetFrame(prevKids, nextKids, padding) {
  const current = prevKids.filter((e) =>
    nextKids.some((p) => p.type === e.type)
  );
  const exit = prevKids.filter((e) => !nextKids.some((p) => p.type === e.type));
  const enter = nextKids.filter(
    (e) => !prevKids.some((p) => p.type === e.type)
  );

  const currentHeights = getHeights(current);
  const exitHeights = getHeights(exit);
  const enterHeights = getHeights(enter);

  const prevTops = translates(
    [...exitHeights, ...currentHeights],
    [],
    enterHeights,
    padding
  );
  const nextTops = translates(
    [...currentHeights, ...enterHeights],
    exitHeights,
    [],
    padding
  );

  const prevHeight =
    sum(prevKids.map((k) => (k && k.props && k.props.height) || 0)) +
    prevKids.length * padding -
    padding;
  const nextHeight =
    sum(nextKids.map((k) => (k && k.props && k.props.height) || 0)) +
    nextKids.length * padding -
    padding;

  const height = Math.min(prevHeight, nextHeight);

  const allKids = [...exit, ...current, ...enter];

  const state = [
    ...exit.map((_) => "exit"),
    ...current.map((_) => "stay"),
    ...enter.map((_) => "enter"),
  ];

  return (progress) => {
    return {
      height,
      frame: allKids.map((kid, i) => ({
        child: kid,
        translateY: tweenTranslate(prevTops[i], nextTops[i], progress),
        opacity:
          state[i] === "stay"
            ? 1
            : state[i] === "exit"
            ? tweenOpacity(1 - progress)
            : tweenOpacity(progress),
      })),
    };
  };
}

export function useFrame(prevKids, nextKids, progress, padding) {
  const getFrame = React.useMemo(
    () => getGetFrame(prevKids, nextKids, padding),
    [prevKids, nextKids, padding]
  );
  return getFrame(progress);
}

function tweenOpacity(t) {
  return Math.pow(t, 4);
}

function tweenTranslate(p, n, t) {
  return (n - p) * t + p;
}

function getHeights(kids) {
  return kids.map((kid) => {
    if (!kid || !kid.props || kid.props.height == null) {
      console.warn("View children should have a height prop");
      return 0;
    } else {
      return kid.props.height;
    }
  });
}

function translates(current, exit, enter, padding) {
  const total = sum(current) + (current.length - 1) * padding;
  const middle = total / 2;
  let acc = -middle;
  const currentTops = current.map((h) => {
    const top = acc;
    acc += h + padding;
    return top;
  });

  const exitTotal = sum(exit) + exit.length * padding;
  acc = (currentTops[0] || -200) - exitTotal;
  const exitTops = exit.map((h) => {
    const top = acc * 1.4;
    acc += h + padding;
    return top;
  });

  acc = (middle || 200) + padding;
  const enterTops = enter.map((h) => {
    const top = acc * 1.4;
    acc += h + padding;
    return top;
  });

  return [...exitTops, ...currentTops, ...enterTops];
}

function sum(array) {
  return array.reduce((a, b) => a + b, 0);
}
