import React from "react";
import Link from "next/link";
import { CodeHikeLogo } from "./code-hike-logo";
import { useSpring } from "use-spring";

export { LogoHeader };

const logoSize = 104;
function LogoHeader() {
  const ref = React.useRef();
  const [targetAngle, setTargetAngle] = React.useState(0);
  const [angle] = useSpring(targetAngle, {
    mass: 12,
    stiffness: 50,
    damping: 10,
  });
  const handleMove = (e) => {
    const html = document.documentElement;
    const { top, left } = ref.current.getBoundingClientRect();

    const offsetY = top + logoSize / 2 + window.pageYOffset - html.clientTop;
    const offsetX = left + logoSize / 2 + window.pageXOffset - html.clientLeft;

    const x = e.pageX - offsetX;
    const y = e.pageY - offsetY;
    const angle = (Math.atan2(y, x) * 180) / Math.PI + 90 - 16;

    setTargetAngle(angle);
  };
  const handleLeave = (e) => {
    setTargetAngle(0);
  };

  return (
    <Link href="/">
      <a
        style={{
          color: "inherit",
          textDecoration: "none",
          margin: "92px auto 48px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <header
          ref={ref}
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <CodeHikeLogo
            style={{ height: logoSize, width: logoSize, display: "block" }}
            rotate={angle}
          />
          <div style={{ width: 16 }} />
          <div>
            <h1
              style={{
                fontSize: "3.1rem",
                margin: 0,
                fontFamily: `'Code', sans-serif`,
              }}
            >
              Code
            </h1>
            <h1
              style={{
                fontSize: "2.65rem",
                margin: 0,
                fontFamily: `'Hike', cursive`,
              }}
            >
              Hike
            </h1>
          </div>
        </header>
      </a>
    </Link>
  );
}
