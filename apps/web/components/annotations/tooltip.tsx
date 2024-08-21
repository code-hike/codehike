import { AnnotationHandler, InlineAnnotationComponent } from "codehike/code"
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
} from "@/components/ui/tooltip"

export const tooltip: AnnotationHandler = {
  name: "tooltip",
  Inline: ({ children, annotation }) => {
    const { query, data } = annotation
    return (
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger className="underline decoration-dashed cursor-pointer underline-offset-4">
            {children}
          </TooltipTrigger>
          <TooltipContent
            className="bg-zinc-900"
            sideOffset={0}
            align="start"
            alignOffset={-8}
          >
            {data?.children || query}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  },
}
