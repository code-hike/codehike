import React from "react";

export function DemoContainer({ children }) {
  return (
    <div className="demo-container">
      {children}
      <style jsx global>{`
        /* From https://github.com/donycisneros/react-hooks-demo */

        @import url("https://fonts.googleapis.com/css?family=Playfair+Display:400,900i");

        .demo-container {
          background-color: #1e1e1e;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          padding: 0 25px;
          position: relative;
        }

        section {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
            "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
            "Helvetica Neue", sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          width: 360px;
          padding: 30px;
          background-color: #d1dae0;
          border-bottom: 4px solid #abb5b8;
          box-shadow: 8px 8px 0px 0px #000000;
          text-align: initial;
          font-size: 1.5rem;
          max-width: 90%;
        }
        .row:not(:first-child) {
          margin-top: 25px;
        }
        .row-title,
        section input {
          font-weight: bold;
          color: #696969;
          padding-left: 8px;
        }
        section input {
          border: none;
          font-size: 2.5rem;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
            "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
            "Helvetica Neue", sans-serif;
        }
        .row-content {
          font-size: 2.5rem;
          font-weight: bold;
          color: #000000;
          display: block;
          width: 100%;
          margin-top: 15px;
        }
        .row-content input,
        .row-content input:focus {
          padding: 7px;
          color: #000000;
          border-radius: 8px;
          width: 100%;
          outline: none;
        }
        .row-content input {
          background-color: transparent;
        }
        .row-content input:focus {
          background-color: #a0aaad;
        }
        .row-content input:focus::selection {
          background: #fff3a3;
        }
        .row-content input:focus::-moz-selection {
          background: #fff3a3;
        }

        section {
          font-size: 1rem;
          padding: 15px;
        }
        .row-content,
        section input {
          font-size: 1.2rem;
        }
        .row-content {
          margin-top: 1px;
        }
        .row:not(:first-child) {
          margin-top: 2px;
        }
        section input {
          padding: 0 7px 2px;
        }
      `}</style>
    </div>
  );
}
