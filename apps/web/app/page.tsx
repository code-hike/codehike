import Link from "next/link"
import {
  AllSponsors,
  LatestSponsor,
  PoweredBy,
  Pricing,
  TopSponsors,
} from "./landing/sponsors"
import { cn } from "../lib/utils"
import { Boxes } from "./landing/boxes"
import { Demo } from "./landing/demo"

export default function HomePage() {
  return (
    <main className="min-h-screen max-w-3xl mx-auto">
      <h1 className="text-slate-900/80 text-4xl md:text-5xl lg:text-5xl tracking-tight text-center dark:text-white/80 pt-12 max-w-3xl mx-auto text-balance font-extrabold !leading-tight">
        <div className="sm:text-5xl md:text-[3.5rem]">
          Build{" "}
          <strong className=" dark:text-fuchsia-400 text-fuchsia-600/80">
            rich content websites
          </strong>{" "}
        </div>
        <div>with Markdown and React</div>
      </h1>
      <Demo />

      <div className="flex w-full justify-center gap-4 my-12">
        <ButtonLink href="docs" className="w-32">
          Docs
        </ButtonLink>
        <ButtonLink href="blog" className="w-32">
          Blog
        </ButtonLink>
      </div>

      <TopSponsors className="mb-24" />

      <Boxes className="mb-24" />

      <Pricing />

      <h3 className="text-center pb-8 text-primary/60 text-lg">Sponsors</h3>
      <LatestSponsor className="mb-4" />
      <AllSponsors cta="Become a sponsor" className="mb-24" />

      <PoweredBy className="mb-8 text-center flex items-center justify-center gap-4 w-full flex-wrap" />
    </main>
  )
}

function Chart() {
  return (
    <div className="my-10  text-primary/80 max-w-2xl mx-auto bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-700/50 rounded-xl py-5 px-8">
      <h2 className="text-center pb-4 text-lg">
        Content experiences you can build
        <br /> while keeping all your content in plain markup:
      </h2>
      <div className="flex flex-col items-start gap-1 py-1">
        <Bar value={25}>Markdown</Bar>
        <Bar value={45}>MDX</Bar>
        <Bar value={80}>MDX + Code Hike</Bar>
        <Bar value={90}>MDX + Code Hike + RSC</Bar>
      </div>
      <div className="flex w-full justify-between px-1 pt-1 text-sm bg-gradient-to-r from-violet-700 to-pink-600 dark:from-violet-400 dark:to-pink-400 bg-clip-text text-transparent font-bold">
        <span className="w-16 text-left">More Static</span>
        <span className="w-20 text-center">Static Article</span>
        <span className="w-24 text-center">Interactive Explainer</span>
        <span className="w-20 text-center">Landing Page</span>
        <span className="w-24 text-center">Personalized Docs</span>
        <span className="w-16 text-right">More Dynamic</span>
      </div>
    </div>
  )
}

function Bar({
  className,
  children,
  value,
}: {
  className?: string
  children: React.ReactNode
  value: number
}) {
  return (
    <div
      className={cn(
        "relative w-full px-4 py-0.5 text-base text-white bg-gradient-to-r from-violet-600  dark:from-violet-800 to-pink-500 dark:to-pink-500 rounded",
        className,
      )}
    >
      {children}
      <div
        className="absolute right-0 bg-zinc-50 dark:bg-zinc-900 opacity-80 inset-y-0"
        style={{ width: `${100 - value}%` }}
      ></div>
    </div>
  )
}

function ButtonLink({
  href,
  children,
  className,
}: {
  className?: string
  href: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className={
        "border border-primary/50 rounded p-2 text-center hover:border-primary transition-colors " +
        className
      }
    >
      {children}
    </Link>
  )
}
