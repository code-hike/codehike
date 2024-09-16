"use client"
import { usePathname } from "next/navigation"
import { Nav } from "next-docs-ui/nav"
import { cn } from "../lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function NavBar({ version }: { version: string }) {
  const pathname = usePathname()
  return (
    <Nav
      title={
        <span className="flex">
          <CodeHikeLogo /> Code Hike
        </span>
      }
      enableSidebar={pathname === "/docs" || pathname.startsWith("/docs/")}
      collapsibleSidebar={true}
      links={[
        {
          href: "https://discord.gg/zYJMDBANkj",
          label: "Discord",
          icon: <DiscordIcon className="h-5 w-5" />,
          external: true,
        },
        {
          href: "https://twitter.com/codehike_",
          label: "Twitter",
          icon: <TwitterIcon className="h-5 w-5" />,
          external: true,
        },
        {
          href: "https://github.com/code-hike/codehike",
          label: "GitHub",
          icon: <GitHubIcon className="h-5 w-5" />,
          external: true,
        },
      ]}
      items={[
        {
          url: "/docs",
          text: "Docs",
        },
        {
          url: "/blog",
          text: "Blog",
        },
        // {
        //   url: "/play",
        //   text: "Playground",
        // },
      ]}
    >
      <VersionNav version={version} />
    </Nav>
  )
}

function VersionNav({ version }: { version: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="text-sm bg-secondary text-primary rounded-lg px-2 tabular-nums">
        {version}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[5rem]">
        <DropdownMenuItem className="p-0 text-center">
          <span className="w-full px-2 py-1 tabular-nums">{version}</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="p-0 text-center">
          <a
            href="https://v0.codehike.org/docs"
            className="w-full px-2 py-1 tabular-nums"
          >
            0.9.0
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function CodeHikeLogo({ className }: { className?: string }) {
  return (
    <svg
      fill="currentColor"
      className={cn("block h-6 w-6 mr-2", className)}
      viewBox="-100 -100 200 200"
    >
      <path d="M70 60L42-27h30l28 87z"></path>
      <path d="M20.42 40.054L42-27h30L50.42 40.054z"></path>
      <path d="M20.42 40.054L-15-70h30L50.42 40.054z"></path>
      <path d="M-50.42 40.054L-15-70h30L-20.42 40.054z"></path>
      <path d="M-50.42 40.054L-72-27h30l21.58 67.054z"></path>
      <path d="M-100 60l28-87h30l-28 87z"></path>
    </svg>
  )
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
      />
    </svg>
  )
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width={24}
      height={24}
      preserveAspectRatio="xMidYMid meet"
      viewBox="0 0 24 24"
      className={className}
    >
      <path
        d="M22.162 5.656a8.384 8.384 0 0 1-2.402.658A4.196 4.196 0 0 0 21.6 4c-.82.488-1.719.83-2.656 1.015a4.182 4.182 0 0 0-7.126 3.814a11.874 11.874 0 0 1-8.62-4.37a4.168 4.168 0 0 0-.566 2.103c0 1.45.738 2.731 1.86 3.481a4.168 4.168 0 0 1-1.894-.523v.052a4.185 4.185 0 0 0 3.355 4.101a4.21 4.21 0 0 1-1.89.072A4.185 4.185 0 0 0 7.97 16.65a8.394 8.394 0 0 1-6.191 1.732a11.83 11.83 0 0 0 6.41 1.88c7.693 0 11.9-6.373 11.9-11.9c0-.18-.005-.362-.013-.54a8.496 8.496 0 0 0 2.087-2.165z"
        fill="currentColor"
      />
    </svg>
  )
}

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 71 55"
      fill="currentColor"
      className={className}
    >
      <g clipPath="url(#clip0)">
        <path d="M60.105 4.898A58.55 58.55 0 0045.653.415a.22.22 0 00-.233.11 40.784 40.784 0 00-1.8 3.697c-5.456-.817-10.886-.817-16.23 0-.485-1.164-1.201-2.587-1.828-3.697a.228.228 0 00-.233-.11 58.386 58.386 0 00-14.451 4.483.207.207 0 00-.095.082C1.578 18.73-.944 32.144.293 45.39a.244.244 0 00.093.167c6.073 4.46 11.955 7.167 17.729 8.962a.23.23 0 00.249-.082 42.08 42.08 0 003.627-5.9.225.225 0 00-.123-.312 38.772 38.772 0 01-5.539-2.64.228.228 0 01-.022-.378c.372-.279.744-.569 1.1-.862a.22.22 0 01.23-.03c11.619 5.304 24.198 5.304 35.68 0a.219.219 0 01.233.027c.356.293.728.586 1.103.865a.228.228 0 01-.02.378 36.384 36.384 0 01-5.54 2.637.227.227 0 00-.121.315 47.249 47.249 0 003.624 5.897.225.225 0 00.249.084c5.801-1.794 11.684-4.502 17.757-8.961a.228.228 0 00.092-.164c1.48-15.315-2.48-28.618-10.497-40.412a.18.18 0 00-.093-.084zm-36.38 32.427c-3.497 0-6.38-3.211-6.38-7.156 0-3.944 2.827-7.156 6.38-7.156 3.583 0 6.438 3.24 6.382 7.156 0 3.945-2.827 7.156-6.381 7.156zm23.593 0c-3.498 0-6.38-3.211-6.38-7.156 0-3.944 2.826-7.156 6.38-7.156 3.582 0 6.437 3.24 6.38 7.156 0 3.945-2.798 7.156-6.38 7.156z"></path>
      </g>
      <defs>
        <clipPath id="clip0">
          <path d="M0 0H71V55H0z"></path>
        </clipPath>
      </defs>
    </svg>
  )
}
