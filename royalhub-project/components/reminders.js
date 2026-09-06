/* ============================================================
   COMPONENT: REMINDERS + AUTOMATION BUILDER
   ============================================================ */

let reminderFilter = "all";

const REMINDER_STATUS_META = {
  "due-soon": { icon: "clock", label: "Due soon" },
  "overdue": { icon: "alert", label: "Overdue" },
  "completed": { icon: "check", label: "Completed" },
  "upcoming": { icon: "calendar", label: "Upcoming" }
};

function renderReminders() {
  const t = getTranslation();
  const el = document.getElementById("screen-reminders");
  el.innerHTML = `
    <div class="section-head">
      <div>
        <h1 style="font-size:24px;">${t.reminders}</h1>
        <p class="section-sub">${t.nothingSlips}</p>
      </div>
      <button class="btn btn-primary" id="create-automation-btn">${ICONS.plusCircle} Create Automation</button>
    </div>
    <div class="tab-row" id="reminder-tabs">
      ${["all","due-soon","overdue","completed","automated"].map(f => `
        <button class="tab-btn ${reminderFilter === f ? "active" : ""}" data-filter="${f}">${filterLabel(f)}</button>`).join("")}
    </div>
    <div class="reminder-list" id="reminder-list"></div>
  `;
  renderReminderList();
  el.querySelectorAll("[data-filter]").forEach(btn => btn.addEventListener("click", () => {
    reminderFilter = btn.dataset.filter;
    renderReminders();
  }));
  document.getElementById("create-automation-btn").addEventListener("click", openAutomationBuilder);
}

function filterLabel(f) {
  return { all: "All", "due-soon": "Due Soon", overdue: "Overdue", completed: "Completed", automated: "Automated" }[f];
}

function renderReminderList() {
  const list = document.getElementById("reminder-list");
  let items = DEMO_DATA.reminders;
  if (reminderFilter === "automated") items = items.filter(r => r.automated);
  else if (reminderFilter !== "all") items = items.filter(r => r.status === reminderFilter);

  if (items.length === 0) {
    list.innerHTML = `<div class="empty-state">${ICONS.bell}<h4>Nothing here right now</h4><p>Reminders matching this filter will appear here.</p></div>`;
    return;
  }

  list.innerHTML = items.map(r => {
    const meta = REMINDER_STATUS_META[r.status];
    return `
      <div class="card reminder-card">
        <div class="rem-icon ${r.status}">${ICONS[meta.icon]}</div>
        <div class="rem-body">
          <div class="rem-title-row">
            <span class="priority-flag ${r.priority}"></span>
            ${r.title}
            ${r.automated ? `<span class="auto-badge">AUTOMATED</span>` : ""}
          </div>
          <div class="rem-meta">
            <span>${r.dueLabel}</span>
            <span>Recipient: ${r.recipient}</span>
            <span>${meta.label}</span>
          </div>
        </div>
        ${r.status !== "completed" ? `<button class="btn btn-secondary btn-sm" data-mark-done="${r.id}">Mark done</button>` : ""}
      </div>`;
  }).join("");

  list.querySelectorAll("[data-mark-done]").forEach(btn => btn.addEventListener("click", () => {
    const rem = DEMO_DATA.reminders.find(r => r.id === btn.dataset.markDone);
    rem.status = "completed";
    showToast("Reminder updated.", "success");
    renderReminderList();
  }));
}

/* ---------- Automation builder ---------- */
function openAutomationBuilder() {
  openModal(`
    <div class="modal-head">
      <h3>Create Automation</h3>
      <button class="modal-close" data-close-modal>${ICONS.close}</button>
    </div>
    <p class="modal-sub">Set up a rule once — RoyalHub handles the chasing from here.</p>

    <div class="field">
      <label>WHEN</label>
      <select id="auto-when">
        <option>30 days before driving licence expiry</option>
        <option>60 days before insurance renewal</option>
        <option>7 days before annual review</option>
        <option>On client birthday</option>
      </select>
    </div>
    <div class="field">
      <label>THEN</label>
      <select id="auto-then">
        <option>Send reminder</option>
        <option>Send reminder + create adviser task</option>
      </select>
    </div>
    <div class="field">
      <label>TO</label>
      <div class="radio-row" id="auto-to">
        <button class="radio-chip selected" data-to="Client">Client</button>
        <button class="radio-chip" data-to="Adviser">Adviser</button>
        <button class="radio-chip" data-to="Both">Both</button>
      </div>
    </div>
    <div class="field">
      <label>CHANNEL</label>
      <div class="radio-row" id="auto-channel" style="flex-wrap:wrap;">
        <button class="radio-chip selected" data-channel="WhatsApp">WhatsApp</button>
        <button class="radio-chip" data-channel="Email">Email</button>
        <button class="radio-chip" data-channel="SMS">SMS</button>
        <button class="radio-chip" data-channel="In-app">In-app</button>
      </div>
    </div>

    <div class="section-sub" style="margin:20px 0 8px;font-weight:600;">Preview</div>
    <div class="automation-flow" id="automation-preview"></div>

    <div class="modal-footer">
      <button class="btn btn-tertiary" data-close-modal>Cancel</button>
      <button class="btn btn-primary" id="save-automation-btn">Save automation</button>
    </div>
  `);

  const toRow = document.getElementById("auto-to");
  const chanRow = document.getElementById("auto-channel");
  [toRow, chanRow].forEach(row => {
    row.querySelectorAll("button").forEach(b => b.addEventListener("click", () => {
      row.querySelectorAll("button").forEach(x => x.classList.remove("selected"));
      b.classList.add("selected");
      updateAutomationPreview();
    }));
  });
  document.getElementById("auto-when").addEventListener("change", updateAutomationPreview);
  document.getElementById("auto-then").addEventListener("change", updateAutomationPreview);
  document.getElementById("save-automation-btn").addEventListener("click", () => {
    closeModal();
    showToast("Automation created.", "success");
  });
  updateAutomationPreview();
}

function updateAutomationPreview() {
  const when = document.getElementById("auto-when").value;
  const then = document.getElementById("auto-then").value;
  const to = document.getElementById("auto-to").querySelector(".selected").dataset.to;
  const channel = document.getElementById("auto-channel").querySelector(".selected").dataset.channel;
  document.getElementById("automation-preview").innerHTML = `
    <div class="flow-node"><div class="fn-label">TRIGGER</div><div class="fn-value">${when}</div></div>
    <span class="flow-connector">${ICONS.arrowRight}</span>
    <div class="flow-node"><div class="fn-label">ACTION</div><div class="fn-value">${then}</div></div>
    <span class="flow-connector">${ICONS.arrowRight}</span>
    <div class="flow-node"><div class="fn-label">SEND TO</div><div class="fn-value">${to} · ${channel}</div></div>
  `;
}
