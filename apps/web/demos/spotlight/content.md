## !!steps A Game of Thrones

The first book in the A Song of Ice and Fire series by George R.R. Martin.

```js ! george.js
const houses = [
  "Stark",
  "Lannister",
  "Baratheon",
  "Targaryen",
]

const winner =
  houses[
    Math.floor(
      Math.random() * houses.length,
    )
  ]

console.log(`Iron Throne: ${winner}`)
```

## !!steps A Clash of Kings

The second book in the series.

```js ! george.js
const houses = [
  "Stark",
  "Lannister",
  "Baratheon",
  "Targaryen",
]

const clash = () => {
  const winner =
    houses[
      Math.floor(
        Math.random() * houses.length,
      )
    ]
  return `${winner} wins the battle!`
}

console.log(clash())
```

## !!steps A Storm of Swords

The third book.

```js ! george.js
const houses = [
  "Stark",
  "Lannister",
  "Baratheon",
]

const reveal = () => {
  const traitor =
    houses[
      Math.floor(
        Math.random() * houses.length,
      )
    ]
  return `${traitor} betrays the alliance!`
}

console.log(reveal())
```

## !!steps A Feast for Crows

The fourth book, explores the aftermath of the wars.

```js ! george.js
const houses = [
  "Martell",
  "Lannister",
  "Baratheon",
  "Tyrell",
]

const intrigue = () => {
  const ally1 =
    houses[
      Math.floor(
        Math.random() * houses.length,
      )
    ]
  const ally2 =
    houses[
      Math.floor(
        Math.random() * houses.length,
      )
    ]
  return `${ally1} and ${ally2} form an alliance!`
}

console.log(intrigue())
```
