import Link from "next/link"
import Head from "next/head"
import React from "react"

const extraItems = ["themes"]

export function Layout({
  children,
  current,
  contentFileNames,
  style = {},
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: 8,
        margin: "8px",
      }}
    >
      <Head>
        <title>{`Code Hike Test - ${current}`}</title>
      </Head>
      <Sidebar
        contentFileNames={contentFileNames}
        current={current}
      />

      <div
        style={{
          maxWidth: 900,
          minWidth: 600,
          background: "#fafafa",
          borderRadius: 4,
          padding: 16,
          position: "relative",
          ...style,
        }}
      >
        {children}
      </div>
    </div>
  )
}

function Sidebar({ contentFileNames, current }) {
  const items = contentFileNames.concat(extraItems)
  return (
    <nav
      style={{
        background: "#fafafa",
        borderRadius: 4,
        padding: "16px 0",
        minWidth: 180,
      }}
    >
      <ul style={{ margin: 0, padding: 0 }}>
        {items.map(item => (
          <li
            key={item}
            style={{ listStyle: "none" }}
            className="sidebar-link"
            data-active={item === current}
          >
            <Link href={`/${encodeURIComponent(item)}`}>
              {item}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
