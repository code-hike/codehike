"use client"
import { usePathname } from "next/navigation"

export default function NotFound() {
  const pathname = usePathname()
  const v0url = "v0.codehike.org" + pathname
  return (
    <main className="w-full h-[80vh] flex flex-col gap-2 justify-center items-center">
      <h2 className="text-6xl mb-8">Page not found.</h2>
      <p>
        For older versions try:{" "}
        <a href={"https://" + v0url} className="text-primary underline">
          {v0url}
        </a>
      </p>
    </main>
  )
}
