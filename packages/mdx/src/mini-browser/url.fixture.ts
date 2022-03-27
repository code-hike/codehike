import { transformUrl } from "./use-steps"

const isNode = typeof window === "undefined"

const origin = "https://myorigin.com"

// todo migrate to vitest

if (!isNode) {
  // jest
  //   .spyOn(window, "origin", "get")
  //   .mockReturnValue(origin)
}

const cases = [
  [
    {
      url: undefined,
      loadUrl: undefined,
      prependOrigin: undefined,
    },
    { displayUrl: undefined, loadUrl: undefined },
  ],
  [
    {
      url: "foo.com",
      loadUrl: undefined,
      prependOrigin: undefined,
    },
    { displayUrl: "foo.com", loadUrl: "foo.com" },
  ],
  [
    {
      url: "foo.com",
      loadUrl: "bar.com",
      prependOrigin: undefined,
    },
    { displayUrl: "foo.com", loadUrl: "bar.com" },
  ],
  [
    {
      url: undefined,
      loadUrl: "bar.com",
      prependOrigin: undefined,
    },
    { displayUrl: undefined, loadUrl: "bar.com" },
  ],
  [
    {
      url: "/foo",
      loadUrl: "/bar",
      prependOrigin: true,
    },
    {
      displayUrl: isNode ? "/foo" : origin + "/foo",
      loadUrl: "/bar",
    },
  ],
]

export default function run() {
  cases.forEach(
    ([{ url, loadUrl, prependOrigin }, expected]) => {
      // test(`Parse url: ${url} ${loadUrl} ${prependOrigin}`, () => {
      //   expect(
      //     transformUrl(url, loadUrl, prependOrigin)
      //   ).toStrictEqual(expected)
      // })
    }
  )
}
