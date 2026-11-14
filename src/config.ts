/**
 * config.ts — central place for settings that change between environments.
 *
 * - API_URL: where analytics events are sent (Milestone 7). Empty means
 *   "no server": events will be kept in localStorage instead.
 * - Debug flags: read from the page URL, e.g. https://.../saerg/?debug=1
 */

/** Flags that switch on researcher/developer tools. */
export interface DebugFlags {
  /** `?debug=1` — shows the debug panel (Milestone 2). */
  debug: boolean;
  /** `?researcher=1` — shows the "Download session data" button on the THANKS screen (Milestone 7). */
  researcher: boolean;
}

/**
 * Reads the debug flags from a URL query string such as "?debug=1&researcher=1".
 * This is a pure function (no access to `window`), so it can be unit-tested.
 */
export function parseDebugFlags(queryString: string): DebugFlags {
  const params = new URLSearchParams(queryString);
  return {
    debug: params.get("debug") === "1",
    researcher: params.get("researcher") === "1",
  };
}

/** Analytics server URL, taken from the VITE_API_URL variable in a .env file. */
export const API_URL: string = import.meta.env.VITE_API_URL ?? "";

/** Flags for the current page. Falls back to "all off" outside a browser (e.g. in tests). */
export const DEBUG_FLAGS: DebugFlags = parseDebugFlags(
  typeof window === "undefined" ? "" : window.location.search,
);
