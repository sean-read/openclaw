import { html, nothing, type TemplateResult } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import type { SkillStatusEntry } from "../types.ts";

/* ============================================================
   Skill display helpers
   - Pretty names (kebab-case → Title Case + overrides)
   - Real brand icons for known apps; emoji fallback otherwise
   - Filter for Asian-locale skills the user doesn't use
   ============================================================ */

/* Display-name overrides for skills whose Title-Case derivation
   wouldn't match their real product name. Keys are skill.name. */
const NAME_OVERRIDES: Record<string, string> = {
  "1password": "1Password",
  "apple-notes": "Apple Notes",
  "apple-reminders": "Apple Reminders",
  "bear-notes": "Bear",
  blogwatcher: "Blogwatcher",
  blucli: "BluCLI",
  bluebubbles: "BlueBubbles",
  camsnap: "CamSnap",
  canvas: "Canvas",
  clawhub: "ClawHub",
  "coding-agent": "Coding Agent",
  discord: "Discord",
  eightctl: "EightCTL",
  gemini: "Gemini",
  "gh-issues": "GitHub Issues",
  gifgrep: "GIFgrep",
  github: "GitHub",
  gog: "GOG",
  goplaces: "GoPlaces",
  healthcheck: "Healthcheck",
  himalaya: "Himalaya Mail",
  imsg: "iMessage",
  mcporter: "MCPorter",
  "model-usage": "Model Usage",
  "nano-pdf": "Nano PDF",
  "node-connect": "Node Connect",
  notion: "Notion",
  obsidian: "Obsidian",
  "openai-whisper": "OpenAI Whisper",
  "openai-whisper-api": "OpenAI Whisper API",
  openhue: "OpenHue",
  oracle: "Oracle",
  ordercli: "OrderCLI",
  peekaboo: "Peekaboo",
  sag: "SAG",
  "session-logs": "Session Logs",
  "sherpa-onnx-tts": "Sherpa-ONNX TTS",
  "skill-creator": "Skill Creator",
  slack: "Slack",
  songsee: "Songsee",
  sonoscli: "Sonos",
  "spotify-player": "Spotify",
  summarize: "Summarize",
  taskflow: "Taskflow",
  "taskflow-inbox-triage": "Taskflow Inbox Triage",
  "things-mac": "Things",
  tmux: "tmux",
  trello: "Trello",
  "video-frames": "Video Frames",
  "voice-call": "Voice Call",
  wacli: "WhatsApp",
  weather: "Weather",
  "xurl": "xURL",
};

/* Skills to hide from the UI by default. The bundled gateway ships
   integrations for several Asian-market services the user doesn't
   need to see. Add patterns or exact names here. Patterns ending in
   `-*` match by prefix. */
const HIDDEN_SKILL_PREFIXES = [
  "feishu-",
  "lark-",
  "wechat-",
  "weibo-",
  "qqbot-",
  "dingtalk-",
  "alibaba-",
  "baidu-",
  "naver-",
  "kakao-",
  "line-",
];

const HIDDEN_SKILL_NAMES = new Set<string>([
  "feishu",
  "lark",
  "wechat",
  "weibo",
  "qqbot",
  "dingtalk",
  "baidu",
  "naver",
  "kakao",
]);

export function isHiddenSkill(name: string): boolean {
  const normalized = name.toLowerCase();
  if (HIDDEN_SKILL_NAMES.has(normalized)) return true;
  return HIDDEN_SKILL_PREFIXES.some((prefix) => normalized.startsWith(prefix));
}

export function filterVisibleSkills<T extends { name: string }>(skills: readonly T[]): T[] {
  return skills.filter((skill) => !isHiddenSkill(skill.name));
}

export function formatSkillName(name: string): string {
  if (!name) return name;
  const override = NAME_OVERRIDES[name];
  if (override) return override;
  return name
    .split(/[-_]/g)
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : part))
    .join(" ");
}

/* ============================================================
   Brand icons
   --------------------------------------------------------------
   Inline SVG paths per skill. Keep paths small and self-contained
   so they cache with the bundle. Two-tone where it helps; otherwise
   currentColor lets the surrounding text colour show through.
   ============================================================ */

type BrandIcon = { fill: string; svg: string };

/* Apple uses a single-colour glyph, tinted via brand colour. */
const APPLE_NOTES_ICON: BrandIcon = {
  fill: "#FFC83D",
  svg: '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect x="3" y="3" width="26" height="26" rx="6" fill="#FFC83D"/><rect x="3" y="3" width="26" height="6" rx="6" fill="#F4A52A"/><path d="M9 14h14M9 18h14M9 22h9" stroke="#5A3A00" stroke-width="1.6" stroke-linecap="round"/></svg>',
};

const APPLE_REMINDERS_ICON: BrandIcon = {
  fill: "#FF3B30",
  svg: '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect x="3" y="3" width="26" height="26" rx="6" fill="#1C1C1E"/><circle cx="11" cy="12" r="3" stroke="#FF3B30" stroke-width="1.8" fill="none"/><path d="M16 12h7" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/><circle cx="11" cy="20" r="3" stroke="#FF3B30" stroke-width="1.8" fill="none"/><path d="M16 20h7" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></svg>',
};

const NOTION_ICON: BrandIcon = {
  fill: "#fff",
  svg: '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="32" height="32" rx="6" fill="#fff"/><path d="M7.5 6.5l13-1c.6 0 .9.2 1.3.6l3.5 3.4c.3.3.4.5.4.9v15c0 .8-.3 1.3-1.3 1.3l-15.2.9c-.8 0-1.2-.4-1.5-1L5 21.7c-.3-.4-.4-.7-.4-1.2V8c0-.7.3-1.2 1.4-1.4l1.5-.1z" fill="#000"/><path d="M21 9.5l-13 .8c-.5 0-.6.3-.4.6l.8.6c.2.1.4.3.7.3l11.2-.7c.5 0 .5-.3.4-.5l-.6-.8c-.1-.2-.4-.3-.7-.3h-.4z" fill="#fff" fill-rule="evenodd"/><path d="M9.6 13.6v9.5c0 .5.2.7.7.7l11.5-.7c.5 0 .5-.3.5-.7v-9.4c0-.4-.2-.7-.5-.7l-12 .7c-.4 0-.5.2-.5.6h.3z" fill="#fff" fill-rule="evenodd"/><path d="M19.7 14.2c.1.2 0 .5-.3.5l-.6.1v8.4c-.5.3-1 .4-1.4.4-.7 0-.9-.2-1.4-.8l-3.9-6.2v6l1.2.3s0 .6-.7.6l-2.9.2c-.1-.2 0-.5.3-.5l.6-.2v-7.5l-.9-.1c-.1-.3.1-.7.6-.7l3.1-.2 4.3 6.6V14.6l-1-.2c-.1-.3.1-.6.5-.6l2.5-.1v.5z" fill="#000"/></svg>',
};

const SLACK_ICON: BrandIcon = {
  fill: "#4A154B",
  svg: '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="32" height="32" rx="6" fill="#4A154B"/><g transform="translate(7 7)"><path d="M5 11.5a2 2 0 1 1-2-2h2v2zm1 0a2 2 0 1 1 4 0v5a2 2 0 1 1-4 0v-5z" fill="#E01E5A"/><path d="M8 5a2 2 0 1 1 2-2v2H8zm0 1a2 2 0 1 1 0 4H3a2 2 0 1 1 0-4h5z" fill="#36C5F0"/><path d="M14.5 8a2 2 0 1 1 2 2h-2V8zm-1 0a2 2 0 1 1-4 0V3a2 2 0 1 1 4 0v5z" fill="#2EB67D"/><path d="M11.5 14.5a2 2 0 1 1-2 2v-2h2zm0-1a2 2 0 1 1 0-4h5a2 2 0 1 1 0 4h-5z" fill="#ECB22E"/></g></svg>',
};

const DISCORD_ICON: BrandIcon = {
  fill: "#5865F2",
  svg: '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="32" height="32" rx="6" fill="#5865F2"/><path d="M22.6 9c-1.2-.6-2.4-1-3.7-1.2l-.2.4c1.2.3 2.3.7 3.3 1.4-1.3-.7-2.7-1.1-4.1-1.1h-.5c-1.4 0-2.8.4-4.1 1.1 1-.7 2.1-1.1 3.3-1.4l-.2-.4c-1.3.2-2.5.6-3.7 1.2-2.1 3.2-2.7 6.4-2.4 9.5 1.5 1.1 3 1.8 4.4 2.2.3-.5.6-1 .9-1.5-.5-.2-1-.4-1.4-.7l.3-.2c2.7 1.3 5.6 1.3 8.3 0l.3.2c-.4.3-.9.5-1.4.7.3.5.6 1 .9 1.5 1.4-.4 2.9-1.1 4.4-2.2.4-3.6-.6-6.7-2.4-9.5zM12.9 16.7c-.9 0-1.6-.8-1.6-1.8s.7-1.8 1.6-1.8c.9 0 1.6.8 1.6 1.8s-.7 1.8-1.6 1.8zm6.2 0c-.9 0-1.6-.8-1.6-1.8s.7-1.8 1.6-1.8c.9 0 1.6.8 1.6 1.8s-.7 1.8-1.6 1.8z" fill="#fff"/></svg>',
};

const SPOTIFY_ICON: BrandIcon = {
  fill: "#1ED760",
  svg: '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="16" cy="16" r="13" fill="#1ED760"/><path d="M22.4 21c-.2.3-.6.4-.9.2-2.5-1.5-5.6-1.8-9.2-1-.4.1-.7-.1-.8-.5-.1-.4.1-.7.5-.8 4-.9 7.5-.5 10.3 1.2.3.2.4.6.1.9zm1.7-3.1c-.3.4-.7.5-1.1.3-2.8-1.7-7.1-2.2-10.5-1.2-.4.1-.9-.1-1-.5-.1-.4.1-.9.5-1 3.8-1.1 8.5-.6 11.7 1.4.4.2.5.8.4 1zm.2-3.3c-3.4-2-9-2.2-12.2-1.2-.5.2-1.1-.1-1.2-.6-.2-.5.1-1.1.6-1.2 3.7-1.1 9.9-.9 13.8 1.4.5.3.6.9.3 1.4-.3.5-.9.6-1.3.2z" fill="#000"/></svg>',
};

const OBSIDIAN_ICON: BrandIcon = {
  fill: "#7C3AED",
  svg: '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="32" height="32" rx="6" fill="#1A1A1A"/><path d="M19 6l6 7-2 11-7 2-9-7 4-12 8-1z" fill="#7C3AED"/><path d="M19 6l-1 8 5 5-1 5-7 2 3-12-7 4 4-12 4 0z" fill="#A78BFA" opacity="0.6"/></svg>',
};

const GITHUB_ICON: BrandIcon = {
  fill: "#1A1A1A",
  svg: '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="32" height="32" rx="6" fill="#1A1A1A"/><path d="M16 6a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.6 1 1.6 1 .9 1.5 2.4 1.1 3 .8.1-.6.4-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .9-.3 2.8 1 .8-.2 1.7-.3 2.5-.3.9 0 1.7.1 2.5.3 1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.8v2.7c0 .3.2.6.7.5A10 10 0 0 0 16 6z" fill="#fff"/></svg>',
};

const TRELLO_ICON: BrandIcon = {
  fill: "#0079BF",
  svg: '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="32" height="32" rx="6" fill="#0079BF"/><rect x="6" y="7" width="8" height="14" rx="2" fill="#fff"/><rect x="18" y="7" width="8" height="9" rx="2" fill="#fff"/></svg>',
};

const ONEPASSWORD_ICON: BrandIcon = {
  fill: "#0572EC",
  svg: '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="16" cy="16" r="13" fill="#0572EC"/><path d="M16 8a8 8 0 0 1 8 8h-3a5 5 0 0 0-9.7-1.7L9 13c.5-2.9 3-5 6-5zm0 16a8 8 0 0 1-8-8h3a5 5 0 0 0 9.7 1.7L23 19c-.5 2.9-3 5-7 5z" fill="#fff"/><circle cx="16" cy="16" r="2" fill="#fff"/></svg>',
};

const GEMINI_ICON: BrandIcon = {
  fill: "#1A73E8",
  svg: '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="32" height="32" rx="6" fill="#1A1A1A"/><path d="M16 4l1.6 7 5.4 5-5.4 5-1.6 7-1.6-7-5.4-5 5.4-5z" fill="url(#g)"/><defs><linearGradient id="g" x1="9" y1="6" x2="23" y2="26"><stop stop-color="#4285F4"/><stop offset="1" stop-color="#9B72CB"/></linearGradient></defs></svg>',
};

const WHATSAPP_ICON: BrandIcon = {
  fill: "#25D366",
  svg: '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="16" cy="16" r="13" fill="#25D366"/><path d="M22.5 18.5c-.3-.2-1.7-.9-2-1-.3-.1-.5-.2-.7.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6 0-.9-.4-1.7-.9-2.5-1.7-.7-.6-1.2-1.3-1.6-2-.2-.3 0-.5.1-.7l.5-.6c.1-.1.2-.3.3-.5.1-.2 0-.4 0-.5l-.7-1.7c-.2-.5-.4-.5-.6-.5h-.5c-.2 0-.5.1-.7.4-.3.3-1 1-1 2.4 0 1.4 1 2.8 1.2 2.9.1.2 2 3 4.8 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.4z" fill="#fff"/></svg>',
};

const IMSG_ICON: BrandIcon = {
  fill: "#34DA67",
  svg: '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="32" height="32" rx="7" fill="#34DA67"/><path d="M16 6.5c-5.2 0-9.5 3.4-9.5 7.6 0 2 1 3.9 2.7 5.3-.2.8-.7 1.9-1.5 2.5-.2.2-.1.5.2.5 1.5 0 3-.4 4.1-1 1.2.3 2.5.5 3.9.5 5.2 0 9.5-3.4 9.5-7.6S21.2 6.5 16 6.5z" fill="#fff"/></svg>',
};

const SONOS_ICON: BrandIcon = {
  fill: "#000",
  svg: '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="32" height="32" rx="6" fill="#000"/><path d="M6 22a10 10 0 0 1 20 0M9 22a7 7 0 0 1 14 0M12 22a4 4 0 0 1 8 0" stroke="#fff" stroke-width="1.6" fill="none"/></svg>',
};

const HUE_ICON: BrandIcon = {
  fill: "#fff",
  svg: '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="32" height="32" rx="6" fill="#1B1B1B"/><circle cx="16" cy="13" r="6" fill="#FFD56B"/><rect x="13" y="18" width="6" height="6" rx="1.4" fill="#999"/><rect x="14" y="22" width="4" height="3" rx="0.6" fill="#666"/></svg>',
};

const TMUX_ICON: BrandIcon = {
  fill: "#1BB91F",
  svg: '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="32" height="32" rx="6" fill="#0E1611"/><rect x="5" y="6" width="22" height="20" rx="2" fill="none" stroke="#1BB91F" stroke-width="1.5"/><path d="M9 13l3 2-3 2M14 17h7" stroke="#1BB91F" stroke-width="1.6" stroke-linecap="round" fill="none"/></svg>',
};

const WEATHER_ICON: BrandIcon = {
  fill: "#4FC3F7",
  svg: '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="32" height="32" rx="6" fill="#1B2A47"/><circle cx="13" cy="13" r="4" fill="#FFD86B"/><path d="M9 21a4 4 0 0 1 8 0h2a3 3 0 1 1 0 6H10a4 4 0 0 1-1-6z" fill="#fff"/></svg>',
};

const VOICE_ICON: BrandIcon = {
  fill: "#FF4757",
  svg: '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="32" height="32" rx="6" fill="#241126"/><path d="M16 6a4 4 0 0 0-4 4v6a4 4 0 0 0 8 0v-6a4 4 0 0 0-4-4zM10 14v2a6 6 0 0 0 12 0v-2M16 22v4M12 26h8" stroke="#FF4757" stroke-width="1.8" stroke-linecap="round" fill="none"/></svg>',
};

const CANVAS_ICON: BrandIcon = {
  fill: "#FF6B5B",
  svg: '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="32" height="32" rx="6" fill="#1B1B1F"/><rect x="6" y="7" width="20" height="14" rx="2" fill="none" stroke="#FF6B5B" stroke-width="1.5"/><path d="M10 17l4-5 3 3 5-6" stroke="#FF6B5B" stroke-width="1.8" fill="none"/><path d="M14 25h4" stroke="#FF6B5B" stroke-width="1.8" stroke-linecap="round"/></svg>',
};

const BRAND_ICONS: Record<string, BrandIcon> = {
  "1password": ONEPASSWORD_ICON,
  "apple-notes": APPLE_NOTES_ICON,
  "apple-reminders": APPLE_REMINDERS_ICON,
  canvas: CANVAS_ICON,
  discord: DISCORD_ICON,
  gemini: GEMINI_ICON,
  github: GITHUB_ICON,
  "gh-issues": GITHUB_ICON,
  imsg: IMSG_ICON,
  notion: NOTION_ICON,
  obsidian: OBSIDIAN_ICON,
  openhue: HUE_ICON,
  slack: SLACK_ICON,
  sonoscli: SONOS_ICON,
  "spotify-player": SPOTIFY_ICON,
  tmux: TMUX_ICON,
  trello: TRELLO_ICON,
  "voice-call": VOICE_ICON,
  wacli: WHATSAPP_ICON,
  weather: WEATHER_ICON,
};

/* Render a 22px brand icon if we have one for this skill, else
   return the emoji wrapped in a sized span, else nothing. */
export function renderSkillIcon(
  skill: Pick<SkillStatusEntry, "name" | "emoji">,
  size: number = 22,
): TemplateResult | typeof nothing {
  const brand = BRAND_ICONS[skill.name];
  if (brand) {
    return html`<span
      class="skill-icon skill-icon--brand"
      style="--skill-icon-size:${size}px"
      aria-hidden="true"
      >${unsafeHTML(brand.svg)}</span
    >`;
  }
  if (skill.emoji) {
    return html`<span
      class="skill-icon skill-icon--emoji"
      style="--skill-icon-size:${size}px"
      aria-hidden="true"
      >${skill.emoji}</span
    >`;
  }
  return nothing;
}
