const { runChat } = require("./chat");
const { readPrompt, readTest, writeResultSection } = require("./markdown");
const fs = require("fs");

const testsMarkdown = fs.readFileSync("./tests.md", "utf8");
const promptContent = fs.readFileSync("./prompt.md", "utf8");

const tests = readTest(testsMarkdown);

Promise.all(
  tests.map(async (test) => {
    const promptMarkdown = promptContent.replace("${question}", test.question);
    const options = readPrompt(promptMarkdown);
    console.log(`Testing ${test.name}...`);
    const result = await runChat(options);
    console.log(`Done ${test.name}`);
    return writeResultSection(test, result);
  })
)
  .then((results) => {
    const content = results.join("\n\n");
    const runId = Math.floor(Date.now() / 1000);
    fs.mkdirSync(`./${runId}`);
    fs.writeFileSync(`./${runId}/result.md`, content);
    fs.writeFileSync(`./${runId}/prompt.md`, promptContent);
    console.log(`Results: ./${runId}/result.md`);
  })
  .catch((e) => console.log(e.response ? e.response.data : e.message));
