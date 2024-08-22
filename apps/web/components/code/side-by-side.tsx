export function SideBySide(props: React.HTMLProps<HTMLDivElement>) {
  return (
    <div
      className="flex gap-2 items-stretch w-full flex-wrap [&>*]:flex-1 [&>*]:min-w-72"
      {...props}
    />
  )
}
