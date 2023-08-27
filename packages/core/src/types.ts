import { Lines, Token, Tokens } from "@code-hike/lighter"

// highlight.js transforms Lines to TokenOrGroup[]

export type TokenGroup = {
  name: string
  query?: string
  inline: boolean
  tokens: TokenOrGroup[]
}
export type TokenOrGroup = Token | TokenGroup

// differ.js transforms TokenOrGroup[] to TokenWithId[]

export type TokenWithId = {
  id: number
  content: string
  style: React.CSSProperties
  deleted?: boolean
}

export type TokenWithIdOrGroup =
  | TokenWithId
  | TokenWithIdGroup
  | WhitespaceToken

export type WhitespaceToken = {
  content: string
  style: undefined
}

export type TokenWithIdGroup = {
  name: string
  query?: string
  inline: boolean
  tokens: TokenWithIdOrGroup[]
}
