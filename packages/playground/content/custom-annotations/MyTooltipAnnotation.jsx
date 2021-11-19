export function MyTooltipAnnotation({
  children,
  data,
  theme,
}) {
  const border =
    typeof data === "string"
      ? data
      : theme.tokenColors.find(tc =>
          tc.scope?.includes("string")
        )?.settings?.foreground || "yellow"
  return (
    <span style={{ outline: `2px solid ${border}` }}>
      {children}
    </span>
  )
}
