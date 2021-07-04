import { addons } from "@storybook/addons"
import { create } from "@storybook/theming"

const isProd = process.env.NODE_ENV === "production"

// https://storybook.js.org/docs/react/configure/theming
const theme = create({
  base: "light",
  brandTitle: "Code Hike",
  brandUrl: "https://codehike.org",
  brandImage: "/codehike.png",
  appBg: "#ffffff",
  appContentBg: "#eaedf6",
})

// https://storybook.js.org/docs/react/configure/features-and-behavior
addons.setConfig({
  theme,
  isFullscreen: false,
  showNav: true,
  showPanel: false,
  panelPosition: "bottom",
  enableShortcuts: false,
  isToolshown: !isProd,
  selectedPanel: undefined,
  initialActive: "sidebar",
  sidebar: {
    showRoots: true,
    collapsedRoots: ["test"],
  },
  toolbar: {
    title: { hidden: false },
    zoom: { hidden: true },
    eject: { hidden: false },
    copy: { hidden: true },
    fullscreen: { hidden: true },
  },
})
