import Image from "next/image"
import { CodeHikeLogo } from "../../../ui/nav"

const title = "The Curse of Markdown"
const description = "And the content website wasteland"
const date = "November 21, 2024"

import pomber from "../[slug]/pomber.jpg"

export default function Page() {
  return (
    <div className="prose text-zinc-50">
      <div
        className="flex justify-between flex-col p-16"
        style={{ width: 1200, height: 628 }}
      >
        <div className="flex-1 flex items-start justify-between ">
          <span className="flex items-center text-4xl font-bold text-accent-foreground/90">
            <CodeHikeLogo className="h-12 w-12" /> Code Hike's blog
          </span>
          <span className="text-xl font-bold text-accent-foreground/90 ml-auto">
            {date}
          </span>
        </div>
        <h1 className="text-6xl text-pretty m-0 pr-24">{title}</h1>
        <h2 className="text-accent-foreground/90 text-pretty text-4xl m-0 flex-1  pr-24">
          <div className="pt-10">{description}</div>
        </h2>
        <div className="flex items-center gap-4 ml-auto">
          <Image
            src={pomber}
            alt="pomber"
            width={56}
            height={56}
            priority={true}
            className="rounded-full m-0"
          />
          <div>
            <div className="font-semibold text-xl">Rodrigo Pombo</div>
            <div className="text-primary/60 text-lg">@pomber</div>
          </div>
        </div>
      </div>
    </div>
  )
}
