import React from "react";
import s from "./header.module.css";
import { CodeHikeLogo } from "./code-hike-logo";
import { useSpring } from "use-spring";

export { Header };

function Header(props) {
  const [angle, containerProps] = useRotation(`.${s.logo}`);
  return (
    <header {...props}>
      <div className={s.header} {...containerProps}>
        <CodeHikeLogo className={s.logo} rotate={angle} />
        <div className={s.space} />
        <h1>
          <span className={s.code}>Code</span>
          <span className={s.space} />
          <span className={s.hike}>Hike</span>
        </h1>
      </div>
    </header>
  );
}

function useRotation(logoSelector) {
  const [targetAngle, setAngle] = React.useState(0);
  const [angle] = useSpring(targetAngle, {
    mass: 12,
    stiffness: 50,
    damping: 10,
  });

  const props = {
    onMouseMove: (e) => {
      const logo = e.currentTarget.querySelector(logoSelector);
      const { top, left, width, height } = logo.getBoundingClientRect();
      const x = e.clientX - left - width / 2;
      const y = e.clientY - top - height / 2;
      const angle = (Math.atan2(y, x) * 180) / Math.PI + 90 - 16;
      const delta = mod(angle - targetAngle + 180, 360) - 180;
      setAngle(targetAngle + delta);
    },
    onMouseLeave: () => {
      const delta = mod(-targetAngle + 180, 360) - 180;
      setAngle(targetAngle + delta);
    },
  };
  return [angle, props];
}

function mod(n, m) {
  return ((n % m) + m) % m;
}
