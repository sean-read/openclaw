import { html, type TemplateResult } from "lit";
import "./carapace-select.ts";
import type { CarapaceSelectOption } from "./carapace-select.ts";

/* ============================================================
   renderSelect — drop-in for native <select> using <carapace-select>
   --------------------------------------------------------------
   Existing call sites use:
     <select .value=${v} ?disabled=${d} @change=${(e) => f(e.target.value)}>
       <option value="x">X</option>
     </select>
   Replace with:
     ${renderSelect({
       value: v, disabled: d, options: [{value:"x",label:"X"}],
       onChange: f,
       ariaLabel: "...", title: "...", className: "...",
     })}
   ============================================================ */

export interface RenderSelectProps {
  value: string;
  options: readonly CarapaceSelectOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  title?: string;
  ariaLabel?: string;
  className?: string;
  dataset?: Record<string, string>;
}

export function renderSelect(props: RenderSelectProps): TemplateResult {
  const datasetAttrs: TemplateResult[] = [];
  if (props.dataset) {
    for (const [key, value] of Object.entries(props.dataset)) {
      // Pass-through of data-* attributes via template literal interpolation
      datasetAttrs.push(html`${`data-${key}="${value}"`}`);
    }
  }
  return html`
    <carapace-select
      class=${props.className ?? ""}
      .options=${props.options}
      .value=${props.value}
      .placeholder=${props.placeholder ?? ""}
      .title=${props.title ?? ""}
      aria-label=${props.ariaLabel ?? ""}
      ?disabled=${props.disabled ?? false}
      @change=${(e: CustomEvent<{ value: string }>) => props.onChange(e.detail.value)}
    ></carapace-select>
  `;
}
