export type CodeHikeConfig = {
  theme: any
  lineNumbers?: boolean
  autoImport?: boolean
  skipLanguages: string[]
  showExpandButton?: boolean
  showCopyButton?: boolean
}

/**
 * Add defaults and normalize config
 */
export function addConfigDefaults(
  config: Partial<CodeHikeConfig> | undefined
): CodeHikeConfig {
  // TODO warn when config looks weird
  return {
    ...config,
    theme: config?.theme || {},
    autoImport: config?.autoImport === false ? false : true,
    skipLanguages: config?.skipLanguages || [],
  }
}
