import { describe, expect, it } from "vitest";

import { parseDebugFlags } from "../src/config";

// Milestone 0 smoke test: proves Vitest is wired up. Real game-logic tests
// (timer, scoring, endings) are added in Milestone 2.
describe("parseDebugFlags", () => {
  it("turns every flag off when the URL has no query string", () => {
    expect(parseDebugFlags("")).toEqual({ debug: false, researcher: false });
  });

  it("turns on the debug panel with ?debug=1", () => {
    expect(parseDebugFlags("?debug=1")).toEqual({ debug: true, researcher: false });
  });

  it("turns on researcher tools with ?researcher=1", () => {
    expect(parseDebugFlags("?debug=1&researcher=1")).toEqual({ debug: true, researcher: true });
  });

  it("ignores values other than 1", () => {
    expect(parseDebugFlags("?debug=true&researcher=0")).toEqual({
      debug: false,
      researcher: false,
    });
  });
});
