import { html } from "lit";
import type { AppViewState } from "../app-view-state.ts";
import { icons } from "../icons.ts";
import { normalizeBasePath } from "../navigation.ts";
import { agentLogoUrl } from "./agents-utils.ts";

export function renderLoginGate(state: AppViewState) {
  const basePath = normalizeBasePath(state.basePath ?? "");
  const faviconSrc = agentLogoUrl(basePath);

  return html`
    <div class="login-gate">
      <div class="login-gate__card">
        <div class="login-gate__header">
          <img class="login-gate__logo" src=${faviconSrc} alt="OpenClaw" />
          <div>
            <div class="login-gate__title">OpenClaw Control</div>
            <div class="login-gate__sub">Connect to your local gateway</div>
          </div>
        </div>

        <div class="login-gate__form">
          <div class="login-gate__url-row">
            <input
              class="login-gate__url-input"
              .value=${state.settings.gatewayUrl}
              @input=${(e: Event) => {
                const v = (e.target as HTMLInputElement).value;
                state.applySettings({ ...state.settings, gatewayUrl: v });
              }}
              @keydown=${(e: KeyboardEvent) => {
                if (e.key === "Enter") state.connect();
              }}
              placeholder="ws://localhost:18789"
              aria-label="WebSocket URL"
            />
            <button class="btn primary login-gate__connect" @click=${() => state.connect()}>
              Connect
            </button>
          </div>

          <details class="login-gate__advanced">
            <summary class="login-gate__advanced-toggle">
              Advanced options
            </summary>
            <div class="login-gate__advanced-body">
              <div class="login-gate__secret-row">
                <input
                  type=${state.loginShowGatewayToken ? "text" : "password"}
                  autocomplete="off"
                  spellcheck="false"
                  .value=${state.settings.token}
                  @input=${(e: Event) => {
                    const v = (e.target as HTMLInputElement).value;
                    state.applySettings({ ...state.settings, token: v });
                  }}
                  @keydown=${(e: KeyboardEvent) => {
                    if (e.key === "Enter") state.connect();
                  }}
                  placeholder="Gateway token (optional)"
                  aria-label="Gateway token"
                />
                <button
                  type="button"
                  class="btn btn--icon"
                  title=${state.loginShowGatewayToken ? "Hide token" : "Show token"}
                  aria-label="Toggle token visibility"
                  @click=${() => { state.loginShowGatewayToken = !state.loginShowGatewayToken; }}
                >
                  ${state.loginShowGatewayToken ? icons.eye : icons.eyeOff}
                </button>
              </div>
              <div class="login-gate__secret-row">
                <input
                  type=${state.loginShowGatewayPassword ? "text" : "password"}
                  autocomplete="off"
                  spellcheck="false"
                  .value=${state.password}
                  @input=${(e: Event) => {
                    const v = (e.target as HTMLInputElement).value;
                    state.password = v;
                  }}
                  @keydown=${(e: KeyboardEvent) => {
                    if (e.key === "Enter") state.connect();
                  }}
                  placeholder="Password (optional, not stored)"
                  aria-label="Password"
                />
                <button
                  type="button"
                  class="btn btn--icon"
                  title=${state.loginShowGatewayPassword ? "Hide password" : "Show password"}
                  aria-label="Toggle password visibility"
                  @click=${() => { state.loginShowGatewayPassword = !state.loginShowGatewayPassword; }}
                >
                  ${state.loginShowGatewayPassword ? icons.eye : icons.eyeOff}
                </button>
              </div>
            </div>
          </details>

          ${state.lastError
            ? html`<div class="login-gate__error">${state.lastError}</div>`
            : ""}
        </div>

        <div class="login-gate__footer">
          <a
            href="https://docs.openclaw.ai/web/dashboard"
            target="_blank"
            rel="noreferrer"
            class="login-gate__footer-link"
          >
            How to connect →
          </a>
          <button
            type="button"
            class="login-gate__demo-link"
            @click=${() => { state.demoMode = true; }}
          >
            View demo
          </button>
        </div>
      </div>
    </div>
  `;
}
