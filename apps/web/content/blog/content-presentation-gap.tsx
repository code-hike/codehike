"use client"

import { useEffect, useRef, useState } from "react"

export function Demo() {
  return (
    <div className="border">
      <Scrollytelling
        steps={[
          {
            content: (
              <div>
                <h1>Augustus</h1>
                <p>
                  Augustus was the first Roman emperor, reigning from 27 BC
                  until his death in AD 14.
                </p>
              </div>
            ),
            sticker: (
              <img src="/blog/build-time-components.png" alt="Augustus" />
            ),
          },
          {
            content: (
              <div>
                <h1>Nero</h1>
                <p>
                  Nero was the last Roman emperor of the Julio-Claudian dynasty.
                </p>
              </div>
            ),
            sticker: <img src="/blog/v1.png" alt="Nero" />,
          },
          {
            content: (
              <div>
                <h1>Trajan</h1>
                <p>Trajan was Roman emperor from 98 to 117.</p>
              </div>
            ),
            sticker: <img src="/blog/fine-grained-markdown.png" alt="Trajan" />,
          },
        ]}
      />
    </div>
  )
}

type Props = {
  steps: {
    content: React.ReactNode
    sticker: React.ReactNode
  }[]
}
function Scrollytelling({ steps }: Props) {
  const [currentStep, setCurrentStep] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCurrentStep(parseInt(entry.target.id))
        }
      },
      {
        rootMargin: "-48% 0px",
        threshold: 0.01,
        root: ref.current,
      },
    )

    steps.forEach((_, i) => {
      observer.observe(document.getElementById(i.toString())!)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="flex max-h-64 overflow-auto relative p-4">
      <div>
        {steps.map((step, i) => (
          <div
            key={i}
            id={i.toString()}
            style={{ opacity: i === currentStep ? 1 : 0.2 }}
          >
            {step.content}
          </div>
        ))}
        <div style={{ height: 48 }} />
      </div>
      <div style={{ position: "sticky", top: 0 }}>
        {steps[currentStep].sticker}
      </div>
    </div>
  )
}
