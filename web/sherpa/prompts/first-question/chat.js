const pricing = {
  "gpt-3.5-turbo": {
    prompt: 0.002 / 1000,
    completion: 0.002 / 1000,
  },
  "gpt-4": {
    prompt: 0.03 / 1000,
    completion: 0.06 / 1000,
  },
};

require("dotenv").config({ path: "../../.env.local" });
const { Configuration, OpenAIApi } = require("openai");

async function runChat(options) {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const start = Date.now();
  const result = await openai.createChatCompletion(options);
  const end = Date.now();

  const duration = round((end - start) / 1000);
  const { model, usage, choices } = result.data;
  const { prompt_tokens, completion_tokens } = usage;
  const { message, finish_reason } = choices[0];
  const answer = message.content;

  const modelKey = Object.keys(pricing).find((key) => model.startsWith(key));
  const { prompt, completion } = pricing[modelKey];
  const cost = round(prompt_tokens * prompt + completion_tokens * completion);

  return {
    duration,
    cost,
    finish_reason,
    answer,
  };
}

module.exports = {
  runChat,
};

function round(number) {
  return Math.round(number * 10000) / 10000;
}
