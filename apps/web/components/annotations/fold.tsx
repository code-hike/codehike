import { AnnotationHandler } from "codehike/code"
import { InlineFold } from "./fold.client"

export const fold: AnnotationHandler = {
  name: "fold",
  Inline: InlineFold,
}
