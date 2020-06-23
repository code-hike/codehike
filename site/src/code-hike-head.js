import React from "react";
import Head from "next/head";

export { CodeHikeHead };

function CodeHikeHead({ title = "Code Hike" }) {
  return (
    <Head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>{title}</title>
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
      <meta property="og:title" content={title} />
      <meta property="og:description" content="Marvellous code walkthroughs" />
      <meta
        property="og:image"
        content="https://user-images.githubusercontent.com/1911623/80647122-54014500-8a44-11ea-91d0-0c6684c390b0.png"
      />
    </Head>
  );
}
