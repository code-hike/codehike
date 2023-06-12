import unistVisit from "unist-util-visit"

export interface Data {
  [key: string]: unknown
}

interface GenericNode<TData extends object = Data> {
  /**
   * The variant of a node.
   */
  type: string

  /**
   * Information from the ecosystem.
   */
  data?: TData | undefined
  /**
   * List representing the children of a node.
   */
  children?: SuperNode[]
}

export interface BasicNode<TData extends object = Data>
  extends GenericNode<TData> {
  type: "thematicBreak" | "definition" | "link"
}

export interface CodeNode<TData extends object = Data>
  extends GenericNode<TData> {
  type: "code"
  lang: string | undefined
  value: string
  meta: string | undefined
}

export interface JsxNode<TData extends object = Data>
  extends GenericNode<TData> {
  type: "mdxJsxFlowElement" | "mdxJsxTextElement"
  /**
   * Component name (undefined for React.Fragment)
   */
  name?: string
  attributes?: JsxAttribute[]
}

type JsxAttribute = {
  name: string
  value: "string" | any
  type?: string
}

export interface EsmNode<TData extends object = Data>
  extends GenericNode<TData> {
  type: "mdxjsEsm"
  value: string | undefined
}

export type SuperNode<TData extends object = Data> =
  | BasicNode<TData>
  | JsxNode<TData>
  | EsmNode<TData>
  | CodeNode<TData>

export function visit(
  tree: SuperNode,
  type: string | string[],
  visitor: (
    node: SuperNode,
    index: number,
    parent: SuperNode | undefined
  ) => void
) {
  unistVisit(tree as any, type as any, visitor as any)
}
