import { InnerToken, RawCode } from "codehike/code"
import { Code as TheCode } from "@/components/code"
import { AnnotationHandler, InnerLine } from "codehike/code"
import { cn } from "@/lib/utils"

export async function Code(props: { codeblock: RawCode; className?: string }) {
  return <TheCode {...props} extraHandlers={[fblock]} />
}

export const fblock: AnnotationHandler = {
  name: "fblock",
  Line: ({ annotation, ...props }) => {
    const bg = "bg-sky-500/10"
    const border = "border-sky-500"

    return (
      <div
        data-mark={annotation ? "true" : undefined}
        className={cn(
          "border-l-2",
          annotation ? border : "border-transparent",
          annotation ? bg : "",
        )}
      >
        <InnerLine merge={props} />
      </div>
    )
  },
}
