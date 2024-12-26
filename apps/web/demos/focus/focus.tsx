import { AnnotationHandler, InnerLine } from "codehike/code"
import { PreWithFocus } from "./focus.client"

export const focus: AnnotationHandler = {
  name: "focus",
  onlyIfAnnotated: true,
  PreWithRef: PreWithFocus,
  Line: (props) => (
    <InnerLine
      merge={props}
      className="opacity-50 data-[focus]:opacity-100 px-2"
    />
  ),
  AnnotatedLine: ({ annotation, ...props }) => (
    <InnerLine merge={props} data-focus={true} className="bg-zinc-700/30" />
  ),
}
