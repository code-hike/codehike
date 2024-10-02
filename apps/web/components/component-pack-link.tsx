import { ArrowRight } from "lucide-react"

export function ComponentPackLink() {
  return (
    <div className="border border-pink-500 rounded-lg p-5 my-6 bg-zinc-800">
      Don't have time to build it yourself? Get a documentation component
      library customized for your tech stack and design system.
      <button className="bg-pink-500 text-white rounded-lg px-4 py-1 mt-2 block">
        Get the Docs Kit{" "}
        <span
          className="text-xs ml-2 line-through"
          style={{ textDecorationThickness: "2px" }}
        >
          60% off
        </span>{" "}
        <ArrowRight size={20} className="inline-block" />
      </button>
    </div>
  )
}
