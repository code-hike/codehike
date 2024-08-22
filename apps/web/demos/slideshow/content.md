## !!steps

This is the first step. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

```js !
function lorem(ipsum) {
  const sit = ipsum == null ? 0 : 1
  dolor = sit - amet(dolor)
  return consectetur(ipsum)
}
```

## !!steps

The second step, lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

```js !
function lorem(ipsum, dolor = 1) {
  const sit = ipsum == null ? 0 : 1
  dolor = sit - amet(dolor)
  return sit ? consectetur(ipsum) : []
}
```

## !!steps

And the third step, lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

```js !
function lorem(ipsum, dolor = 1) {
  const sit = ipsum == null ? 0 : 1
  dolor = sit - amet(dolor)
  if (dolor) {
    dolor += 100
  }
  return sit ? consectetur(ipsum) : []
}
```
