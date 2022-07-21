export type CodeHikeConfig = {
  theme: any
  lineNumbers?: boolean
  autoImport?: boolean
  skipLanguages: string[]
  showExpandButton?: boolean
  showCopyButton?: boolean
  staticMediaQuery?: string
  // path to the current file, internal use only
  filepath?: string
}

/**
 * Add defaults and normalize config
 */
export function addConfigDefaults(
  config: Partial<CodeHikeConfig> | undefined,
  cwd?: string,
  filepath?: string
): CodeHikeConfig {
  // TODO warn when config looks weird
  return {
    staticMediaQuery: "not screen, (max-width: 768px)",
    ...config,
    theme: config?.theme || {},
    autoImport: config?.autoImport === false ? false : true,
    skipLanguages: config?.skipLanguages || [],
    filepath,
  }
}
