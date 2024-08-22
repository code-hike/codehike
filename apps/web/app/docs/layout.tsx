import { docs } from "../source"
import { DocsLayout } from "next-docs-ui/layout"
import type { ReactNode } from "react"
export default function RootDocsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <DocsLayout
        tree={docs.pageTree}
        nav={{ enabled: false }}
        sidebar={{
          enabled: true,
        }}
      >
        {children}
      </DocsLayout>
    </>
  )
}
