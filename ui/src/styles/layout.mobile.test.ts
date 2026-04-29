import { readFileSync } from "node:fs";
import { basename, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const uiRoot = basename(process.cwd()) === "ui" ? process.cwd() : resolve(process.cwd(), "ui");
const readStyle = (fileName: string) =>
  readFileSync(resolve(uiRoot, "src/styles", fileName), "utf8");
const readSource = (fileName: string) =>
  readFileSync(resolve(uiRoot, "src/ui/components", fileName), "utf8");

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

describe("chat control layering and alignment", () => {
  it("keeps chat dropdowns above the thread and aligns select/buttons", () => {
    const css = readStyle("redesign.css");
    const select = readSource("carapace-select.ts");

    expect(css).toContain(".content--chat .content-header");
    expect(css).toContain("z-index: 80;");
    expect(css).toContain("grid-template-columns: minmax(0, 1fr) max-content;");
    expect(css).toContain("flex-wrap: nowrap;");
    expect(css).toContain("--carapace-select-height: 34px;");
    expect(css).toContain(".content--chat .chat-controls .btn--icon");
    expect(select).toContain(":host([data-open])");
    expect(select).toContain("var(--carapace-select-popover-z, 2200)");
  });
});
