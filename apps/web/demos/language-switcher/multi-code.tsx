"use client"

import { HighlightedCode, Pre, RawCode, highlight } from "codehike/code"

import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { tokenTransitions } from "@/components/annotations/token-transitions"

export function Code({ highlighted }: { highlighted: HighlightedCode[] }) {
  const [selectedLang, setSelectedLang] = useState(highlighted[0].lang)
  const selectedCode = highlighted.find((code) => code.lang === selectedLang)!

  return (
    <div className="relative">
      <Pre
        className="m-0 pt-6 px-4 bg-zinc-950/80"
        code={selectedCode}
        handlers={[tokenTransitions]}
      />
      <div className="absolute top-2 right-2">
        <Select
          defaultValue={selectedLang}
          value={selectedLang}
          onValueChange={setSelectedLang}
        >
          <SelectTrigger className="!bg-transparent border-none h-6 !p-2 gap-2 text-slate-300 !ring-zinc-300/50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="item-aligned">
            {highlighted.map(({ lang }, index) => (
              <SelectItem key={index} value={lang}>
                {lang}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
