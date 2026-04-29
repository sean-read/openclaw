import { LitElement, html, css, type TemplateResult } from "lit";
import { customElement, property, state, query } from "lit/decorators.js";

/* ============================================================
   <carapace-select>
   --------------------------------------------------------------
   Styled drop-in replacement for native <select>. Keeps the
   accessibility surface (combobox / listbox), but renders both
   the trigger and the popover with full Carapace styling — no
   native OS chrome.

   Properties:
     - value:       currently selected value
     - options:     readonly array of { value, label, group?, title? }
     - placeholder: shown when value is empty
     - disabled:    disables interaction
     - title:       trigger tooltip
     - ariaLabel:   accessible label

   Emits:
     - "change" with detail { value: string }

   Keyboard:
     - ArrowDown / ArrowUp: navigate
     - Enter / Space:       select
     - Escape:              close
     - Tab:                 close, advance focus
   ============================================================ */

export interface CarapaceSelectOption {
  value: string;
  label: string;
  group?: string;
  title?: string;
}

@customElement("carapace-select")
export class CarapaceSelect extends LitElement {
  static styles = css`
    :host {
      display: inline-flex;
      position: relative;
      max-width: 100%;
      min-width: 110px;
      font-family: inherit;
    }

    :host([data-open]) {
      z-index: var(--carapace-select-open-z, 2200);
    }

    button.cs-trigger {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      width: 100%;
      min-width: 0;
      height: var(--carapace-select-height, 30px);
      min-height: var(--carapace-select-height, 30px);
      padding: 0 8px 0 10px;
      border: 1px solid color-mix(in srgb, var(--border) 75%, transparent);
      border-radius: var(--radius-md, 12px);
      background: color-mix(in srgb, var(--card) 88%, transparent);
      color: var(--text);
      font: inherit;
      font-size: 12.5px;
      font-weight: 500;
      letter-spacing: -0.005em;
      box-shadow: inset 0 1px 0 color-mix(in srgb, white 6%, transparent);
      cursor: pointer;
      text-align: left;
      text-transform: capitalize;
      transition:
        border-color 120ms ease,
        background 120ms ease,
        box-shadow 120ms ease;
    }

    button.cs-trigger:hover:not(:disabled) {
      border-color: color-mix(in srgb, var(--border-strong) 88%, transparent);
      background: color-mix(in srgb, var(--bg-elevated) 86%, var(--card));
    }

    button.cs-trigger:focus-visible {
      outline: none;
      border-color: color-mix(in srgb, var(--accent) 55%, var(--border-strong));
      box-shadow:
        inset 0 1px 0 color-mix(in srgb, white 6%, transparent),
        0 0 0 3px color-mix(in srgb, var(--accent) 22%, transparent);
    }

    button.cs-trigger:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }

    button.cs-trigger[aria-expanded="true"] {
      border-color: color-mix(in srgb, var(--accent) 55%, var(--border-strong));
    }

    .cs-trigger__label {
      flex: 1 1 auto;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .cs-trigger__chevron {
      flex-shrink: 0;
      width: 12px;
      height: 12px;
      color: var(--muted);
      transition: transform 150ms ease;
    }

    button.cs-trigger[aria-expanded="true"] .cs-trigger__chevron {
      transform: rotate(180deg);
      color: var(--accent);
    }

    .cs-popover {
      position: absolute;
      top: calc(100% + 6px);
      left: 0;
      min-width: 100%;
      width: max-content;
      max-width: min(360px, 92vw);
      max-height: 360px;
      overflow-y: auto;
      padding: 6px;
      border: 1px solid color-mix(in srgb, var(--border-strong) 70%, transparent);
      border-radius: var(--radius-lg, 18px);
      background: color-mix(in srgb, var(--popover, var(--card)) 94%, transparent);
      box-shadow:
        inset 0 1px 0 color-mix(in srgb, white 6%, transparent),
        0 24px 56px color-mix(in srgb, black 36%, transparent);
      z-index: var(--carapace-select-popover-z, 2200);
      animation: cs-fade 120ms ease;
      backdrop-filter: blur(20px) saturate(1.7);
      -webkit-backdrop-filter: blur(20px) saturate(1.7);
      scrollbar-width: thin;
    }

    /* Right-anchor when the popover would otherwise overflow the viewport */
    :host([data-anchor="end"]) .cs-popover {
      left: auto;
      right: 0;
    }

    @keyframes cs-fade {
      from { opacity: 0; transform: translateY(-4px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .cs-group {
      padding: 8px 11px 4px;
      font-size: 10.5px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: color-mix(in srgb, var(--accent) 55%, var(--muted));
      user-select: none;
    }

    .cs-option {
      display: flex;
      align-items: center;
      width: 100%;
      padding: 7px 11px;
      border: none;
      border-radius: var(--radius-md, 12px);
      background: transparent;
      color: var(--text);
      font: inherit;
      font-size: 13px;
      text-align: left;
      cursor: pointer;
      text-transform: capitalize;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      transition:
        background 100ms ease,
        color 100ms ease;
    }

    .cs-option[aria-selected="true"] {
      background: color-mix(in srgb, var(--accent) 12%, var(--bg-elevated));
      color: var(--text-strong);
      font-weight: 600;
    }

    .cs-option:hover:not(:disabled),
    .cs-option.is-active {
      background: color-mix(in srgb, var(--accent) 14%, var(--bg-elevated));
      color: var(--text-strong);
    }

    .cs-option:focus-visible {
      outline: none;
      background: color-mix(in srgb, var(--accent) 18%, var(--bg-elevated));
    }

    .cs-empty {
      padding: 10px 11px;
      color: var(--muted);
      font-size: 12.5px;
    }

    /* Compact scrollbar inside the popover */
    .cs-popover::-webkit-scrollbar { width: 8px; }
    .cs-popover::-webkit-scrollbar-track { background: transparent; }
    .cs-popover::-webkit-scrollbar-thumb {
      border-radius: 999px;
      background: color-mix(in srgb, var(--text) 14%, transparent);
      border: 2px solid transparent;
      background-clip: padding-box;
    }
  `;

  @property({ type: Array }) options: readonly CarapaceSelectOption[] = [];
  @property({ type: String }) value = "";
  @property({ type: String }) placeholder = "";
  @property({ type: String }) override title = "";
  @property({ type: String, attribute: "aria-label" }) ariaLabelText = "";
  @property({ type: Boolean }) override disabled = false;

  @state() private open = false;
  @state() private activeIndex = -1;

  @query(".cs-popover") private popoverEl?: HTMLElement;
  @query(".cs-trigger") private triggerEl?: HTMLButtonElement;

  private onDocumentClick = (event: MouseEvent) => {
    if (!this.open) return;
    if (event.composedPath().includes(this)) return;
    this.close();
  };

  private onDocumentKey = (event: KeyboardEvent) => {
    if (!this.open) return;
    if (event.key === "Escape") {
      event.stopPropagation();
      this.close();
      this.triggerEl?.focus();
    }
  };

  override connectedCallback() {
    super.connectedCallback();
    document.addEventListener("mousedown", this.onDocumentClick, true);
    document.addEventListener("keydown", this.onDocumentKey, true);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("mousedown", this.onDocumentClick, true);
    document.removeEventListener("keydown", this.onDocumentKey, true);
  }

  private get currentLabel(): string {
    const match = this.options.find((opt) => opt.value === this.value);
    if (match) return match.label;
    return this.placeholder || "";
  }

  private toggle = () => {
    if (this.disabled) return;
    if (this.open) this.close();
    else this.openMenu();
  };

  private openMenu = () => {
    this.open = true;
    this.toggleAttribute("data-open", true);
    const idx = this.options.findIndex((opt) => opt.value === this.value);
    this.activeIndex = idx >= 0 ? idx : 0;
    this.updateComplete.then(() => {
      this.scrollActiveIntoView();
      this.adjustAnchor();
    });
  };

  private close = () => {
    this.open = false;
    this.toggleAttribute("data-open", false);
    this.activeIndex = -1;
  };

  private adjustAnchor = () => {
    const pop = this.popoverEl;
    if (!pop) return;
    const rect = pop.getBoundingClientRect();
    if (rect.right > window.innerWidth - 8) {
      this.dataset.anchor = "end";
    } else {
      delete this.dataset.anchor;
    }
  };

  private scrollActiveIntoView = () => {
    const pop = this.popoverEl;
    if (!pop) return;
    const items = pop.querySelectorAll<HTMLElement>(".cs-option");
    const el = items[this.activeIndex];
    if (el) el.scrollIntoView({ block: "nearest" });
  };

  private select = (value: string) => {
    if (value === this.value) {
      this.close();
      return;
    }
    this.value = value;
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { value },
        bubbles: true,
        composed: true,
      }),
    );
    this.close();
  };

  private moveActive = (delta: number) => {
    if (this.options.length === 0) return;
    const next = (this.activeIndex + delta + this.options.length) % this.options.length;
    this.activeIndex = next;
    this.updateComplete.then(() => this.scrollActiveIntoView());
  };

  private onTriggerKey = (event: KeyboardEvent) => {
    if (this.disabled) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!this.open) {
        this.openMenu();
      } else {
        this.moveActive(event.key === "ArrowDown" ? 1 : -1);
      }
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (this.open && this.activeIndex >= 0) {
        this.select(this.options[this.activeIndex].value);
      } else {
        this.openMenu();
      }
      return;
    }
    if (event.key === "Tab") {
      this.close();
    }
  };

  private renderOptions = (): TemplateResult[] => {
    const blocks: TemplateResult[] = [];
    let lastGroup: string | undefined;
    let i = 0;
    for (const opt of this.options) {
      if (opt.group && opt.group !== lastGroup) {
        blocks.push(html`<div class="cs-group">${opt.group}</div>`);
        lastGroup = opt.group;
      } else if (!opt.group) {
        lastGroup = undefined;
      }
      const isSelected = opt.value === this.value;
      const isActive = i === this.activeIndex;
      const value = opt.value;
      blocks.push(html`
        <button
          type="button"
          class="cs-option ${isActive ? "is-active" : ""}"
          role="option"
          aria-selected=${isSelected ? "true" : "false"}
          title=${opt.title ?? opt.label}
          @mouseenter=${() => (this.activeIndex = this.indexOf(value))}
          @click=${() => this.select(value)}
        >
          ${opt.label}
        </button>
      `);
      i++;
    }
    return blocks;
  };

  private indexOf = (value: string): number => {
    return this.options.findIndex((opt) => opt.value === value);
  };

  override render() {
    const trigger = this.currentLabel || this.placeholder || "Select…";
    return html`
      <button
        type="button"
        class="cs-trigger"
        ?disabled=${this.disabled}
        title=${this.title || trigger}
        aria-haspopup="listbox"
        aria-expanded=${this.open ? "true" : "false"}
        aria-label=${this.ariaLabelText || trigger}
        @click=${this.toggle}
        @keydown=${this.onTriggerKey}
      >
        <span class="cs-trigger__label">${trigger}</span>
        <svg
          class="cs-trigger__chevron"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      ${this.open
        ? html`
            <div class="cs-popover" role="listbox" tabindex="-1">
              ${this.options.length === 0
                ? html`<div class="cs-empty">No options</div>`
                : this.renderOptions()}
            </div>
          `
        : null}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "carapace-select": CarapaceSelect;
  }
}
