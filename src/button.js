import React from "react";
import Link from "next/link";
export { ExternalLinkButton, LinkButton };

function LinkButton({ href, ...props }) {
  return (
    <Link href={href} passHref>
      <ExternalLinkButton {...props} />
    </Link>
  );
}

const ExternalLinkButton = React.forwardRef((props, ref) => {
  return (
    <>
      <a {...props} ref={ref} />
      <style jsx>{`
        a {
          font-weight: 700;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          -webkit-box-pack: center;
          justify-content: center;
          user-select: none;
          position: relative;
          white-space: nowrap;
          vertical-align: middle;
          line-height: 1.2;
          height: 2.5rem;
          min-width: 2.5rem;
          font-size: 1.2rem;
          padding-left: 1rem;
          padding-right: 1rem;
          color: #7387c4;
          background-color: transparent;
          border-radius: 0.25rem;
          border: 2px solid currentcolor;
        }
      `}</style>
    </>
  );
});
