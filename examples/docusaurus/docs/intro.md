---
sidebar_position: 1
---

# Code Hike + Docusaurus

You can create a new Docusaurus website with:

```
npx create-docusaurus@latest my-website classic
```

To use Code Hike we need to add these dependencies:

```
cd my-website
npm i @mdx-js/react docusaurus-theme-mdx-v2 @code-hike/mdx
```

<CH.Scrollycoding>

```js docusaurus.config.js focus=7
/** @type {import('@docusaurus/types').Config} */
const config = {
  presets: [
    // ...
  ],

  themes: ["mdx-v2"],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        // ...
      },
    }),
}

module.exports = config
```

## MDX v2 theme

Code Hike requires MDX v2 but Docusaurus [doesn't support it yet](https://github.com/facebook/docusaurus/issues/4029). That's why we are using the [MDX v2 theme](https://github.com/pomber/docusaurus-mdx-2).

We've already added the dependency, now we need to add the theme to the `docusaurus.config.js` with _`themes: ["mdx-v2"]`_..

> There may be a few docusaurs features that don't work with mdx v2 yet, make sure to check the [known issues](https://github.com/pomber/docusaurus-mdx-2#known-issues).

---

```text blog/2019-05-29-long-blog-post.md focus=12
---
slug: long-blog-post
title: Long Blog Post
authors: endi
tags: [hello, docusaurus]
---

This is the summary of a very long blog post,

Use a comment to limit blog post size in the list view.

<!--truncate-->

Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Pellentesque elementum dignissim ultricies. Fusce rhoncus
ipsum tempor eros aliquam consequat. Lorem ipsum dolor sit amet

Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Pellentesque elementum dignissim ultricies. Fusce rhoncus
ipsum tempor eros aliquam consequat. Lorem ipsum dolor sit amet

```

MDX v2 has some breaking changes in the syntax. So if you already have content using mdx v1 make sure to migrate to the new syntax. You can find [the migration guide on the mdx website](https://mdxjs.com/migrating/v2/).

If you are following this guide with the Docusaurus template the only change we need to make is one comment in the blog post `2019-05-29-long-blog-post.md`.

Change it from `<!--truncate-->` to `{/* truncate */}`.

---

{/* prettier-ignore */}
```js docusaurus.config.js focus=1:4,13:15
const theme = require("shiki/themes/nord.json")
const {
  remarkCodeHike,
} = require("@code-hike/mdx")

/** @type {import('@docusaurus/types').Config} */
const config = {
  presets: [
    [
      "classic",
      {
        docs: {
          beforeDefaultRemarkPlugins: [
            [remarkCodeHike, { theme }],
          ],
          sidebarPath: require.resolve("./sidebars.js"),
        },
      },
    ],
  ],

  themes: ["mdx-v2"],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        // ...
      },
    }),
};

module.exports = config;
```

Now that Docusaurus can render MDX v2 we can add Code Hike to the `docusaurus.config.js`.

We need to import the `remarkCodeHike` function from the _`@code-hike/mdx`_ package, and add it to the _`beforeDefaultRemarkPlugins`_ array.

Next to the plugin you can pass a [config object](focus://14[30:38]). Almost always you'll want to pass a theme there. You can import one from shiki, or make a custom one.

You can also pass more options, like `lineNumbers` for example. See the [configuration docs](/configuration) for more information.

---

{/* prettier-ignore */}
```js docusaurus.config.js focus=19,20,22
const theme = require("shiki/themes/nord.json")
const {
  remarkCodeHike,
} = require("@code-hike/mdx")

/** @type {import('@docusaurus/types').Config} */
const config = {
  presets: [
    [
      "classic",
      {
        docs: {
          beforeDefaultRemarkPlugins: [
            [remarkCodeHike, { theme }],
          ],
          sidebarPath: require.resolve("./sidebars.js"),
        },
        theme: {
          customCss: [
            require.resolve("@code-hike/mdx/styles.css"),
            require.resolve("./src/css/custom.css"),
          ],
        },
      },
    ],
  ],

  themes: ["mdx-v2"],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        // ...
      },
    }),
};

module.exports = config;
```

Then we need to import Code Hike's stylesheet.

There's a `customCSS` property in the theme config. You can replace it with an array and add Code Hike's stylesheet to it.

If you want to customize Code Hike's styles with a global stylesheet make sure to import it after this import to avoid specificity issues.

You can learn more about customizing Code Hike styles in the [styling docs](/styling).

</CH.Scrollycoding>

The code for this tutorial is available on [GitHub](https://github.com/code-hike/codehike/tree/main/examples/docusaurus).

You can also try it out from your browser on Stackblitz.
