import { AnnotationHandler } from "codehike/code"
import Link from "next/link"

export const link: AnnotationHandler = {
  name: "link",
  Inline: ({ annotation, children }) => {
    const { query } = annotation

    return (
      <Link href={query} className="underline">
        {children}
      </Link>
    )
  },
}
