import React from "react"
import { MiniBrowser } from "@code-hike/mini-browser"
import {
  SandpackClient,
  SandpackBundlerFiles,
} from "@codesandbox/sandpack-client"
import { EditorStep } from "@code-hike/mini-editor"

export function Preview({
  className,
  files,
}: {
  className: string
  files: EditorStep["files"]
}) {
  const iframeRef = React.useRef<HTMLIFrameElement>(null!)
  const clientRef = React.useRef<SandpackClient>(null!)

  React.useEffect(() => {
    clientRef.current = new SandpackClient(
      iframeRef.current,
      { ...json, files: mergeFiles(json.files, files) },
      {
        showOpenInCodeSandbox: false,
        // showErrorScreen: false,
        // showLoadingScreen: false,
      }
    )
  }, [])

  React.useEffect(() => {
    if (clientRef.current) {
      clientRef.current.updatePreview({
        ...json,
        files: mergeFiles(json.files, files),
      })
    }
  }, [files])

  return (
    <MiniBrowser className={className}>
      <iframe ref={iframeRef} />
    </MiniBrowser>
  )
}

function mergeFiles(
  csbFiles: SandpackBundlerFiles,
  chFiles: EditorStep["files"]
) {
  const result = { ...csbFiles }
  chFiles.forEach(file => {
    result["/" + file.name] = {
      code: file.code.lines
        .map(l => l.tokens.map(t => t.content).join(""))
        .join("\n"),
    }
  })
  return result
}

const json = {
  dependencies: { react: "16.0.0", "react-dom": "16.0.0" },
  entry: "/src/index.js",
  environment: "create-react-app",
  files: {
    "/.codesandbox/workspace.json": {
      code:
        '{\n  "responsive-preview": {\n    "Mobile": [\n      320,\n      675\n    ],\n    "Tablet": [\n      1024,\n      765\n    ],\n    "Desktop": [\n      1400,\n      800\n    ],\n    "Desktop  HD": [\n      1920,\n      1080\n    ]\n  }\n}',
    },
    "/package.json": {
      code:
        '{\n  "name": "react",\n  "version": "1.0.0",\n  "description": "React example starter project",\n  "keywords": ["react", "starter"],\n  "main": "src/index.js",\n  "dependencies": {\n    "react": "17.0.2",\n    "react-dom": "17.0.2",\n    "react-scripts": "4.0.0"\n  },\n  "devDependencies": {\n    "@babel/runtime": "7.13.8",\n    "typescript": "4.1.3"\n  },\n  "scripts": {\n    "start": "react-scripts start",\n    "build": "react-scripts build",\n    "test": "react-scripts test --env=jsdom",\n    "eject": "react-scripts eject"\n  },\n  "browserslist": [">0.2%", "not dead", "not ie <= 11", "not op_mini all"]\n}\n',
    },
    "/public/index.html": {
      code:
        '<!DOCTYPE html>\n<html lang="en">\n\n<head>\n\t<meta charset="utf-8">\n\t<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">\n\t<meta name="theme-color" content="#000000">\n\t<!--\n      manifest.json provides metadata used when your web app is added to the\n      homescreen on Android. See https://developers.google.com/web/fundamentals/engage-and-retain/web-app-manifest/\n    -->\n\t<link rel="manifest" href="%PUBLIC_URL%/manifest.json">\n\t<link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">\n\t<!--\n      Notice the use of %PUBLIC_URL% in the tags above.\n      It will be replaced with the URL of the `public` folder during the build.\n      Only files inside the `public` folder can be referenced from the HTML.\n\n      Unlike "/favicon.ico" or "favicon.ico", "%PUBLIC_URL%/favicon.ico" will\n      work correctly both with client-side routing and a non-root public URL.\n      Learn how to configure a non-root public URL by running `npm run build`.\n    -->\n\t<title>React App</title>\n</head>\n\n<body>\n\t<noscript>\n\t\tYou need to enable JavaScript to run this app.\n\t</noscript>\n\t<div id="root"></div>\n\t<!--\n      This HTML file is a template.\n      If you open it directly in the browser, you will see an empty page.\n\n      You can add webfonts, meta tags, or analytics to this file.\n      The build step will place the bundled scripts into the <body> tag.\n\n      To begin the development, run `npm start` or `yarn start`.\n      To create a production bundle, use `npm run build` or `yarn build`.\n    -->\n</body>\n\n</html>',
    },
    "/src/App.js": {
      code:
        'import "./styles.css";\n\nexport default function App() {\n  return (\n    <div className="App">\n      <h1>Hello Sandpack</h1>\n      <h2>Start editing to see some magic happen!</h2>\n    </div>\n  );\n}\n',
    },
    "/src/index.js": {
      code:
        'import { StrictMode } from "react";\nimport ReactDOM from "react-dom";\n\nimport App from "./App";\n\nconst rootElement = document.getElementById("root");\nReactDOM.render(\n  <StrictMode>\n    <App />\n  </StrictMode>,\n  rootElement\n);\n',
    },
    "/src/styles.css": {
      code:
        ".App {\n  font-family: sans-serif;\n  text-align: center;\n}\n",
    },
  },
  main: "/src/index.js",
}
