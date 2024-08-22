"use client"
import { usePathname } from "next/navigation"
import { Nav } from "next-docs-ui/nav"
import { GithubIcon, TwitterIcon } from "lucide-react"
import { cn } from "../lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
          href: "https://twitter.com/codehike_",
          label: "Twitter",
          icon: <TwitterIcon className="h-5 w-5" />,
          external: true,
        },
        {
          href: "https://github.com/code-hike/codehike",
          label: "Github",
          icon: <GithubIcon className="h-5 w-5" />,
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
      <DropdownMenuTrigger className="text-sm bg-yellow-200 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-200 rounded-lg px-2">
        {version}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className="p-0">
          <span className="w-full px-2 py-1">{version}</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="p-0">
          <a href="https://v0.codehike.org/docs" className="w-full px-2 py-1">
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
