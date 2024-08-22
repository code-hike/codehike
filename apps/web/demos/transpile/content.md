```ts
interface Greeter {
  greet(): string
}

function sayHello(greeter: Greeter) {
  console.log(greeter.greet())
}
```
