```js
function lorem(ipsum, dolor = 1) {
  // !mark
  return dolor
}

function ipsum(lorem, dolor = 1) {
  // !mark(1:2) gold
  const sit = lorem == null ? 0 : lorem.sit
  dolor = sit - amet(dolor)
  // !mark[/sit/] pink
  return sit ? consectetur(lorem) : []
}
```
