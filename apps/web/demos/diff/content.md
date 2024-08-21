```js
function lorem(ipsum, dolor = 1) {
  const sit = ipsum == null ? 0 : ipsum.sit
  // !diff -
  dolor = ipsum - sit
  // !diff +
  dolor = sit - amet(dolor)
  return sit ? consectetur(ipsum) : []
}
```
