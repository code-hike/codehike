"use client"

export function TimeAgo({ date }: { date: string }) {
  const time = new Date(date)
  return (
    <time dateTime={time.toString()} title={time.toString()}>
      {getTimeAgo(time)}
    </time>
  )
}

const MINUTE = 60
const HOUR = MINUTE * 60
const DAY = HOUR * 24
const WEEK = DAY * 7
const MONTH = DAY * 30
const YEAR = DAY * 365

function getTimeAgo(date: Date) {
  const secondsAgo = Math.round((Date.now() - Number(date)) / 1000)

  if (secondsAgo < MINUTE) {
    return secondsAgo + ` second${secondsAgo !== 1 ? "s" : ""} ago`
  }

  let divisor
  let unit = ""

  if (secondsAgo < HOUR) {
    ;[divisor, unit] = [MINUTE, "minute"]
  } else if (secondsAgo < DAY) {
    ;[divisor, unit] = [HOUR, "hour"]
  } else if (secondsAgo < WEEK) {
    ;[divisor, unit] = [DAY, "day"]
  } else if (secondsAgo < MONTH) {
    ;[divisor, unit] = [WEEK, "week"]
  } else if (secondsAgo < YEAR) {
    ;[divisor, unit] = [MONTH, "month"]
  } else {
    ;[divisor, unit] = [YEAR, "year"]
  }

  const count = Math.floor(secondsAgo / divisor)
  return `${count} ${unit}${count > 1 ? "s" : ""} ago`
}
