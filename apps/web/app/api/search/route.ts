import { docs } from "@/app/source"
import { createSearchAPI } from "next-docs-zeta/search/server"

export const { GET } = createSearchAPI("advanced", {
  indexes: docs.getPages().map((page) => ({
    title: page.data.title,
    structuredData: page.data.exports.structuredData,
    id: page.url,
    url: page.url,
  })),
})
