import userEvent from "@testing-library/user-event"

export { sim }

type ClickAction = {
  type: "click"
  selector: string
}
type ScrollAction = {
  type: "scroll"
  selector: string
}
type SimAction = ClickAction | ScrollAction

function sim(action: SimAction, document?: Document) {
  const doc = document || window.document
  const element = doc.querySelector(action.selector)
  userEvent.click(element!)
}
