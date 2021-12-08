![Code Hike](https://user-images.githubusercontent.com/1911623/144417674-e5ac77d9-e491-449c-aa70-6f8b46ffd6c6.png#gh-light-mode-only)
![Code Hike](https://user-images.githubusercontent.com/1911623/144418617-b8d4518a-2d09-46ad-80a7-d5cc3f8af053.png#gh-dark-mode-only)

Build first-class code walkthroughs for the web. Whether you are writing blog posts, documentation, tutorials, coding videos, or any type of technical content, Code Hike helps you create a superior code reading experience.

**There isn't a stable version yet**, but there's a preview version for people who want to try it out and [give feedback](https://github.com/code-hike/codehike/discussions). You can use it in any project that has MDX v2 configured. Or you can clone [this starter project](https://github.com/pomber/code-hike-sample).

There are no docs yet, but you can [explore the demos](https://codehike.org/#demos) for an overview of all the features and how to use them.

## How to set up Code Hike

1. First you need MDX v2 (or [xdm](https://github.com/wooorm/xdm/)). See [MDX v2 docs](https://mdxjs.com/docs/getting-started/) on how to set it up.
2. Install Code Hike remark plugin with `yarn add @code-hike/mdx@next`
3. Add the remark plugin to the MDX loader options. This depends on the bundler or site generator you are using. It usually looks something like this:

```js
const { remarkCodeHike } = require("@code-hike/mdx");
const theme = require("shiki/themes/monokai.json"); // any theme from shiki

// ...
// somewhere on your bundler configuration:
//      {
//        loader: "@mdx-js/loader",
//        options: {
            remarkPlugins: [[remarkCodeHike, { theme }]],
//        },
//      },
// ...
```

4. Add Code Hike's CSS. Also depends on your stack. Usually you can _just_ import it:

```js
import "@code-hike/mdx/dist/index.css";
```

5. Create an mdx file and copy the code from any of the [demos](https://codehike.org/#demos) to see if it works

Here is a [minimal Next.js example](https://github.com/pomber/code-hike-sample).

## License

MIT

## Powered by

[![Vercel](https://user-images.githubusercontent.com/1911623/145199399-68b8cd57-c331-4c50-81a2-8c491fb7c0a5.png#gh-dark-mode-only)](https://vercel.com/?utm_source=codehike&utm_campaign=oss#gh-dark-mode-only)
[![Vercel](https://user-images.githubusercontent.com/1911623/145199467-f07416cf-2ed5-4c6f-a4e1-bbcaabbec603.png#gh-light-mode-only)](https://vercel.com/?utm_source=codehike&utm_campaign=oss#gh-light-mode-only)
![spacer](https://user-images.githubusercontent.com/1911623/145202317-0bcfb3ed-403c-4737-a781-2eeb6b796e8b.png)
[![BrowserStack](https://user-images.githubusercontent.com/1911623/145201865-9786b79a-c532-41f7-8da0-91334b53f380.png#gh-dark-mode-only)](https://www.browserstack.com/#gh-dark-mode-only)
[![BrowserStack](https://user-images.githubusercontent.com/1911623/145201872-8940020c-5659-4066-9a0b-0eb25ace3e61.png#gh-light-mode-only)](https://www.browserstack.com/#gh-light-mode-only)
