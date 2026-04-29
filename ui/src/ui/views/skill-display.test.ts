/* @vitest-environment jsdom */

import { render } from "lit";
import { describe, expect, it } from "vitest";
import { renderSkillIcon } from "./skill-display.ts";

function renderIcon(skill: Parameters<typeof renderSkillIcon>[0]) {
  const container = document.createElement("div");
  render(renderSkillIcon(skill), container);
  return container;
}

describe("renderSkillIcon", () => {
  it("renders mapped brand icons before emoji fallbacks", async () => {
    const container = renderIcon({ name: "bear-notes", emoji: "🐻" });
    await Promise.resolve();

    expect(container.querySelector(".skill-icon--brand svg")).not.toBeNull();
    expect(container.querySelector(".skill-icon--emoji")).toBeNull();
  });

  it("resolves company icons from homepage domains", async () => {
    const container = renderIcon({
      name: "speech-to-text",
      homepage: "https://platform.openai.com/docs/guides/speech-to-text",
    });
    await Promise.resolve();

    expect(container.querySelector(".skill-icon--brand svg")).not.toBeNull();
  });

  it("uses a stable monogram when no brand or emoji exists", async () => {
    const container = renderIcon({ name: "custom-skill" });
    await Promise.resolve();

    const monogram = container.querySelector(".skill-icon--monogram");
    expect(monogram).not.toBeNull();
    expect(monogram?.textContent).toBe("CS");
  });
});
