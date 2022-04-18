---
sidebar_position: 1
---

# Code Hike + Docusaurus

Create a Docusaurus website:

```
npx create-docusaurus@latest my-website classic
```

<CH.Scrollycoding>

```js docusaurus.config.js
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

Code Hike requires MDX v2 but Docusaurus [doesn't support it yet](https://github.com/facebook/docusaurus/issues/4029). So we'll need to add a Docusaurus theme to support it:

So you install it with:

```bash
npm i docusaurus-theme-mdx-v2
```

And add it to your `docusaurus.config.js` with _`themes: ["mdx-v2"]`_.

> There may be a few docusaurs features that doesn't work with mdx v2 yet, make sure to check the [known issues](https://github.com/pomber/docusaurus-mdx-2#known-issues).

---

```md blog/2019-05-29-long-blog-post.md 5
This is the summary of a very long blog post,

Use a comment to limit blog post size in the list view.

<!--truncate-->

Lorem ipsum dolor sit amet
```

MDX v2 has some breaking changes in the syntax. So if you already have content using mdx v1 make sure to migrate to the new syntax. You can find [the migration guide on the mdx website](https://mdxjs.com/migrating/v2/).

If you are following this guide with the Docusaurus template the only change we need to make is one comment in the blog post `2019-05-29-long-blog-post.md`. From _`<!--truncate-->`_ to _`{/\* truncate \*/}`_.

</CH.Scrollycoding>
