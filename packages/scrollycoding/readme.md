See [codehike.org](https://codehike.org)

# Scrollycoding

## MDX Usage

````md
<Hike>

<StepHead>

```jsx App.js
import React from "react"

export default function App() {
  return <h1>Hello World 1</h1>
}
```

</StepHead>

Step _1_ markdown.

<StepHead>

```jsx App.js
import React from "react"

export default function App() {
  return <h1>Hello World 2</h1>
}
```

</StepHead>

Step **2** markdown.

</Hike>
````

`<StepHead/>` marks the start of a new step. The empty lines surrounding the markdown are required.

In this example we are telling Code Hike to display an `App.js` file and interpret it as `jsx` for the syntax highlighting.

By default the code **needs** to be for the `App.js` file (you need to change the [preset](#presets) to use a different file). The preview will run that code and expect it to export a React component.

## Step focus

````md
<StepHead focus="3[16:29],5">

```jsx App.js
import React from "react"

export default function App() {
  return <h1>Hello World 1</h1>
}
```

</StepHead>

Step _1_ markdown.
````

With the `<StepHead/>` `focus` prop you can focus different part of the code for each step.

In the example above `"3[16:29],5"` means: "focus columns 16 to 29 from line 3, and line 5", more examples:

- `5:10` focus lines 5,6,7,8,9 and 10
- `1,3:5,7` focus lines 1,3,4,5 and 7
- `2[5]` focus column 5 in line 2
- `2[5:8]` focus columns 5, 6, 7 and 8 in line 2
- `1,2[1,3:5,7],3` focus line 1, columns 1, 3, 4, 5 and 7 in line 2 and line 3

## Focus button

````md
<StepHead>

```jsx App.js
import React from "react"

export default function App() {
  return <h1>Hello World 1</h1>
}
```

</StepHead>

This component is returning a <Focus on="4[10:31]">react element</Focus>.
````

The `<Focus/>` component adds a button that the user can click to change the focused code.

## Multiple files

````md
<StepHead focus="4">

```jsx App.js
import React from "react"
import Button from "./Button"

export default function App() {
  return <Button />
}
```

```jsx Button.js
import React from "react"

export default function Button() {
  return <button>hey</button>
}
```

</StepHead>

Step _1_ markdown.
````

You can have multiple files inside the `StepHead` component. By default the first listed file is the one displayed on the mini editor.

## Presets

If you need to include some boilerplate for all the steps, or change the styles, or add dependencies, you can override the preview preset:

```js
// preset.js

export default {
  customSetup: {
    files: {
      "/styles.css": {
        code: require(`!!raw-loader!./styles.css`).default,
      },
    },
    dependencies: {
      react: "latest",
      "react-dom": "latest",
      "react-refresh": "latest",
      "@babel/runtime": "latest",
      lodash: "4.17.11",
    },
  },
}
```

````md
import preset from './preset'

<Hike preset={preset}>

<StepHead>

```jsx App.js
import React from "react"
import _ from "lodash"

export default function App() {
  return <h1>{_.head([1, 2, 3])}</h1>
}
```

</StepHead>

Step _1_ markdown.

</Hike>
````

## Mobile and print layouts

````md
<StepHead>

```jsx App.js
import React from "react"

export default function App() {
  return <h1>Hello</h1>
}
```

</StepHead>

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam:

<PreviewSlot/>

Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

<CodeSlot />

Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
````

For small screens the two columns collapse in one. By default the code and the preview won't show. You need to explicitly add them in the place you prefer for each step using `<CodeSlot/>` and/or `<PreviewSlot>`.
