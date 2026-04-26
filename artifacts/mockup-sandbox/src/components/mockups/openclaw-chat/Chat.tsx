import { useState } from "react";
import {
  ArrowUp,
  Paperclip,
  Mic,
  Plus,
  MessageSquare,
  Settings as SettingsIcon,
  Sparkles,
  Copy,
  ChevronLeft,
} from "lucide-react";

const CSS = `
:root {
  --bg: #0d0e10;
  --bg-elevated: #16181b;
  --bg-content: #0d0e10;
  --bg-hover: rgba(255,255,255,0.05);
  --card: #16181b;
  --border: rgba(255,255,255,0.08);
  --border-strong: rgba(255,255,255,0.16);
  --text: #ececef;
  --text-muted: #a1a1aa;
  --muted: #8b8b94;
  --accent: #e1452f;
  --accent-subtle: rgba(225,69,47,0.16);
  --font-body: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif;
}
* { box-sizing: border-box; }
html, body, #root { height: 100%; margin: 0; padding: 0; background: var(--bg); color: var(--text); font-family: var(--font-body); }
.shell { display: grid; grid-template-columns: 260px 1fr; height: 100vh; min-height: 100vh; }
.side {
  background: #0a0b0d;
  border-right: 1px solid var(--border);
  display: flex; flex-direction: column;
  padding: 12px;
}
.side-head { display: flex; align-items: center; justify-content: space-between; padding: 6px 6px 12px; }
.brand { display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 14px; }
.brand-mark {
  width: 26px; height: 26px; border-radius: 7px;
  background: linear-gradient(135deg, #ef4f37, #b22a17);
  display: flex; align-items: center; justify-content: center;
  color: white; font-weight: 700; font-size: 12px;
  box-shadow: 0 4px 14px rgba(225,69,47,0.35);
}
.icon-btn {
  border: 1px solid transparent; background: transparent;
  color: var(--text-muted); cursor: pointer;
  width: 30px; height: 30px; border-radius: 7px;
  display: inline-flex; align-items: center; justify-content: center;
  transition: background 120ms ease, color 120ms ease;
}
.icon-btn:hover { background: var(--bg-hover); color: var(--text); }
.new-chat {
  display: flex; align-items: center; gap: 8px;
  width: 100%; padding: 9px 12px; margin-bottom: 12px;
  background: transparent; color: var(--text);
  border: 1px solid var(--border-strong); border-radius: 10px;
  font-size: 13px; font-weight: 500; cursor: pointer;
  transition: background 120ms ease;
}
.new-chat:hover { background: var(--bg-hover); }
.side-section { font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--muted); padding: 12px 8px 6px; }
.side-list { list-style: none; padding: 0; margin: 0; flex: 1; overflow-y: auto; }
.side-list li {
  padding: 8px 10px; border-radius: 8px; font-size: 13px;
  color: var(--text-muted); cursor: pointer; display: flex; align-items: center; gap: 8px;
  margin-bottom: 1px;
  transition: background 120ms ease, color 120ms ease;
}
.side-list li:hover { background: var(--bg-hover); color: var(--text); }
.side-list li.active { background: var(--bg-elevated); color: var(--text); }
.side-foot { display: flex; align-items: center; gap: 10px; padding: 10px 8px; border-top: 1px solid var(--border); margin-top: 8px; }
.avatar-sm { width: 28px; height: 28px; border-radius: 50%; background: #4a4a52; color: white; font-size: 12px; font-weight: 600; display: flex; align-items: center; justify-content: center; }
.user-meta { font-size: 12px; color: var(--text-muted); }
.user-meta strong { display: block; color: var(--text); font-weight: 500; font-size: 13px; }

.main { display: flex; flex-direction: column; min-width: 0; height: 100vh; }
.top {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 16px;
  border-bottom: 1px solid var(--border);
  background: rgba(13,14,16,0.7); backdrop-filter: blur(12px);
}
.top-title { font-size: 13px; color: var(--text-muted); display: flex; align-items: center; gap: 8px; }
.dot { width: 6px; height: 6px; border-radius: 50%; background: #38d49a; box-shadow: 0 0 8px rgba(56,212,154,0.6); }

.thread { flex: 1; overflow-y: auto; padding: 24px 0 0; }
.thread-inner { width: 100%; }
.group { max-width: 768px; margin: 0 auto 22px; padding: 0 24px; display: flex; gap: 12px; }
.group.user { justify-content: flex-end; }
.avatar {
  width: 28px; height: 28px; border-radius: 50%;
  flex-shrink: 0; display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, #ef4f37, #b22a17);
  color: white; font-size: 12px; font-weight: 600;
}
.bubble { line-height: 1.65; font-size: 15px; color: var(--text); position: relative; }
.bubble.assistant { background: transparent; border: none; padding: 0; max-width: calc(768px - 28px - 12px - 48px); }
.user .bubble {
  background: rgba(22,24,27,0.7);
  border: 1px solid rgba(255,255,255,0.10);
  border-radius: 18px;
  padding: 10px 16px;
  max-width: 80%;
}
.bubble code {
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace;
  background: rgba(255,255,255,0.06);
  padding: 1px 6px; border-radius: 5px;
  font-size: 0.9em;
}
.codeblock {
  background: #0a0b0d;
  border: 1px solid var(--border);
  border-radius: 12px;
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace;
  font-size: 13px;
  margin: 12px 0;
  overflow: hidden;
}
.codeblock-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 6px 12px;
  background: rgba(255,255,255,0.025);
  border-bottom: 1px solid var(--border);
  color: var(--muted); font-size: 11px;
  font-family: var(--font-body);
}
.codeblock-body { padding: 12px 14px; color: #d8d8dc; line-height: 1.55; }
.kw { color: #c084fc; }
.str { color: #f0a771; }
.fn { color: #74c5ff; }
.com { color: #6b6b76; font-style: italic; }
.action-btn {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 3px 7px; border-radius: 6px;
  background: transparent; border: none; color: var(--muted);
  font-size: 11px; cursor: pointer; font-family: var(--font-body);
  transition: color 120ms ease, background 120ms ease;
}
.action-btn:hover { color: var(--text); background: var(--bg-hover); }
.msg-actions { margin-top: 8px; display: flex; gap: 4px; opacity: 0.6; }

.streaming-caret::after {
  content: ""; display: inline-block;
  width: 8px; height: 1.05em; margin-left: 2px;
  vertical-align: -2px; background: var(--accent);
  border-radius: 1px;
  animation: cursorblink 1s steps(2, end) infinite;
}
@keyframes cursorblink {
  0%, 50% { opacity: 1; }
  50.01%, 100% { opacity: 0; }
}

.compose-wrap {
  margin: 0 auto; width: 100%; max-width: 768px;
  padding: 16px 12px 18px;
  background: linear-gradient(to bottom, transparent, var(--bg) 30%);
  position: sticky; bottom: 0;
}
.composer {
  position: relative;
  background: rgba(22,24,27,0.92);
  border: 1px solid rgba(255,255,255,0.16);
  border-radius: 22px;
  padding: 0;
  box-shadow:
    0 1px 0 rgba(255,255,255,0.04) inset,
    0 10px 30px rgba(0,0,0,0.35);
  transition: border-color 150ms ease, box-shadow 150ms ease;
}
.composer:focus-within {
  border-color: rgba(225,69,47,0.55);
  box-shadow:
    0 0 0 3px rgba(225,69,47,0.18),
    0 12px 32px rgba(0,0,0,0.4);
}
.composer textarea {
  width: 100%; min-height: 44px; max-height: 200px;
  resize: none; padding: 14px 18px 10px;
  border: none; background: transparent;
  color: var(--text); font-size: 15px; line-height: 1.5;
  outline: none; font-family: var(--font-body);
}
.composer textarea::placeholder { color: var(--muted); }
.toolbar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 6px 10px 8px;
  border-top: 1px solid rgba(255,255,255,0.05);
}
.toolbar-side { display: flex; align-items: center; gap: 4px; }
.tool-btn {
  background: transparent; border: none; color: var(--muted);
  width: 30px; height: 30px; border-radius: 8px;
  cursor: pointer; display: inline-flex; align-items: center; justify-content: center;
  transition: background 120ms ease, color 120ms ease;
}
.tool-btn:hover { background: var(--bg-hover); color: var(--text); }
.send-btn {
  background: var(--text); color: var(--bg);
  border: none; width: 32px; height: 32px; border-radius: 50%;
  display: inline-flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: transform 120ms ease, background 120ms ease;
}
.send-btn:hover { transform: translateY(-1px); background: color-mix(in srgb, var(--text) 80%, var(--accent)); }
.send-btn:disabled { background: rgba(255,255,255,0.18); color: rgba(0,0,0,0.4); cursor: not-allowed; transform: none; }

.hint { text-align: center; color: var(--muted); font-size: 11px; margin-top: 8px; }
`;

function CodeBlock() {
  return (
    <div className="codeblock">
      <div className="codeblock-head">
        <span>typescript</span>
        <button className="action-btn">
          <Copy size={12} />
          Copy
        </button>
      </div>
      <div className="codeblock-body">
        <div>
          <span className="com">{`// debounce: delay execution until input settles`}</span>
        </div>
        <div>
          <span className="kw">function</span> <span className="fn">debounce</span>
          {`<T extends (...args: any[]) => void>(`}
        </div>
        <div style={{ paddingLeft: 14 }}>fn: T, delay = <span className="str">300</span></div>
        <div>) {"{"}</div>
        <div style={{ paddingLeft: 14 }}>
          <span className="kw">let</span> timer: ReturnType{`<typeof setTimeout>`} | undefined;
        </div>
        <div style={{ paddingLeft: 14 }}>
          <span className="kw">return</span> (...args: Parameters{`<T>`}) =&gt; {"{"}
        </div>
        <div style={{ paddingLeft: 28 }}>
          <span className="kw">if</span> (timer) <span className="fn">clearTimeout</span>(timer);
        </div>
        <div style={{ paddingLeft: 28 }}>
          timer = <span className="fn">setTimeout</span>(() =&gt; <span className="fn">fn</span>(...args), delay);
        </div>
        <div style={{ paddingLeft: 14 }}>{"};"}</div>
        <div>{"}"}</div>
      </div>
    </div>
  );
}

export function Chat() {
  const [draft, setDraft] = useState("");

  return (
    <>
      <style>{CSS}</style>
      <div className="shell">
        {/* Sidebar */}
        <aside className="side">
          <div className="side-head">
            <div className="brand">
              <div className="brand-mark">O</div>
              OpenClaw
            </div>
            <button className="icon-btn" aria-label="Collapse">
              <ChevronLeft size={16} />
            </button>
          </div>

          <button className="new-chat">
            <Plus size={14} />
            New chat
          </button>

          <div className="side-section">Today</div>
          <ul className="side-list">
            <li className="active">
              <MessageSquare size={14} />
              Debounce helper review
            </li>
            <li>
              <MessageSquare size={14} />
              Weekly planning notes
            </li>
            <li>
              <MessageSquare size={14} />
              Travel itinerary draft
            </li>
            <div className="side-section">Yesterday</div>
            <li>
              <MessageSquare size={14} />
              Refactor the auth flow
            </li>
            <li>
              <MessageSquare size={14} />
              Idea for landing page
            </li>
            <li>
              <MessageSquare size={14} />
              Sunday meal prep
            </li>
          </ul>

          <div className="side-foot">
            <div className="avatar-sm">SR</div>
            <div className="user-meta">
              <strong>Sean</strong>
              Pro plan
            </div>
            <button className="icon-btn" style={{ marginLeft: "auto" }} aria-label="Settings">
              <SettingsIcon size={14} />
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="main">
          <header className="top">
            <div className="top-title">
              <Sparkles size={14} />
              Debounce helper review
            </div>
            <div className="top-title">
              <span className="dot" />
              Connected
            </div>
          </header>

          <div className="thread">
            <div className="thread-inner">
              {/* User message */}
              <div className="group user">
                <div className="bubble">
                  Can you write a small TypeScript helper that <code>debounce</code>s a function?
                  Make it generic and let me set the delay.
                </div>
              </div>

              {/* Assistant message */}
              <div className="group">
                <div className="avatar">O</div>
                <div className="bubble assistant">
                  Sure — here's a tiny, type-safe debounce. It clears any pending call before
                  scheduling the next one, so the wrapped function only runs after the input
                  settles for <code>delay</code> milliseconds.
                  <CodeBlock />
                  A few notes:
                  <ul style={{ paddingLeft: 18, margin: "8px 0" }}>
                    <li>
                      The generic <code>T</code> preserves the original argument types — calls to
                      the returned function are fully type-checked.
                    </li>
                    <li>
                      Because <code>timer</code> lives in the closure, each debounced function gets
                      its own independent timer.
                    </li>
                    <li>
                      Use <code>300ms</code> for typing-driven UI like search; bump it to{" "}
                      <code>500–800ms</code> if you're hitting an expensive API.
                    </li>
                  </ul>
                  <div className="msg-actions">
                    <button className="action-btn">
                      <Copy size={11} /> Copy
                    </button>
                    <button className="action-btn">Regenerate</button>
                  </div>
                </div>
              </div>

              {/* User follow-up */}
              <div className="group user">
                <div className="bubble">
                  Nice. Can you add a <code>cancel()</code> method too, in case I unmount the
                  component before the timer fires?
                </div>
              </div>

              {/* Assistant streaming */}
              <div className="group">
                <div className="avatar">O</div>
                <div className="bubble assistant">
                  Good call — leaking a timer after unmount can cause "setState on unmounted
                  component" warnings. I'll attach a <code>cancel</code> method to the returned
                  function so you can clear the pending invocation from a cleanup effect
                  <span className="streaming-caret" />
                </div>
              </div>
            </div>

            {/* Composer */}
            <div className="compose-wrap">
              <div className="composer">
                <textarea
                  rows={1}
                  placeholder="Message OpenClaw…"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                />
                <div className="toolbar">
                  <div className="toolbar-side">
                    <button className="tool-btn" aria-label="Attach">
                      <Paperclip size={16} />
                    </button>
                    <button className="tool-btn" aria-label="Voice">
                      <Mic size={16} />
                    </button>
                  </div>
                  <div className="toolbar-side">
                    <button
                      className="send-btn"
                      aria-label="Send"
                      disabled={draft.trim().length === 0}
                    >
                      <ArrowUp size={16} strokeWidth={2.4} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="hint">OpenClaw can make mistakes. Verify important info.</div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
