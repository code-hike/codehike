const { runChat } = require("./chat");
const { readPrompt, readTest, writeResultSection } = require("./markdown");
const fs = require("fs");

const testsMarkdown = fs.readFileSync("./tests.md", "utf8");
const promptContent = fs.readFileSync("./prompt.md", "utf8");

const tests = readTest(testsMarkdown);

const runId = Math.floor(Date.now() / 1000);
fs.mkdirSync(`./${runId}`);

Promise.all(
  tests.map(async (test) => {
    const promptMarkdown = promptContent.replace("${question}", test.question);
    const options = readPrompt(promptMarkdown);
    console.log(`Testing ${test.name}...`);
    const result = await runChat(options);
    const section = writeResultSection(test, result);
    // fs.writeFileSync(`./${runId}/${test.name}.md`, section);
    // console.log(`Done ./${runId}/${test.name}.md`);
    return section;
  })
)
  .then((results) => {
    const content = results.join("\n\n");
    fs.writeFileSync(`./${runId}/result.md`, content);
    fs.writeFileSync(`./${runId}/_prompt.md`, promptContent);
    console.log(`Results: ./${runId}/result.md`);
  })
  .catch((e) => console.log(e.response ? e.response.data : e.message));
