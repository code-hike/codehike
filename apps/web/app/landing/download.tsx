"use client"
import * as htmlToImage from "html-to-image"

export function Download({ selector }: { selector: string }) {
  const onClick = async () => {
    const nodes = document.querySelectorAll(selector) as any
    for (const node of nodes) {
      const dataUrl = await htmlToImage.toPng(node as HTMLElement)
      var img = new Image()
      img.src = dataUrl
      document.getElementById("out")!.appendChild(img)
    }
  }
  return (
    <div>
      <button onClick={onClick}>As PNG</button>
      <div id="out" className="min-w-6 min-h-6 border"></div>
    </div>
  )
}
