import { AnnotationHandler, InnerLine } from "codehike/code"
import { PreWithRef } from "./focus.client"

export const focus: AnnotationHandler = {
  name: "focus",
  PreWithRef,
  onlyIfAnnotated: true,
  Line: (props) => (
    <InnerLine merge={props} className="opacity-50 data-[focus]:opacity-100" />
  ),
  AnnotatedLine: ({ annotation, ...props }) => (
    <InnerLine merge={props} data-focus={true} />
  ),
}
