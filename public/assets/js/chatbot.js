// Velcorix site assistant.
//
// Self-contained on purpose: it injects its own styles and markup so that
// adding it to a page needs one script tag and nothing else. There is no build
// step on this site and every <head> is hand-copied across 41 pages, so the
// fewer places this has to be repeated, the less it can drift.

(function () {
  "use strict";

  // TODO: confirm this is the number Velcorix wants published before merging.
  var WHATSAPP_NUMBER = "971507865348";
  var WHATSAPP_URL =
    "https://wa.me/" +
    WHATSAPP_NUMBER +
    "?text=" +
    encodeURIComponent("Hello Velcorix, I have an enquiry.");

  var GREETING =
    "Hello. I can answer questions about Velcorix's services, equipment rentals, shutdown management and consultancy. What are you looking for?";
  var MAX_TURNS = 12; // must not exceed the ceiling in api/chat.js
  var MAX_CHARS = 1000;

  // Depth of this page relative to the site root, so links work from both
  // /index.html and /services/hot-tapping.html.
  var ROOT = window.location.pathname.split("/").length > 2 ? "../" : "";

  var STYLES = [
    ".vx-chat-toggle{position:fixed;right:20px;bottom:20px;z-index:1040;width:56px;height:56px;border:0;border-radius:50%;background:var(--primary-color,#0b2a3c);color:#fff;font-size:22px;line-height:1;cursor:pointer;box-shadow:0 6px 20px rgba(11,42,60,.32);transition:transform .18s ease}",
    ".vx-chat-toggle:hover{transform:scale(1.06)}",
    ".vx-chat-toggle:focus-visible{outline:3px solid var(--accent-color,#c7a14a);outline-offset:3px}",
    ".vx-chat-panel{position:fixed;right:20px;bottom:88px;z-index:1041;display:none;flex-direction:column;width:360px;max-width:calc(100vw - 40px);height:520px;max-height:calc(100vh - 120px);background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 12px 40px rgba(11,42,60,.28);font-family:'Open Sans',sans-serif}",
    ".vx-chat-panel.vx-open{display:flex}",
    ".vx-chat-head{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;background:var(--primary-color,#0b2a3c);color:#fff}",
    ".vx-chat-head strong{font-family:'Poppins',sans-serif;font-size:15px;font-weight:600}",
    ".vx-chat-head small{display:block;font-size:11px;opacity:.75}",
    ".vx-chat-close{border:0;background:transparent;color:#fff;font-size:20px;line-height:1;cursor:pointer;padding:4px 6px;border-radius:4px}",
    ".vx-chat-close:hover{background:rgba(255,255,255,.14)}",
    ".vx-chat-log{flex:1;overflow-y:auto;padding:16px;background:var(--bg-light,#f5f7fa);display:flex;flex-direction:column;gap:10px}",
    ".vx-msg{max-width:85%;padding:9px 13px;border-radius:12px;font-size:14px;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere}",
    ".vx-msg-bot{align-self:flex-start;background:#fff;color:var(--text-color,#1f2933);border:1px solid #e3e8ef;border-bottom-left-radius:3px}",
    ".vx-msg-user{align-self:flex-end;background:var(--primary-color,#0b2a3c);color:#fff;border-bottom-right-radius:3px}",
    ".vx-msg-error{align-self:flex-start;background:#fdf2f2;color:#8a2b2b;border:1px solid #f3d2d2;font-size:13px}",
    ".vx-typing{align-self:flex-start;display:flex;gap:4px;padding:11px 13px;background:#fff;border:1px solid #e3e8ef;border-radius:12px;border-bottom-left-radius:3px}",
    ".vx-typing span{width:6px;height:6px;border-radius:50%;background:var(--secondary-color,#4a5560);animation:vx-bounce 1.3s infinite}",
    ".vx-typing span:nth-child(2){animation-delay:.18s}.vx-typing span:nth-child(3){animation-delay:.36s}",
    "@keyframes vx-bounce{0%,60%,100%{opacity:.32;transform:translateY(0)}30%{opacity:1;transform:translateY(-4px)}}",
    ".vx-chat-foot{border-top:1px solid #e3e8ef;background:#fff}",
    ".vx-chat-form{display:flex;gap:8px;padding:10px 12px}",
    ".vx-chat-form textarea{flex:1;resize:none;border:1px solid #d6dce5;border-radius:8px;padding:9px 11px;font:inherit;font-size:14px;max-height:96px}",
    ".vx-chat-form textarea:focus{outline:0;border-color:var(--accent-color,#c7a14a)}",
    ".vx-chat-form button{border:0;border-radius:8px;padding:0 15px;background:var(--accent-color,#c7a14a);color:#0b2a3c;font-weight:600;cursor:pointer}",
    ".vx-chat-form button:disabled{opacity:.5;cursor:not-allowed}",
    ".vx-chat-links{display:flex;gap:14px;padding:0 14px 10px;font-size:12px}",
    ".vx-chat-links a{color:var(--secondary-color,#4a5560);text-decoration:none}",
    ".vx-chat-links a:hover{color:var(--primary-color,#0b2a3c);text-decoration:underline}",
    ".vx-chat-note{padding:0 14px 10px;font-size:11px;color:#7b8794}",
    "@media(max-width:480px){.vx-chat-panel{right:12px;left:12px;bottom:80px;width:auto;height:calc(100vh - 140px)}.vx-chat-toggle{right:14px;bottom:14px}}",
    "@media(prefers-reduced-motion:reduce){.vx-chat-toggle,.vx-typing span{transition:none;animation:none}}",
  ].join("");

  // Conversation as sent to the API. Excludes the greeting, which is canned.
  var history = [];
  var busy = false;
  var panel, log, input, sendBtn, toggle;

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function scrollDown() {
    log.scrollTop = log.scrollHeight;
  }

  function addMessage(role, text) {
    var node = el("div", "vx-msg vx-msg-" + role, text);
    log.appendChild(node);
    scrollDown();
    return node;
  }

  function showTyping() {
    var node = el("div", "vx-typing");
    node.appendChild(el("span"));
    node.appendChild(el("span"));
    node.appendChild(el("span"));
    log.appendChild(node);
    scrollDown();
    return node;
  }

  function setBusy(state) {
    busy = state;
    sendBtn.disabled = state;
    input.disabled = state;
  }

  async function send(text) {
    addMessage("user", text);
    history.push({ role: "user", text: text });

    // Keep the tail only, so a long chat cannot breach the server's ceiling.
    if (history.length > MAX_TURNS) history = history.slice(-MAX_TURNS);

    setBusy(true);
    var typing = showTyping();

    try {
      var response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      var data = await response.json().catch(function () {
        return {};
      });
      typing.remove();

      if (!response.ok) {
        // Drop the failed turn so a retry does not resend it twice.
        history.pop();
        addMessage("error", data.error || "Something went wrong. Please try the contact page.");
        return;
      }

      addMessage("bot", data.reply);
      history.push({ role: "model", text: data.reply });
    } catch (err) {
      typing.remove();
      history.pop();
      addMessage("error", "I couldn't reach the assistant. Please check your connection or use the contact page.");
    } finally {
      setBusy(false);
      input.focus();
    }
  }

  function build() {
    var style = el("style");
    style.textContent = STYLES;
    document.head.appendChild(style);

    toggle = el("button", "vx-chat-toggle");
    toggle.type = "button";
    toggle.setAttribute("aria-label", "Open chat with Velcorix");
    toggle.setAttribute("aria-expanded", "false");
    toggle.innerHTML = '<i class="fas fa-comment-dots" aria-hidden="true"></i>';

    panel = el("div", "vx-chat-panel");
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "Chat with Velcorix");

    var head = el("div", "vx-chat-head");
    var heading = el("div");
    heading.appendChild(el("strong", null, "Velcorix Assistant"));
    heading.appendChild(el("small", null, "Typically replies instantly"));
    var close = el("button", "vx-chat-close", "×");
    close.type = "button";
    close.setAttribute("aria-label", "Close chat");
    head.appendChild(heading);
    head.appendChild(close);

    log = el("div", "vx-chat-log");
    log.setAttribute("role", "log");
    log.setAttribute("aria-live", "polite");

    var foot = el("div", "vx-chat-foot");
    var form = el("form", "vx-chat-form");
    input = el("textarea");
    input.rows = 1;
    input.maxLength = MAX_CHARS;
    input.placeholder = "Ask about our services or rentals…";
    input.setAttribute("aria-label", "Your message");
    sendBtn = el("button", null, "Send");
    sendBtn.type = "submit";
    form.appendChild(input);
    form.appendChild(sendBtn);

    var links = el("div", "vx-chat-links");
    var whatsapp = el("a", null, "WhatsApp us");
    whatsapp.href = WHATSAPP_URL;
    whatsapp.target = "_blank";
    whatsapp.rel = "noopener";
    var contact = el("a", null, "Contact page");
    contact.href = ROOT + "contact.html";
    links.appendChild(whatsapp);
    links.appendChild(contact);

    foot.appendChild(form);
    foot.appendChild(links);
    foot.appendChild(
      el("div", "vx-chat-note", "AI assistant — please confirm details with our team.")
    );

    panel.appendChild(head);
    panel.appendChild(log);
    panel.appendChild(foot);
    document.body.appendChild(toggle);
    document.body.appendChild(panel);

    addMessage("bot", GREETING);

    toggle.addEventListener("click", function () {
      var open = panel.classList.toggle("vx-open");
      toggle.setAttribute("aria-expanded", String(open));
      if (open) input.focus();
    });

    close.addEventListener("click", function () {
      panel.classList.remove("vx-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.focus();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && panel.classList.contains("vx-open")) {
        panel.classList.remove("vx-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });

    input.addEventListener("input", function () {
      input.style.height = "auto";
      input.style.height = Math.min(input.scrollHeight, 96) + "px";
    });

    input.addEventListener("keydown", function (event) {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        form.requestSubmit();
      }
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var text = input.value.trim();
      if (!text || busy) return;
      input.value = "";
      input.style.height = "auto";
      send(text);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build);
  } else {
    build();
  }
})();
