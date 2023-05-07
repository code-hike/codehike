# node-post-request

duration: 12.743
cost: 0.0009
finish_reason: stop

```js index.js
const https = require("https");

const data = JSON.stringify({
  name: "John Doe",
  email: "johndoe@example.com",
});

const options = {
  hostname: "api.example.com",
  path: "/users",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": data.length,
  },
};

const req = https.request(options, (res) => {
  console.log(`statusCode: ${res.statusCode}`);

  res.on("data", (data) => {
    process.stdout.write(data);
  });
});

req.on("error", (error) => {
  console.error(error);
});

req.write(data);
req.end();
```

Assuming that you have `https` setup already, this is an example of a simple `POST` request that sends a JSON payload. You can replace the `hostname`, `path`, `data`, and `headers` with your own values.

Does this help? 

---

- Yes, thank you
- No, I'm using a different module
- No, I'm actually trying to make a request from the browser


# grow-textarea

duration: 16.373
cost: 0.0011
finish_reason: stop

```html index.html
<style>
  #textarea-container {
    position: fixed;
    bottom: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 10px;
    box-sizing: border-box;
  }
  
  #textarea {
    flex: 1;
    min-height: 20px;
    max-height: 200px;
    overflow: auto;
  }
</style>

<div id="textarea-container">
  <textarea
    id="textarea"
    rows="1"
    placeholder="Type something here..."
  ></textarea>
  <div id="textarea-counter">0/10 lines</div>
</div>

<script>
  const textarea = document.getElementById("textarea");
  const counter = document.getElementById("textarea-counter");
  textarea.addEventListener("input", (event) => {
    const lines = event.target.value.split("\n").length;
    if (lines <= 10) {
      textarea.style.height = "auto";
      textarea.style.height = `${event.target.scrollHeight}px`;
      counter.innerText = `${lines}/10 lines`;
    } else {
      event.preventDefault();
    }
  });
</script>
```

Here's an example of a text area, fixed to the bottom of the page, that grows as the user types more lines, with a maximum of 10 lines. 

You can adjust the `min-height`, `max-height`, and `placeholder` attributes to fit your specific needs.
