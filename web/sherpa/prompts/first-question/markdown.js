function readPrompt(promptMarkdown) {
  const frontmatter = promptMarkdown.match(/^---\n([\s\S]+?)\n---\n/)[1];
  const frontmatterLines = frontmatter.split("\n");
  const options = frontmatterLines.reduce((acc, line) => {
    const [key, value] = line.split(": ");
    acc[key] = value;
    return acc;
  }, {});

  if (options.temperature !== undefined) {
    options.temperature = parseFloat(options.temperature);
  }

  options.messages = readSections(promptMarkdown);
  return options;
}

function readTest(testsMarkdown) {
  return readSections(testsMarkdown).map((test) => ({
    name: test.role,
    question: test.content,
  }));
}

function readSections(md) {
  const sectionRegex = /(^#+ .+)(?:\n+)((?:(?:(?!^#+ .)[\s\S])+))/gm;
  const messages = [];
  let match;
  while ((match = sectionRegex.exec(md)) !== null) {
    const role = match[1].replace("#", "").trim();
    const content = match[2].trim();
    messages.push({ role, content });
  }
  return messages;
}

function writeResultSection(test, result) {
  return `# ${test.name}

duration: ${result.duration}
cost: ${result.cost}
finish_reason: ${result.finish_reason}

${result.answer}
`;
}

module.exports = {
  readPrompt,
  readTest,
  writeResultSection,
};
