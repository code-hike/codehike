export type Theme = string

type Color = string
export type Token = [string, Color?, React.CSSProperties?]
export type Whitespace = string
export type Tokens = (Token | Whitespace)[]

type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

export type BlockAnnotation = {
  /** Annotation name */
  name: string
  /** String metadata */
  query: string
  /** Line number where the annotation block starts */
  fromLineNumber: number
  /** Line number (inclusive) where the annotation block ends  */
  toLineNumber: number
  /** Optional data */
  data?: any
}

export type InlineAnnotation = {
  /** Annotation name */
  name: string
  /** String metadata */
  query: string
  /** Line number  */
  lineNumber: number
  /** Column number where the annotation starts */
  fromColumn: number
  /** Column number (inclusive) where the annotation ends */
  toColumn: number
  /** Optional data */
  data?: any
}

export type CodeAnnotation = BlockAnnotation | InlineAnnotation

export function isBlockAnnotation(
  annotation: CodeAnnotation,
): annotation is BlockAnnotation {
  return !isInlineAnnotation(annotation)
}

export function isInlineAnnotation(
  annotation: CodeAnnotation,
): annotation is InlineAnnotation {
  return annotation.hasOwnProperty("lineNumber")
}

export function isWhitespace(token: Token | Whitespace): token is Whitespace {
  return typeof token === "string"
}

/**
 * Represents the basic structure for code data.
 */
export type RawCode = {
  /** This is the raw code. May include annotation comments. */
  value: string

  /** The programming language. */
  lang: string

  /** Metadata string (the content after the language name in a markdown codeblock). */
  meta: string
}

/**
 * Represents detailed information about a piece of code, including its tokens and annotations.
 */
export type HighlightedCode = {
  /** This is the raw code. May include annotation comments. */
  value: string

  /** The code with annotation comments removed. */
  code: string

  /** A list of code annotations. */
  annotations: CodeAnnotation[]

  /** The list of highlighted tokens. Whitespace tokens include newline characters. */
  tokens: (Token | Whitespace)[]

  /** The normalized (for example: py becomes python) language used for highlighting. */
  lang: string

  /** Metadata string */
  meta: string

  /** The name of the theme used for highlighting. */
  themeName: string

  /** The style object for the highlighted code. */
  style: React.CSSProperties
}

export type BlockAnnotationComponent = React.ComponentType<{
  annotation: BlockAnnotation
  children: React.ReactNode
}>

export type InlineAnnotationComponent = React.ComponentType<{
  annotation: InlineAnnotation
  children: React.ReactNode
}>

export type InlineProps = React.HTMLAttributes<HTMLElement> & {
  code: HighlightedCode
}

export type PreProps = React.HTMLAttributes<HTMLPreElement> & {
  code: HighlightedCode
  handlers?: AnnotationHandler[]
}
export type PreComponent = React.ForwardRefExoticComponent<
  PreProps & React.RefAttributes<HTMLPreElement>
>

export type InternalToken = {
  value: string
  style?: React.CSSProperties
  range: [number, number]
}

// Pre
export type CustomPreProps = React.ComponentProps<"pre"> & {
  data?: Record<string, any>
  _stack: React.ComponentType<CustomPreProps>[]
  _ref: React.RefObject<HTMLPreElement>
}
export type CustomPre = React.ComponentType<CustomPreProps>

// Line
export type CustomLineProps = React.ComponentProps<"div"> & {
  lineNumber: number
  totalLines: number
  indentation: number
  annotation?: BlockAnnotation
  data?: Record<string, any>
  _stack: {
    Component: CustomLine | CustomLineWithAnnotation
    annotation?: BlockAnnotation
  }[]
}
export type CustomLine = React.ComponentType<CustomLineProps>
export type CustomLineWithAnnotation = React.ComponentType<
  CustomLineProps & {
    annotation: BlockAnnotation
  }
>

// Token
export type CustomTokenProps = React.ComponentProps<"span"> & {
  value: string
  style?: React.CSSProperties
  data?: Record<string, any>
  annotation?: BlockAnnotation | InlineAnnotation
  _stack: {
    Component: CustomToken | CustomTokenWithAnnotation
    annotation?: BlockAnnotation | InlineAnnotation
  }[]
}
export type CustomToken = React.ComponentType<CustomTokenProps>
export type CustomTokenWithAnnotation = React.ComponentType<
  CustomTokenProps & { annotation: BlockAnnotation | InlineAnnotation }
>

type AnnotationTransformer<T> = (
  annotation: T,
) => undefined | CodeAnnotation | CodeAnnotation[]

export type AnnotationHandler = {
  /** Name of the annotation */
  name: string
  /** The Pre, Line and Token components are only used if there's at least one annotation in the whole codeblock */
  onlyIfAnnotated?: boolean
  /** Transform an annotation into one or more annotations */
  transform?:
    | AnnotationTransformer<InlineAnnotation>
    | AnnotationTransformer<BlockAnnotation>
    | AnnotationTransformer<CodeAnnotation>
  /** Customize the pre element */
  Pre?: CustomPre
  /** Customize the pre element and use the ref to the DOM element */
  PreWithRef?: CustomPre
  /** Wrap an annotated block */
  Block?: BlockAnnotationComponent
  /** Customize how to render a line */
  Line?: CustomLine
  /** Customize how to render a line targeted by the annotation */
  AnnotatedLine?: CustomLineWithAnnotation
  /** Wrap an annotated part of a line */
  Inline?: InlineAnnotationComponent
  /** Customize how to render a token */
  Token?: CustomToken
  /** Customize how to render a token targeted by the annotation */
  AnnotatedToken?: CustomTokenWithAnnotation
}
