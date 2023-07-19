import { RemarkConfig } from "../core/types"

export type CodeHikeConfig = RemarkConfig

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
    theme: config?.theme || "dark-plus",
    autoImport: config?.autoImport === false ? false : true,
    skipLanguages: config?.skipLanguages || [],
    filepath,
  }
}
