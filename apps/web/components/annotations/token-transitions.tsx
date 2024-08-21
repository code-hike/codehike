import { AnnotationHandler, InnerToken } from "codehike/code"
import { PreWithRef } from "./token-transitions.client"

export const tokenTransitions: AnnotationHandler = {
  name: "token-transitions",
  PreWithRef,
  Token: (props) => (
    <InnerToken merge={props} style={{ display: "inline-block" }} />
  ),
}
