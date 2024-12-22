import GHLogo from "./logo.github.png"
import GHText from "./text.github.png"
import MetaLogo from "./logo.meta.png"
import DrivlyLogo from "./logo.drivly.png"
import SpeakeasyLogo from "./logo.speakeasy.svg"
import UidevLogo from "./logo.uidev.svg"
import Image from "next/image"
import Link from "next/link"
import sponsorData from "./sponsors.json"
import { Check, CheckCheck, GithubIcon, Heart, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { TimeAgo } from "@/components/time-ago"

export function Pricing() {
  const current = 625
  const goal = 950
  return (
    <section className="max-w-3xl mx-2 pb-12">
      <h3 className="text-center pb-12 text-primary/60 text-lg">Pricing</h3>
      <div className="grid gap-4 md:grid-cols-2 md:gap-4">
        <div className="flex flex-col items-center space-y-4 border py-4 rounded min-h-72">
          <h4 className="text-2xl font-bold py-4">Free</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Check className="inline text-green-400" size={20} /> Full access
              to all features
            </li>
            <li>
              <Check className="inline text-green-400" size={20} /> Regular
              updates
            </li>
            <li>
              <Check className="inline text-green-400" size={20} />{" "}
              Comprehensive documentation
            </li>
            <li>
              <Check className="inline text-green-400" size={20} /> Support on
              GitHub and Discord
            </li>
            <li>
              <Check className="inline text-green-400" size={20} /> Plenty
              copy-pastable examples
            </li>
          </ul>
          <div className="flex-1" />
          <Link
            href="/docs"
            className="block border rounded p-2 mx-4 text-center hover:border-primary transition-colors self-stretch text-muted-foreground hover:text-primary"
          >
            Get started
          </Link>
        </div>
        <div className="flex flex-col items-center space-y-4 border py-4 rounded min-h-72 border-pink-400">
          <h4 className="text-2xl font-bold py-4">Pay what you want</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <CheckCheck className="inline text-green-400" size={20} />{" "}
              Everything in Free
            </li>
            <li>
              <Heart className="inline text-pink-400 align-bottom" size={18} />{" "}
              Contribute to sustainable open source
            </li>
          </ul>
          <div className="flex-1" />
          <div className="self-stretch mx-4 text-primary/70">
            <div className="text-xs pb-2 text-center">
              {Math.round((100 * current) / goal)}% towards $950 per month goal
            </div>
            <div className=" w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-pink-400 transition-all duration-500 ease-in-out"
                style={{ width: `${(100 * current) / goal}%` }}
              />
            </div>
          </div>
          <Link
            href="https://github.com/sponsors/code-hike?metadata_source=pricing"
            className="block border text-primary border-pink-400/50 rounded p-2 mx-4 text-center hover:border-pink-400 transition-colors self-stretch"
          >
            Become a sponsor
          </Link>
        </div>
      </div>
    </section>
  )
}

export async function LatestSponsor({ className }: { className?: string }) {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN
  if (!GITHUB_TOKEN) {
    throw new Error("Missing process.env.GITHUB_TOKEN")
  }

  const r = await fetch("https://api.github.com/graphql", {
    method: "POST",
    body: JSON.stringify({ query: latestSponsorsQuery }),
    headers: { Authorization: "bearer " + GITHUB_TOKEN },
  })
  if (!r.ok) {
    throw new Error(`Failed to fetch: ${r.status} ${r.statusText}`)
  }
  const { data, errors } = await r.json()
  if (errors) {
    throw new Error(JSON.stringify(errors))
  }

  const sponsors = data.organization.sponsorshipsAsMaintainer.edges
  if (!sponsors.length) {
    throw new Error("No sponsors found")
  }

  const latest = sponsors[0].node

  return (
    <a
      href={`https://github.com/${latest.sponsorEntity.login}`}
      className={cn(
        className,
        "rounded bg-zinc-50 dark:bg-zinc-900 p-3 flex gap-3 border border-zinc-200/50 dark:border-zinc-700/50 hover:border-zinc-200 dark:hover:border-zinc-700 transition-colors w-96 md:w-full mx-auto",
      )}
    >
      <Image
        className="rounded my-0 max-h-20"
        src={`${latest.sponsorEntity.avatarUrl}`}
        alt={latest.sponsorEntity.name}
        height={80}
        width={80}
        placeholder="empty"
      />
      <div className="flex-1 flex flex-col justify-between">
        {/* <div>{new Date().toString()}</div> */}
        <div className="text-primary/70 text-sm">
          Latest sponsor · <TimeAgo date={latest.createdAt} />
        </div>
        <div className="text-2xl font-bold">
          {latest.sponsorEntity.name || latest.sponsorEntity.login}
        </div>
        <div className="text-primary/90 text-sm">
          Sponsoring <strong>{latest.tier.name}</strong>{" "}
        </div>
      </div>
      {/* <pre>{JSON.stringify(latest, null, 2)}</pre> */}
    </a>
  )
}

export function TopSponsors({
  title = "Top Sponsors",
  scale = 1,
  className,
}: {
  title?: string
  scale?: number
  className?: string
}) {
  return (
    <section className={className}>
      <h3 className="text-center pb-6 text-primary/60 text-md">{title}</h3>
      <div className="flex gap-4 justify-center invert dark:invert-0 flex-wrap">
        <a
          className="overflow-hidden flex p-2 items-center gap-1  cursor-pointer opacity-80 hover:opacity-100"
          href="https://opensource.fb.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src={MetaLogo}
            alt="Meta logo"
            height={36 * scale}
            placeholder="empty"
            priority={true}
          />
        </a>
        <a
          className="overflow-hidden flex p-2 items-center gap-1  cursor-pointer opacity-80 hover:opacity-100"
          href="https://www.speakeasy.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src={SpeakeasyLogo}
            alt="Speakeasy logo"
            height={36 * scale}
            placeholder="empty"
            priority={true}
          />
        </a>
        <a
          className="overflow-hidden flex p-2 items-center gap-1  cursor-pointer opacity-80 hover:opacity-100"
          href="https://ui.dev/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src={UidevLogo}
            alt="ui.dev logo"
            height={28 * scale}
            placeholder="empty"
            priority={true}
          />
          <span className="text-2xl text-white">ui.dev</span>
        </a>
        <a
          className="overflow-hidden flex p-2 items-center gap-1  cursor-pointer opacity-80 hover:opacity-100"
          href="https://driv.ly/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src={DrivlyLogo}
            alt="Drivly logo"
            height={44 * scale}
            placeholder="empty"
            priority={true}
          />
        </a>
      </div>
      <a
        className="overflow-hidden flex gap-4 justify-center items-center mt-16 cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
        href="https://github.blog/2023-04-12-github-accelerator-our-first-cohort-and-whats-next/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="dark:text-yellow-500/80 text-yellow-500/60">
          <Star className="fill-current ml-auto" size={17} />
          <Star className="fill-current mr-1" size={22} />
          <Star className="fill-current ml-auto" size={17} />
        </div>
        <Image
          src={GHLogo}
          alt="GitHub logo"
          height={42}
          width={42}
          placeholder="empty"
          priority={true}
          className="invert dark:invert-0"
        />
        <span className="flex flex-col">
          <span className="text-primary/60 text-sm">Backed by</span>
          <span className="text-lg font-bold">GitHub Accelerator</span>
        </span>
        <div className="dark:text-yellow-500/80 text-yellow-500/60">
          <Star className="fill-current" size={17} />
          <Star className="fill-current ml-1" size={22} />
          <Star className="fill-current" size={17} />
        </div>
      </a>
    </section>
  )
}

export async function AllSponsors({
  className,
  title,
  cta,
}: {
  className?: string
  title?: string
  cta?: string
}) {
  const sponsors = sponsorData

  return (
    <section className={className}>
      {title && (
        <h3 className="text-center pb-8 text-primary/60 text-lg">{title}</h3>
      )}
      <Row sponsors={sponsors.slice(0, 20)} size={66} className="" />
      <Row sponsors={sponsors.slice(20, 52)} size={38} />
      <Row sponsors={sponsors.slice(52, 112)} size={30} />
      {cta && (
        <Link
          href="https://github.com/sponsors/code-hike?metadata_source=landing"
          className="block border text-primary border-primary/50 rounded p-2 w-48 mx-auto mt-8 text-center hover:border-primary transition-colors"
        >
          {cta}
        </Link>
      )}
    </section>
  )
}

function Row({
  sponsors,
  size,
  className,
}: {
  sponsors: any[]
  size: number
  className?: string
}) {
  return (
    <div
      className={
        "flex flex-row flex-wrap justify-between pb-2 w-96 md:w-full gap-2 mx-auto " +
          className || ""
      }
    >
      {sponsors.map((s: any, i) => (
        <a
          key={i}
          href={`https://github.com/${s.name}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            className="rounded grayscale-[80%] opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-150 cursor-pointer my-0"
            src={`https://github.com/${s.name}.png`}
            alt={s.name}
            height={size}
            width={size}
            placeholder="empty"
          />
        </a>
      ))}
    </div>
  )
}

export function PoweredBy({ className }: { className?: string }) {
  return (
    <footer className={className}>
      <span
        title="as in: they are letting Code Hike use their services for free"
        className="text-primary/80"
      >
        Powered by
      </span>
      <div className="flex gap-4">
        <a
          href="https://vercel.com?utm_source=codehike&utm_campaign=oss"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Vercel"
          className="grayscale-[50%] opacity-80 hover:grayscale-0 hover:opacity-100 transition-all"
        >
          <svg
            height="1em"
            className="inline-block"
            viewBox="0 0 4438 1000"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2223.75 250C2051.25 250 1926.87 362.5 1926.87 531.25C1926.87 700 2066.72 812.5 2239.38 812.5C2343.59 812.5 2435.47 771.25 2492.34 701.719L2372.81 632.656C2341.25 667.188 2293.28 687.344 2239.38 687.344C2164.53 687.344 2100.94 648.281 2077.34 585.781H2515.16C2518.59 568.281 2520.63 550.156 2520.63 531.094C2520.63 362.5 2396.41 250 2223.75 250ZM2076.09 476.562C2095.62 414.219 2149.06 375 2223.75 375C2298.59 375 2352.03 414.219 2371.41 476.562H2076.09ZM2040.78 78.125L1607.81 828.125L1174.69 78.125H1337.03L1607.66 546.875L1878.28 78.125H2040.78ZM577.344 0L1154.69 1000H0L577.344 0ZM3148.75 531.25C3148.75 625 3210 687.5 3305 687.5C3369.38 687.5 3417.66 658.281 3442.5 610.625L3562.5 679.844C3512.81 762.656 3419.69 812.5 3305 812.5C3132.34 812.5 3008.13 700 3008.13 531.25C3008.13 362.5 3132.5 250 3305 250C3419.69 250 3512.66 299.844 3562.5 382.656L3442.5 451.875C3417.66 404.219 3369.38 375 3305 375C3210.16 375 3148.75 437.5 3148.75 531.25ZM4437.5 78.125V796.875H4296.88V78.125H4437.5ZM3906.25 250C3733.75 250 3609.38 362.5 3609.38 531.25C3609.38 700 3749.38 812.5 3921.88 812.5C4026.09 812.5 4117.97 771.25 4174.84 701.719L4055.31 632.656C4023.75 667.188 3975.78 687.344 3921.88 687.344C3847.03 687.344 3783.44 648.281 3759.84 585.781H4197.66C4201.09 568.281 4203.12 550.156 4203.12 531.094C4203.12 362.5 4078.91 250 3906.25 250ZM3758.59 476.562C3778.13 414.219 3831.41 375 3906.25 375C3981.09 375 4034.53 414.219 4053.91 476.562H3758.59ZM2961.25 265.625V417.031C2945.63 412.5 2929.06 409.375 2911.25 409.375C2820.47 409.375 2755 471.875 2755 565.625V796.875H2614.38V265.625H2755V409.375C2755 330 2847.34 265.625 2961.25 265.625Z"
              fill="currentColor"
            />
          </svg>
        </a>
        <a
          href="https://www.gitpod.io/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Gitpod"
          className="grayscale-[80%] opacity-80 hover:grayscale-0 hover:opacity-100 transition-all"
        >
          <Gitpod />
        </a>
        <a
          href="https://www.browserstack.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginBottom: -2 }}
          aria-label="BrowserStack"
          className="grayscale-[80%] opacity-80 hover:grayscale-0 hover:opacity-100 transition-all"
        >
          <BrowserStack />
        </a>
      </div>
    </footer>
  )
}

function Gitpod() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="1.4em"
      fill="none"
      className="inline-block"
      viewBox="0 0 398 120"
    >
      <path
        fill="currentColor"
        d="M170.253 92.889C152.612 92.889 140 79.97 140 62.944 140 45.92 152.698 33 169.997 33c8.522 0 15.169 3.337 20.708 8.213l-3.494 7.273c-4.26-4.278-9.715-7.786-17.555-7.786-12.783 0-21.986 8.983-21.986 22.244 0 13.262 9.118 22.245 22.072 22.245 11.163 0 19.089-6.759 20.367-17.026h-22.754v-7.7h31.446v.343c0 18.822-10.567 32.083-28.548 32.083zM206.802 50.111h7.329V92.89h-7.329V50.11zM248.843 92.29v-6.502c-2.301.428-4.176.684-6.903.684-3.579 0-4.857-1.882-4.857-5.133V56.528h11.675V50.11h-11.675V38.647h-7.329V50.11h-8.437v6.417h8.437V80.91c0 9.069 4.005 12.406 11.76 12.406 2.727 0 5.113-.428 7.329-1.027z"
      ></path>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M263.78 110h-7.329V50.111h7.329v6.16c3.494-4.705 8.693-7.187 14.999-7.187 12.101 0 20.538 9.24 20.538 22.416 0 13.175-8.437 22.416-20.538 22.416-6.051 0-10.993-2.396-14.999-7.273V110zm-.511-38.5c0 9.497 5.624 15.571 14.232 15.571 8.607 0 14.231-6.16 14.231-15.571s-5.624-15.571-14.231-15.571c-8.608 0-14.232 6.074-14.232 15.571zM303.879 71.5c0 12.833 9.545 22.416 22.328 22.416s22.327-9.583 22.327-22.416-9.544-22.416-22.327-22.416c-12.783 0-22.328 9.583-22.328 22.416zm37.071 0c0 8.898-5.88 15.314-14.743 15.314s-14.743-6.416-14.743-15.314 5.88-15.314 14.743-15.314S340.95 62.602 340.95 71.5zM388.671 33H396v59.889h-7.329v-6.16c-3.494 4.705-8.692 7.187-14.998 7.187-12.102 0-20.538-9.24-20.538-22.416s8.436-22.416 20.538-22.416c6.05 0 10.993 2.396 14.998 7.273V33zm.511 38.5c0-9.497-5.624-15.571-14.231-15.571s-14.232 6.16-14.232 15.571 5.625 15.571 14.232 15.571 14.231-6.074 14.231-15.571z"
        clipRule="evenodd"
      ></path>
      <path
        fill="currentColor"
        d="M210.483 44.49a5.245 5.245 0 100-10.491 5.245 5.245 0 000 10.49z"
      ></path>
      <path
        fill="url(#paint0_linear)"
        fillRule="evenodd"
        d="M64.758 5.976c3.237 5.685 1.27 12.928-4.396 16.177L25.137 42.352a3 3 0 00-1.508 2.602v31.719a3 3 0 001.508 2.602l27.87 15.982a3 3 0 002.985 0l27.871-15.982a3 3 0 001.508-2.602V56.947L60.306 71.14c-5.683 3.217-12.89 1.203-16.096-4.5-3.206-5.703-1.199-12.935 4.484-16.153L84.56 30.18C95.483 23.995 109 31.916 109 44.505v34.572A22.58 22.58 0 0197.67 98.67l-32.014 18.358a22.418 22.418 0 01-22.312 0L11.33 98.669A22.58 22.58 0 010 79.076V42.551a22.58 22.58 0 0111.33-19.593L48.638 1.565c5.666-3.249 12.883-1.273 16.12 4.412z"
        clipRule="evenodd"
      ></path>
      <defs>
        <linearGradient
          id="paint0_linear"
          x1="82.04"
          x2="25.812"
          y1="18.146"
          y2="106.234"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFB45B"></stop>
          <stop offset="1" stopColor="#FF8A00"></stop>
        </linearGradient>
      </defs>
    </svg>
  )
}

function BrowserStack() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="1.6em"
      className="inline-block"
      viewBox="0 0 490 106"
    >
      <defs>
        <radialGradient
          id="radialGradient-1"
          cx="49.866%"
          cy="49.946%"
          r="49.919%"
          fx="49.866%"
          fy="49.946%"
        >
          <stop offset="0%" stopColor="#797979"></stop>
          <stop offset="100%" stopColor="#4C4C4C"></stop>
        </radialGradient>
      </defs>
      <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
        <g fillRule="nonzero">
          <circle cx="52.8" cy="52.8" r="52.8" fill="#F4B960"></circle>
          <circle cx="47.5" cy="47.5" r="47.5" fill="#E66F32"></circle>
          <circle cx="53.8" cy="41.1" r="41.1" fill="#E43C41"></circle>
          <circle cx="57.1" cy="44.4" r="37.8" fill="#BDD041"></circle>
          <circle cx="54.3" cy="47.2" r="35.1" fill="#6DB54C"></circle>
          <circle cx="48.8" cy="41.7" r="29.5" fill="#AEDAE6"></circle>
          <circle cx="53.6" cy="36.8" r="24.7" fill="#56B8DE"></circle>
          <circle cx="56.6" cy="39.9" r="21.7" fill="#00B1D5"></circle>
          <circle
            cx="53.5"
            cy="43"
            r="18.6"
            fill="url(#radialGradient-1)"
          ></circle>
          <circle cx="53.5" cy="43" r="18.6" fill="#221F1F"></circle>
          <ellipse
            cx="60.849"
            cy="36.186"
            fill="#FFF"
            rx="5.7"
            ry="3.7"
            transform="rotate(-65.832 60.849 36.186)"
          ></ellipse>
          <path
            fill="currentColor"
            d="M122.5 32.6c0-.3.3-.6.6-.6H139.8c9.5 0 13.9 4.4 13.9 11 .2 3.7-1.8 7.2-5.2 8.8v.1c3.7 1.5 6.1 5.2 6 9.3 0 8.2-5.6 12.2-15.4 12.2h-16c-.3 0-.6-.2-.7-.5v-.1l.1-40.2zm17.1 16.5c3.9 0 6.4-2.2 6.4-5.4s-2.4-5.5-6.4-5.5h-8.9c-.2 0-.4.1-.4.3V48.8c0 .2.1.3.3.4h9v-.1zm-9 17.8h9.3c4.3 0 6.8-2.3 6.8-5.8s-2.4-5.7-6.7-5.7h-9.3c-.2 0-.4.1-.4.3V66.5c0 .3.1.4.3.4z"
          ></path>
          <path
            fill="currentColor"
            d="M159.9 73.3c-.3 0-.6-.2-.7-.5V44.6c0-.3.3-.6.6-.6h6.1c.3 0 .6.2.7.5v2.6h.1c1.5-2.2 4.2-3.8 8.2-3.8 2.4 0 4.8.8 6.6 2.4.3.3.4.5.1.8l-3.5 4.1c-.2.3-.6.4-.9.2h-.1c-1.4-.9-3-1.4-4.7-1.4-4.1 0-6 2.7-6 7.4v15.9c0 .3-.3.6-.6.6H159.9z"
          ></path>
          <path
            fill="currentColor"
            d="M182.9 65.8c-.8-2.3-1.1-4.8-1.1-7.2-.1-2.5.3-4.9 1.1-7.2 1.8-5.1 6.6-8.1 13.1-8.1s11.2 3 13 8.1c.8 2.3 1.1 4.8 1.1 7.2.1 2.5-.3 4.9-1.1 7.2-1.8 5.1-6.6 8.1-13 8.1s-11.3-2.9-13.1-8.1zm19-1.8c.5-1.7.8-3.6.7-5.4.1-1.8-.1-3.7-.7-5.4-.9-2.5-3.3-4-5.9-3.8-2.6-.2-5.1 1.4-6 3.8-.5 1.8-.8 3.6-.7 5.4-.1 1.8.1 3.7.7 5.4.9 2.5 3.4 4 6 3.8 2.6.2 5-1.3 5.9-3.8z"
          ></path>
          <path
            fill="currentColor"
            d="M241.9 73.3c-.4 0-.7-.3-.8-.6L235 53.9h-.1l-6.2 18.7c-.1.4-.4.6-.8.6h-5.4c-.4 0-.7-.3-.8-.6l-10-28.1c-.1-.2 0-.5.2-.6.1 0 .2-.1.3 0h6.3c.4 0 .8.2.9.6l6.1 19.3h.1l6-19.3c.1-.4.5-.6.9-.6h4.7c.4 0 .7.2.9.6l6.4 19.3h.1l5.8-19.3c.1-.4.5-.7.9-.6h6.3c.2-.1.5.1.5.3v.3l-10 28.1c-.1.4-.4.6-.8.6l-5.4.1zM259.3 69.3c-.2-.2-.3-.6-.1-.8l.1-.1 3.7-3.6c.3-.2.7-.2.9 0 2.6 2.1 5.9 3.3 9.3 3.3 3.9 0 5.9-1.5 5.9-3.5 0-1.8-1.1-2.9-5.2-3.2l-3.4-.3c-6.4-.6-9.7-3.6-9.7-8.6 0-5.7 4.4-9.2 12.3-9.2 4.2-.1 8.4 1.2 11.9 3.6.3.2.3.5.2.8v.1l-3.2 3.6c-.2.3-.6.3-.9.1-2.5-1.5-5.4-2.4-8.3-2.4-3.1 0-4.8 1.3-4.8 3s1.1 2.7 5.2 3.1l3.4.3c6.6.6 9.8 3.8 9.8 8.6 0 5.8-4.6 9.9-13.3 9.9-5.1 0-9.9-1.6-13.8-4.7z"
          ></path>
          <path
            fill="currentColor"
            d="M291.2 65.8c-.8-2.3-1.2-4.7-1.1-7.2-.1-2.5.3-4.9 1-7.2 1.8-5.1 6.6-8.1 12.9-8.1 6.5 0 11.2 3.1 13 8.1.7 2.1 1 4.1 1 8.8 0 .3-.3.6-.6.6h-19.6c-.2 0-.4.1-.4.3v.1c0 .8.2 1.5.5 2.2 1 2.9 3.5 4.4 7.1 4.4 2.7.1 5.4-.9 7.4-2.8.2-.3.7-.4 1-.1l3.9 3.2c.2.1.3.5.2.7 0 .1-.1.1-.1.1-2.7 2.9-7.2 5-13 5-6.6 0-11.4-3-13.2-8.1zm19.2-13c-.9-2.4-3.2-3.8-6.2-3.8s-5.4 1.4-6.2 3.8c-.3.8-.4 1.6-.4 2.5 0 .2.1.3.3.4h12.5c.2 0 .4-.1.4-.3v-.1c0-.8-.2-1.7-.4-2.5z"
          ></path>
          <path
            fill="currentColor"
            d="M323.6 73.3c-.3 0-.6-.2-.7-.5V44.6c0-.3.3-.6.6-.6h6.1c.3 0 .6.2.7.5v2.6h.1c1.5-2.2 4.2-3.8 8.2-3.8 2.4 0 4.8.8 6.6 2.4.3.3.4.5.1.8l-3.5 4.1c-.2.3-.6.4-.9.2h-.1c-1.4-.9-3-1.4-4.7-1.4-4.1 0-6 2.7-6 7.4v15.9c0 .3-.3.6-.6.6H323.6zM346.5 68.5c-.3-.2-.4-.6-.2-.9l4.1-4.4c.2-.3.6-.3.9-.1 3.5 2.7 7.7 4.2 12.1 4.4 5.3 0 8.4-2.5 8.4-6 0-3-2-4.9-8.1-5.7l-2.4-.3c-8.6-1.1-13.5-4.9-13.5-11.8 0-7.5 5.9-12.4 15.1-12.4 5.1-.1 10.1 1.4 14.5 4.2.3.1.4.4.2.7 0 .1-.1.1-.1.2l-3.1 4.5c-.2.3-.6.4-.9.2-3.2-2.1-6.9-3.2-10.7-3.2-4.5 0-7 2.3-7 5.5 0 2.9 2.2 4.8 8.2 5.6l2.4.3c8.6 1.1 13.3 4.9 13.3 12 0 7.3-5.7 12.8-16.8 12.8-6.6-.2-12.9-2.6-16.4-5.6zM393.3 73.8c-6.4 0-8.8-2.9-8.8-8.6V49.8c0-.2-.1-.3-.3-.4H382c-.3 0-.6-.2-.7-.5V44.7c0-.3.3-.6.6-.6h2.2c.2 0 .4-.1.4-.3v-8.1c0-.3.3-.6.6-.6h6.1c.3 0 .6.2.7.5v8.1c0 .2.1.3.3.4h4.3c.3 0 .6.2.7.5V48.8c0 .3-.3.6-.6.6h-4.3c-.2 0-.4.1-.4.3V65c0 2.1.9 2.7 3 2.7h1.6c.3 0 .6.2.7.5v5c0 .3-.3.6-.6.6H393.3z"
          ></path>
          <path
            fill="currentColor"
            d="M421.2 73.3c-.3 0-.6-.2-.7-.5v-2.2c-1.5 2-4.5 3.4-8.9 3.4-5.8 0-10.6-2.8-10.6-8.9 0-6.4 4.9-9.3 12.7-9.3h6.4c.2 0 .4-.1.4-.3V54c0-3.3-1.7-4.9-7-4.9-2.6-.1-5.1.6-7.2 2-.3.2-.7.2-.9-.1v-.1l-2.4-4c-.2-.2-.1-.6.1-.8 2.6-1.7 6-2.9 11.2-2.9 9.6 0 13.2 3 13.2 10.2v19.1c0 .3-.3.6-.6.6H421.2v.2zm-.8-9.9v-2.2c0-.2-.1-.3-.3-.4h-5.3c-4.7 0-6.8 1.2-6.8 3.9 0 2.4 1.9 3.6 5.5 3.6 4.4.1 6.9-1.5 6.9-4.9z"
          ></path>
          <path
            fill="currentColor"
            d="M433.1 65.8c-.7-2.3-1.1-4.8-1-7.2-.1-2.4.3-4.9 1-7.2 1.8-5.2 6.7-8.1 13.1-8.1 4.2-.2 8.2 1.5 11 4.6.2.2.2.6 0 .8l-.1.1-4.1 3.3c-.3.2-.7.2-.9-.1v-.1c-1.5-1.7-3.6-2.6-5.9-2.5-2.8 0-5 1.3-5.9 3.8-.5 1.8-.8 3.6-.7 5.4-.1 1.8.1 3.7.7 5.5.9 2.5 3.1 3.8 5.9 3.8 2.2.1 4.4-.9 5.9-2.6.2-.3.6-.3.9-.1l4.1 3.3c.3.2.3.5.1.8l-.1.1c-2.9 3-6.9 4.6-11 4.5-6.3 0-11.1-2.8-13-8.1zM482.8 73.3c-.4 0-.8-.2-1-.6l-8-12.3-4.3 4.6v7.7c0 .3-.3.6-.6.6h-6.1c-.3 0-.6-.2-.7-.5V32.6c0-.3.3-.6.6-.6h6.1c.3 0 .6.2.7.5V56.4l10.8-11.8c.3-.4.8-.6 1.2-.6h6.7c.2 0 .4.1.4.3 0 .1 0 .3-.1.3l-10.1 10.7L490 72.7c.1.2.1.4 0 .5-.1.1-.2.1-.3.1h-6.9z"
          ></path>
        </g>
      </g>
    </svg>
  )
}

const latestSponsorsQuery = `query {
  organization(login: "code-hike") {
    sponsorshipsAsMaintainer(first: 50, orderBy: {field: CREATED_AT, direction: DESC}, activeOnly: false) {
      edges {
        node {
          createdAt
          privacyLevel
          tier {
            name
            monthlyPriceInDollars
          }
          sponsorEntity {
            ... on User {
              login
              name
              avatarUrl
              websiteUrl
              location
            }
            ... on Organization {
              login
              name
              avatarUrl
              websiteUrl
              location
            }
          }
        }
      }
    }
  }
}
`
