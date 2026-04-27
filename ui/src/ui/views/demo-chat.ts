import { html } from "lit";
import type { AppViewState } from "../app-view-state.ts";
import { icons } from "../icons.ts";

/**
 * Static demo of the polished chat UI.
 *
 * Used when the app cannot reach a gateway (e.g. running in a hosted preview
 * environment) but we still want to showcase the actual production chat
 * styling. Re-uses the real CSS classes from `styles/chat/*.css` and
 * `styles/chat-polish.css` so the demo is pixel-identical to a real
 * connected session — including the conversations sidebar.
 */
export function renderDemoChat(state: AppViewState) {
  const conversations: Array<{ label: string; items: Array<{ key: string; label: string; active?: boolean }> }> = [
    {
      label: "Today",
      items: [
        { key: "demo-1", label: "Debounce helper review", active: true },
        { key: "demo-2", label: "Weekly planning notes" },
        { key: "demo-3", label: "Travel itinerary draft" },
      ],
    },
    {
      label: "Yesterday",
      items: [
        { key: "demo-4", label: "Refactor the auth flow" },
        { key: "demo-5", label: "Idea for landing page" },
        { key: "demo-6", label: "Sunday meal prep" },
      ],
    },
  ];

  return html`
    <div class="app-shell app-shell--demo" data-demo-mode="1">
      <section class="card chat chat--with-conversations">
        <aside class="chat-conversations" aria-label="Conversations">
          <div class="chat-conversations__header">
            <span class="chat-conversations__title">Conversations</span>
          </div>
          <button
            type="button"
            class="chat-conversations__new"
            disabled
            title="New chat (demo)"
          >
            ${icons.plus}
            <span>New chat</span>
          </button>
          <ul class="chat-conversations__list" role="list">
            ${conversations.map(
              (group) => html`
                <li>
                  <div class="chat-conversations__group-label">${group.label}</div>
                  <ul role="list" style="list-style:none;margin:0;padding:0;">
                    ${group.items.map(
                      (item) => html`
                        <li>
                          <button
                            type="button"
                            class="chat-conversations__item ${item.active
                              ? "chat-conversations__item--active"
                              : ""}"
                            title=${item.label}
                          >
                            <span class="chat-conversations__item-icon">
                              ${icons.messageSquare}
                            </span>
                            <span class="chat-conversations__item-label">${item.label}</span>
                          </button>
                        </li>
                      `,
                    )}
                  </ul>
                </li>
              `,
            )}
          </ul>
        </aside>

        <div class="chat-content">
          <div class="chat-header" style="padding: 12px 16px 8px;">
            <div class="chat-header__left">
              <span
                class="chat-avatar assistant"
                style="width: 22px; height: 22px; font-size: 11px;"
                >O</span
              >
              <strong style="font-size: 14px;">Debounce helper review</strong>
              <span class="agent-chat__badge" style="font-size: 11px;">Demo mode</span>
            </div>
            <div class="chat-header__right">
              <button
                class="btn btn--ghost"
                title="Exit demo and return to login"
                @click=${() => {
                  state.demoMode = false;
                }}
              >
                ${icons.x} Exit demo
              </button>
            </div>
          </div>

          <div class="chat-thread" role="log" aria-live="polite">
            <div class="chat-thread-inner">
              <div class="chat-divider" role="separator">
                <span class="chat-divider__line"></span>
                <span class="chat-divider__label">Today</span>
                <span class="chat-divider__line"></span>
              </div>

              <div class="chat-group user">
                <div class="chat-group-messages">
                  <div class="chat-bubble">
                    <div class="chat-text">
                      Can you write a small TypeScript helper that
                      <code>debounce</code>s a function? Make it generic and let me
                      set the delay.
                    </div>
                  </div>
                  <div class="chat-group-footer">
                    <span class="chat-sender-name">You</span>
                    <span class="chat-group-timestamp">10:42 AM</span>
                  </div>
                </div>
              </div>

              <div class="chat-group assistant">
                <span class="chat-avatar assistant">O</span>
                <div class="chat-group-messages">
                  <div class="chat-bubble">
                    <div class="chat-text">
                      <p>
                        Sure — here's a tiny, type-safe debounce. It clears any
                        pending call before scheduling the next one, so the
                        wrapped function only runs after the input settles for
                        <code>delay</code> milliseconds.
                      </p>
                      <pre><code>function debounce&lt;T extends (...args: any[]) =&gt; void&gt;(
  fn: T,
  delay = 300,
) {
  let timer: ReturnType&lt;typeof setTimeout&gt; | undefined;
  return (...args: Parameters&lt;T&gt;) =&gt; {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() =&gt; fn(...args), delay);
  };
}</code></pre>
                      <p>A few notes:</p>
                      <ul>
                        <li>
                          The generic <code>T</code> preserves the original
                          argument types — calls to the returned function are
                          fully type-checked.
                        </li>
                        <li>
                          Because <code>timer</code> lives in the closure, each
                          debounced function gets its own independent timer.
                        </li>
                        <li>
                          Use <code>300ms</code> for typing-driven UI like
                          search; bump it to <code>500–800ms</code> if you're
                          hitting an expensive API.
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div class="chat-group-footer">
                    <span class="chat-sender-name">OpenClaw</span>
                    <span class="chat-group-timestamp">10:42 AM</span>
                  </div>
                </div>
              </div>

              <div class="chat-group user">
                <div class="chat-group-messages">
                  <div class="chat-bubble">
                    <div class="chat-text">
                      Nice. Can you add a <code>cancel()</code> method too, in
                      case I unmount the component before the timer fires?
                    </div>
                  </div>
                  <div class="chat-group-footer">
                    <span class="chat-sender-name">You</span>
                    <span class="chat-group-timestamp">10:43 AM</span>
                  </div>
                </div>
              </div>

              <div class="chat-group assistant">
                <span class="chat-avatar assistant">O</span>
                <div class="chat-group-messages">
                  <div class="chat-bubble streaming">
                    <div class="chat-text">
                      Good call — leaking a timer after unmount can cause
                      "setState on unmounted component" warnings. I'll attach a
                      <code>cancel</code> method to the returned function so you
                      can clear the pending invocation from a cleanup effect
                    </div>
                  </div>
                  <div class="chat-group-footer">
                    <span class="chat-sender-name">OpenClaw</span>
                    <span class="chat-group-timestamp">just now</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="agent-chat__input">
            <textarea
              rows="1"
              placeholder="Message OpenClaw…   (demo — connect a gateway to chat)"
              disabled
            ></textarea>
            <div class="agent-chat__toolbar">
              <div class="agent-chat__toolbar-left">
                <button class="agent-chat__input-btn" disabled title="Attach (demo)">
                  ${icons.paperclip}
                </button>
                <button class="agent-chat__input-btn" disabled title="Voice (demo)">
                  ${icons.mic}
                </button>
              </div>
              <div class="agent-chat__toolbar-right">
                <button class="btn primary" disabled title="Send (demo)">
                  ${icons.send}
                </button>
              </div>
            </div>
          </div>
          <div class="chat-compose-hint">
            OpenClaw can make mistakes. Verify important information.
          </div>
        </div>
      </section>
    </div>
  `;
}
