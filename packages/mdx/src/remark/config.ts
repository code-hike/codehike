export type CodeHikeConfig = {
  theme: any
  lineNumbers?: boolean
  autoImport?: boolean
  skipLanguages: string[]
  showExpandButton?: boolean
  showCopyButton?: boolean
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
    ...config,
    theme: config?.theme || {},
    autoImport: config?.autoImport === false ? false : true,
    skipLanguages: config?.skipLanguages || [],
    filepath,
  }
}
