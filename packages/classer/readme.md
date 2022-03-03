> Classer is a tool from [Code Hike](https://codehike.org)

A little package to make React component libraries interoperable with most styling solutions. ([See this twitter thread explaining why this is useful](https://twitter.com/pomber/status/1362125599607820290))

You write your library code like this:

```jsx
// foo-library code
import { useClasser } from "@code-hike/classer"

export function Foo({ classes }) {
  const c = useClasser("foo", classes)
  return (
    <div className={c("container")}>
      <h1 className={c("title")}>Hello</h1>
      <p className={c("description")}>World</p>
      <img
        className={c("img")}
        src="https://placekitten.com/200/200"
      />
    </div>
  )
}
```

And the library consumers use it like this in their apps:

```jsx
import { Foo } from "foo-library"

const classes = {
  "foo-title": "my-app-blue",
  "foo-img": "rounded-corners some-border",
}

function MyApp() {
  return <Foo classes={classes} />
}
```

`MyApp` renders this HTML:

```html
<div class="foo-container">
  <h1 class="foo-title my-app-blue">Hello</h1>
  <p class="foo-description">World</p>
  <img
    class="foo-img rounded-corners some-border"
    src="https://placekitten.com/200/200"
  />
</div>
```

Examples:

- [With Emotion](https://codesandbox.io/s/classer-emotion-b7go0)
- [With Tailwind](https://codesandbox.io/s/classer-tailwind-wfs1d)

## Context

You can also do this (to avoid passing `classes` to nested components):

```jsx
// foo-library code
import {
  useClasser,
  ClasserProvider,
} from "@code-hike/classer"

export function Foo({ classes }) {
  return (
    <ClasserProvider classes={classes}>
      <FirstChild />
      <SecondChild />
    </ClasserProvider>
  )
}

function FirstChild() {
  const c = useClasser("foo-first")
  return <h1 className={c("title")}>Hi</h1>
}

function SecondChild() {
  const c = useClasser("foo-second")
  return <h1 className={c("title")}>Ho</h1>
}
```

```jsx
import { Foo } from "./foo-library"
import styles from "./app.module.css"

const classes = {
  "foo-title": styles.myTitle,
  "foo-img": styles.myImage,
}

function MyApp() {
  return <Foo classes={classes} />
}
```

## License

MIT
