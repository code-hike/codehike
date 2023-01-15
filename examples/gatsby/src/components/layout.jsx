import React from "react"

export const Layout = ({ children }) => {
  return (
    <div style={{ width: 768, margin: "0 auto", fontFamily: "sans-serif" }}>
      <main>{children}</main>
    </div>
  )
}
