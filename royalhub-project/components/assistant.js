/* ============================================================
   COMPONENT: ROYAL ASSIST
   ============================================================ */

const ASSIST_SUGGESTIONS = ["What is due soon?", "Track my claim", "Explain my goals", "Find my policy", "What does my financial health mean?"];

function initAssistDrawer() {
  const drawer = document.getElementById("assist-drawer");
  drawer.innerHTML = `
    <div class="assist-head">
      <div>
        <h3>${ICONS.sparkle} ROYAL ASSIST</h3>
        <p>Your financial companion</p>
      </div>
      <button class="modal-close" id="close-assist" style="color:rgba(255,255,255,0.8);">${ICONS.close}</button>
    </div>
    <div class="assist-body" id="assist-body"></div>
    <div class="assist-suggestions" id="assist-suggestions">
      ${ASSIST_SUGGESTIONS.map(s => `<button class="assist-chip" data-prompt="${s}">${s}</button>`).join("")}
    </div>
    <div class="assist-input-row">
      <input type="text" id="assist-input" placeholder="Ask Royal Assist...">
      <button class="assist-send" id="assist-send-btn">${ICONS.arrowRight}</button>
    </div>
  `;

  addAssistMessage("bot", "Hi Lerato 👋\n\nI can help you understand your reminders, find documents, track claims or navigate RoyalHub.");

  document.getElementById("close-assist").addEventListener("click", closeAssistDrawer);
  document.getElementById("assist-suggestions").querySelectorAll("[data-prompt]").forEach(btn => {
    btn.addEventListener("click", () => handleAssistPrompt(btn.dataset.prompt));
  });
  document.getElementById("assist-send-btn").addEventListener("click", sendAssistInput);
  document.getElementById("assist-input").addEventListener("keydown", (e) => { if (e.key === "Enter") sendAssistInput(); });
}

function sendAssistInput() {
  const input = document.getElementById("assist-input");
  const val = input.value.trim();
  if (!val) return;
  input.value = "";
  handleAssistPrompt(val);
}

function handleAssistPrompt(prompt) {
  addAssistMessage("user", prompt);
  setTimeout(() => addAssistMessage("bot", getAssistResponse(prompt)), 450);
}

function getAssistResponse(prompt) {
  const p = prompt.toLowerCase();
  if (p.includes("due soon") || p.includes("due")) {
    const items = DEMO_DATA.attention.map(a => `• ${a.title} — ${a.dateLabel}`).join("\n");
    return `You have ${DEMO_DATA.attention.length} important actions in the next 30 days:\n\n${items}\n\nWould you like to see them?`;
  }
  if (p.includes("claim")) {
    const c = DEMO_DATA.claims[0];
    return `Claim ${c.id} with ${c.insurer} is currently "${c.status}".\n\nNext expected action: ${c.nextAction}.\n\nI'll let you know the moment it moves forward.`;
  }
  if (p.includes("goal")) {
    const g = DEMO_DATA.goals.map(g => `• ${g.name}: ${Math.round(g.current/g.target*100)}% (${g.status})`).join("\n");
    return `Here's where your goals stand:\n\n${g}\n\nYour goals reflect the things you're saving toward — home, education, holidays and more.`;
  }
  if (p.includes("polic")) {
    return `I found a few policy documents in your vault — Motor Insurance (Santam) and Life Insurance (Liberty). Want me to open the Documents page?`;
  }
  if (p.includes("financial health") || p.includes("health mean")) {
    return `Your Financial Health score (78/100) blends four areas — Protection, Savings, Goals and Documents — into one number, so you can see your overall position at a glance. It's a helpful summary, not formal financial advice.`;
  }
  return `I can help explain the information shown in RoyalHub, like your goals, reminders, claims and documents. For regulated financial advice, I'll connect you with your Royal Square adviser.`;
}

function addAssistMessage(role, text) {
  const body = document.getElementById("assist-body");
  const msg = document.createElement("div");
  msg.className = `assist-msg ${role}`;
  msg.textContent = text;
  body.appendChild(msg);
  body.scrollTop = body.scrollHeight;
}

function openAssistDrawer() {
  document.getElementById("assist-drawer").classList.add("open");
  document.getElementById("drawer-scrim").classList.add("show");
}
function closeAssistDrawer() {
  document.getElementById("assist-drawer").classList.remove("open");
  document.getElementById("drawer-scrim").classList.remove("show");
}
