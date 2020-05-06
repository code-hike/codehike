import React from "react";
import Head from "next/head";
import { GitHubCorner } from "../src/github-corner";
import { CodeHikeLogo } from "../src/code-hike-logo";

export default function Page() {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Code Hike</title>
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <meta name="twitter:card" content="summary" />
        <meta property="og:title" content="Code Hike" />
        <meta
          property="og:description"
          content="If I don't ship something before the countdown ends I am a clown 🤡"
        />
        <meta
          property="og:image"
          content="https://user-images.githubusercontent.com/1911623/80647122-54014500-8a44-11ea-91d0-0c6684c390b0.png"
        />
      </Head>
      <CodeHikeLogo className="logo" />
      <Countdown />
      <GitHubCorner repo="https://github.com/code-hike/codehike" />
      <style jsx global>
        {`
          html,
          body {
            height: 100%;
            margin: 0;
          }
          body > div {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100%;
          }
          .logo {
            max-width: 60vw;
            max-height: 60vw;
          }
          #time-container {
            height: 60px;
            font-size: 2em;
            margin: 30px 0;
            font-weight: bold;
            text-align: center;
          }

          a {
            color: #7387c4;
          }
        `}
      </style>
    </>
  );
}

function Countdown() {
  React.useEffect(() => {
    var countDownDate = new Date("June 15, 2020 18:00:00").getTime();

    function update() {
      var now = new Date().getTime();
      var distance = countDownDate - now;

      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      document.getElementById("time").innerHTML =
        days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
      // yes, i know, innerHTML in React

      if (distance < 0) {
        clearInterval(x);
        document.getElementById("time").innerHTML =
          'I, <a href="https://twitter.com/pomber">@pomber</a>, am a clown 🤡';
      }
    }

    var x = setInterval(update, 1000);

    update();
  }, []);
  return (
    <div id="time-container">
      <span id="time"></span>
    </div>
  );
}
