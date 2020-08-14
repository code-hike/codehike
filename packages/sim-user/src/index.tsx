import userEvent from "@testing-library/user-event"

export { sim }

type ClickAction = {
  type: "click"
  selector: string
  offset?: number
}
type ScrollAction = {
  type: "scroll"
  selector: string
}
type SimAction = ClickAction | ScrollAction

function scroll(action: ScrollAction, document: Document) {
  const element = document.querySelector(action.selector)!
  element.scrollIntoView({
    behavior: "smooth",
    block: "center",
  })
}

function click(action: ClickAction, document: Document) {
  const { selector, offset = 100 } = action
  const element = document.querySelector(selector)!
  // userEvent.click(element)

  const elemRect = element.getBoundingClientRect()
  const offsetTop =
    elemRect.top + window.pageYOffset + elemRect.height / 2
  const offsetLeft =
    elemRect.left +
    window.pageXOffset +
    (2 * elemRect.width) / 3

  const startTop = offsetTop + offset
  const startLeft = offsetLeft + offset
  const cursor = createCursor()
  cursor.style.position = "absolute"
  cursor.style.top = startTop + "px"
  cursor.style.left = startLeft + "px"
  cursor.style.opacity = "0.2"
  cursor.style.transform = "scale(3)"
  cursor.style.transition =
    "transform 600ms ease-in-out, opacity 500ms"
  document.body.appendChild(cursor)

  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      // console.log(element.offsetLeft)
      cursor.style.transform = `translate(${-offset}px, ${-offset}px) scale(1)`
      cursor.style.opacity = "1"
    })
  )

  cursor.addEventListener(
    "transitionend",
    async () => {
      userEvent.click(element)

      const circle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      )
      circle.setAttribute("cx", "8")
      circle.setAttribute("cy", "5")
      circle.setAttribute("fill", "currentColor")
      circle.setAttribute("r", "3")
      circle.style.opacity = "0.99"
      circle.style.transformOrigin = "8px 5px"
      circle.style.transition =
        "transform 300ms, opacity 300ms"

      const svg = cursor.firstChild as SVGElement

      svg.innerHTML = ""
      svg.appendChild(circle)

      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          circle.style.opacity = "0"
          circle.style.transform = `scale(10)`
        })
      )

      circle.addEventListener("transitionend", () => {
        if (cursor.parentElement)
          cursor.parentElement.removeChild(cursor)
      })
    },
    { once: true }
  )
}

function sim(action: SimAction, document?: Document) {
  const doc = document || window.document
  switch (action.type) {
    case "click":
      click(action, doc)
      return
    case "scroll":
      scroll(action, doc)
      return
  }
}

function createCursor() {
  const div = document.createElement("div")
  div.style.color = "#7387c4"
  div.innerHTML = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" 
  style="display:block; overflow:visible; filter: drop-shadow(0px 0px 1px rgba(0, 0, 0, .4))"
  viewBox="8 5 28 28" enable-background="new 0 0 28 28" xml:space="preserve" height="28px" width="28px">
<polygon fill="#FFFFFF" points="8.2,20.9 8.2,4.9 19.8,16.5 13,16.5 12.6,16.6 "/>
<polygon fill="#FFFFFF" points="17.3,21.6 13.7,23.1 9,12 12.7,10.5 "/>
<rect fill="currentColor" x="12.5" y="13.6" transform="matrix(0.9221 -0.3871 0.3871 0.9221 -5.7605 6.5909)" width="2" height="8"/>
<polygon fill="currentColor" points="9.2,7.3 9.2,18.5 12.2,15.6 12.6,15.5 17.4,15.5 "/>
</svg>`
  return div
}
