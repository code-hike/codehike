Let's start with markdown. I'm assuming we all know markdown. There's a reason why it's so popular. It has the right balance between power and readability.

That's why when I'm writing content for a website I try to put as much as possible inside markdown files.

But sometimes, the layout of the website doesn't match the linear flow of markdown. That's when we can add extra powers to markdown with MDX. That's what this talk is about.

---

Im going to show some MDX tricks using a small Next.js website. Nothing special about Next here. The same could be done with any React app that has a build step.

Most of the magic comes from this import. Here the MDX loader transforms the markdown file into a React component that we can use anywhere in our app.

---

There's also a MDX provider component that we can use to customize the output. For example, we can change how we render H1s. Here we are just changing the background but we could do anything with it.

---

Another component we can customize is the wrapper. We can use it to change the style of the container. But what's good about the wrapper is that you have access to the children, and you can transform them and arrange them in any layout you want.

---

If we explore the children, you'll see they come with an mdxType.
