import { LatestSponsor } from "../landing/sponsors"
import Content from "./content.md"
import { Code } from "@/components/code"

export default function Page() {
  return (
    <div className="m-4 prose">
      <div>{new Date().toString()}</div>
      <LatestSponsor />
      <Content components={{ Code }} />
    </div>
  )
}
