Let's start with markdown file. I'm assuming we all know markdown. There's a reason why it's so popular, the syntax is so clean.

I'm sure I'm not the only one who wants to move as much content as possible to markdown, even content that doesn't originally belong to markdown. That's why we have MDX, right? We had to extend the original format so we could fit more types of content.

In this talk, we'll take this to the extreme, and use MDX for more unusual content and layouts.

---

But first I need to show you how this works. So we are going to start with this small react app.

This is using Next.js but the same applies to any app that has the MDX loader.

---

Most of the magic comes from this import. Here the MDX loader transforms the markdown file into a React component that we can use anywhere. And, as expected, it renders what you can see here on the right.

---

If we want to change what's rendered, we can use the MDXProvider component. It has a components prop, that let us override any of the default components.

For example, here we are changing all the h1s, adding a purple border.

---

A special component we can override is the Wrapper. The wrapper is the component that wraps the content from the markdown file. Here we are just adding a border to it. But the cool thing about this component, is that we get all the content as React elements in the children prop.

---

>

If we explore the children, you'll see they come with an mdxType. We can use that type to reorder or change what we render.

In the MDX docs there's a section called "Manipulating children" with more info about this. But don't google "manipulate children", you don't want that in your google history.

(OR an alternative title for this talk was "Manipulating children for fun and profit" but I guess it could be misunderstood )

---

OK, quick example about this. We could get all the H1s, by filtering all the children that have an mdxType equals to h1, and prepend a table of contents to the actual content.

Keep in mind we are doing this on run-time. There are a lot of plugins, for both markdown and mdx, that do things like these on build-time. In fact, we could write plugins to dmove to build-time most of the things we are going to do in this talk. Plugins are a bit more messy because you manipulate the abstract syntax tree instead of React children, but you should definitly consider them if you need better performance.

---

So far we used markdown. Now let's move to MDX.

I usually write content that has steps, like tutorials or any type of walkthrough where you explain something step by step.

Markdown doesn't have any specific syntax for grouping things in steps. So, here, we can use MDX to fill that gap.

For those unfamiliar with MDX, this isn't the best introduction. The most common usage of MDX is to embbed interactive components inside the markdown content. Here we are using it for something different, we are using MDX for augmenting the markdown content with extra syntax or conventions.

---

For example, we can put every step on it's own page. And add some state to the Wrapper, so the user can now change the page.

That's a pretty basic example, let's try something more ambitious.

---

There's a technique called scrollytelling. You may have seen it on some websites. You have content in steps that can be scrolled, and you have a piece of you screen that has fixed or sticky position, and it changes when you scroll to a new step.

In modern browsers you can combine features like Intersection Observers and position sticky to make a scrollytelling layout, but luckily for us, I can import a React component that already does that.

The important thing to see here is that, using the same MDX as in the previous example, we can use it as the source to a very different layout.

Now showing the step number in the right is boring. Usually we would want to show some content also from the MDX here.

---

So the steps will have two parts. We already have the content we show on the left, so we need a place to add the part of step that we want to show on the sticky section on the right.

We are the ones that manipulate the wrapper children, so we could put it anywhere we prefer, we could add a new component or pass it as props. I like to add the convention that the first child of the step is the sticky part and the rest is the scrollable part.

For example we added some code as the first child on each step.

---

// TODO remove images step

And we can change the part where we read the wrapper children, and extract each first child to another list.

Then we show that first child on the sticky part of the layout when the step changes.

---

I just happen to have a specific component to show terminal code. Which is cool because it also animates the transitions.

---

Now, I've been experimenting with another layout for walkthroughs. Instead of changing the steps using the scroll like in the scrollytelling layout, we can synchronize the steps with some media, like a video or an audio, maybe a podcast, and change the steps as the media progress.

So the extra information we need for that kind of layout is the name of the file, and a range of time when the step will show.

---

I also happen to have a React component for this. So we only need to extract the info from the props and pass it to the Video component.

You'll see how the step changes as soon as I snap my fingers, right... now.

Now, some of you may have noticed that this look similar to the layout of the video of this talk that I'm giving right now.

---

And it is, because this talk was built using this same technique. It's all mdx. It's allways have been.

In fact if you go to https://mdxconf.pomb.us you can interact with the components while you watch the talk, you can select and copy the code or interact with the iframes in the mini browser.

---

Ok, that's all I have. I leave you here the links to the repo of the talk. Not the slides, but the talk itself. You run yarn dev and you can watch this talk again.

Also there's also my twitter, and the components we used, most of them come from a new project I'm working on, it's called Code Hike and it focuses on code walkthroughs, and tools for making it easy to explain code.

Thank you.
