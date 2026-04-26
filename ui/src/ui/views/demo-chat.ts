import { html } from "lit";
import type { AppViewState } from "../app-view-state.ts";
import { icons } from "../icons.ts";

/**
 * Static demo of the polished chat UI.
 *
 * Used when the app cannot reach a gateway (e.g. running in a hosted preview
 * environment) but we still want to showcase the actual production chat
 * styling. Re-uses the real CSS classes from `styles/chat/*.css` so the demo
 * is pixel-identical to a real connected session.
 */
export function renderDemoChat(state: AppViewState) {
  return html`
    <div class="app-shell app-shell--demo" data-demo-mode="1">
      <div class="chat" style="padding: 0 16px 0;">
        <div class="chat-header" style="padding: 12px 4px 8px;">
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
            <!-- Divider: today -->
            <div class="chat-divider" role="separator">
              <span class="chat-divider__line"></span>
              <span class="chat-divider__label">Today</span>
              <span class="chat-divider__line"></span>
            </div>

            <!-- User message -->
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

            <!-- Assistant message -->
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

            <!-- User follow-up -->
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

            <!-- Assistant streaming -->
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

        <!-- Composer (visual only) -->
        <div class="agent-chat__input" style="margin: 0 auto 18px; max-width: 768px;">
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
      </div>
    </div>
  `;
}
