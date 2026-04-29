import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const readStyle = (fileName: string) =>
  readFileSync(resolve(process.cwd(), "src/styles", fileName), "utf8");

describe("chat header responsive mobile styles", () => {
  it("keeps the chat header and session controls from clipping on narrow widths", () => {
    const css = readStyle("layout.mobile.css");

    expect(css).toContain("@media (max-width: 1320px)");
    expect(css).toContain(".content--chat .content-header");
    expect(css).toContain(".chat-controls__session-row");
    expect(css).toContain(".chat-controls__thinking-select");
  });
});

describe("mobile navigation drawer styles", () => {
  it("keeps redesign page-entry animation off the shell nav transform", () => {
    const css = readStyle("redesign.css");

    expect(css).not.toContain(".content > *,\n.shell-nav,\n.topbar");
    expect(css).toContain(".content > *,\n.topbar");
    expect(css).toContain(".content--chat .content-header");
  });
});
