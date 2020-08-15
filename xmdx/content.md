Let's start with this markdown file. I'm assuming we all know markdown.

There's a reason why it's so popular, it has a very clean syntax.

I'm sure I'm not the only one who likes to move as much content as possible to markdown, even content that doesn't originally belong to markdown.

And that's why we have MDX, right? We had to extend the original format so we could put more things on it.

In this talk, we'll take this to the extreme, we'll use MDX for more unusual content and layouts.

---

But first I need to show you how this works. We are going to start with this small react app.

This is using Next.js but the same applies to any app that has the MDX loader.

---

Most of the magic comes from this import.

Here the MDX loader transforms the markdown file into a React component that we can use anywhere.

And, you can see, it renders what you expect here on the right.

---

If we want to change what's rendered, we can use the MDXProvider component.

It has a components prop, that let us override any of the default components.

For example, here we are changing all the h1s, adding a purple border.

---

A special component we can override is the Wrapper.

The wrapper is the component that wraps the content. Here we are just adding a border to it.

But the cool thing about this component is that in the children prop, we get all the content from the markdown file as React elements.

---

And React elements are just javascript objects.

So here you can see what's inside the children prop.

We are rendering the wrapper children as JSON, and filtering some properties to make it easier to read.

You'll see that it is an array. The first element is an h1, the second a paragraph.

Each element comes with an mdxType, we can, and we will, use that mdxType to extract information about the content or to change the elements.

---

For example, we could get a list of all the H1s from the children, and render it as a table of contents.

This is a simple example, but it illustrates the pattern we are going to use on the rest of the examples.

In all of them, first, we extract some data from the children, and then we render it in a specific way.

Keep in mind that this runs on every render. In most cases, it isn't a performance problem, but if it is, you can move it to a plugin, and run the transformation on build-time.

---

I usually write content that has steps, like tutorials or any type of walkthrough where you explain something step by step.

Markdown doesn't have any specific syntax for grouping things in steps. But we can use MDX to extend markdown and introduce our syntax.

The implementation of the Step component we are using here doesn't matter, we are just using it for grouping elements.

If you are new to MDX, this may not be the best introduction. The typical use-case for MDX is embedding interactive components in markdown. But here we are taking a different approach, and using it more as a syntax extension for markdown.

---

Now, based on the MDX file that has steps, we can write another Wrapper component.

In this case, in the children prop, we get one React element for each step.

So we can keep track of what step we are showing using React state, and let the user change the current step with a button.

-> click

-> click

Ok, now I want to show the same content but with a different layout.

There's a technique called scrollytelling. You may have seen it on some websites, as the user scrolls down there's some part of the layout that sticks to the screen while the rest is scrolled away. Let's do that.

---

Since this is a lightning talk I'll import the ScrollytellingLayout component. I'll share the link to the repo later if you want to see how it works.

The ScrollytellingLayout component takes two props, one for the left-side that can be scrolled, and the other for the sticky part on the right.

When the user scrolls to a new step

--> scroll

we show the corresponding element from the sticker list.

--> scroll

--> scroll

Now, instead of showing the step number, let's add the sticker content to the MDX file.

---

Suppose we want to show some code in the sticky part of the layout.

There isn't any specific syntax for this, so we need to create our convention. Like, for example, we put the sticky part of the step as the first element.

---

Now, doing some array transformation, we get the list of steps and the list of stickers and pass them to the same Layout component.

So when the user scrolls

--> scrolls

the code on the right

--> scrolls

should change accordingly.

---

Just for fun, I have a Terminal component that animates between code transitions,

so we can use it for the stickers.

--> scrolls

--> scrolls

--> scrolls

--> scrolls 0

I've been experimenting with another layout for walkthroughs,
instead of changing the steps using the scroll like in this example,
we can synchronize the steps with some media, like a video or audio, maybe a podcast, and change the steps as the media progress.

---

To do that, in the MDX file, we need to specify the media file and the time range for each step.

---

Once we have that, we can extract it from the children on the Wrapper, and pass it to another React component.

This time is the TalkLayout component, that solves all the synching for us.

And you should see the steps changing every time I snap the fingers.

--> snap 1

--> snap 2

Some of you may have noticed that this looks similar to the layout of this talk that I'm giving right now.

And it is.

---

This talk was built using this same technique. It's all MDX.

For example, here on the left, you can see the code for the step you are currently watching.

---

And the next step.

---

Ok, that's all.

The takeaway is: you can use MDX to build your own dialect tailored for any specific layout.

I leave you here the links to the repo of the talk. Not the slides, but the talk itself. You run yarn dev and you can watch this talk again.

Also, there's my twitter, and the components we used.
Most of them come from a new project I'm working on, it's called Code Hike and it focuses on code walkthroughs and tools for making it easy to explain code.

Thank you.
