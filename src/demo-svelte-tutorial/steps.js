const steps = [step("0.0"), step("0.1")];

function step(number) {
  return {
    text: require(`./steps/${number}.mdx`).default,
  };
}

console.log(steps);
export { steps };
