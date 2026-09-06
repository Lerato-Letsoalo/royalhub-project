/* ============================================================
   COMPONENT: GOALS
   ============================================================ */

const GOAL_ICON_OPTIONS = [
  { id: "home", label: "Home" }, { id: "cap", label: "Education" },
  { id: "sun", label: "Holiday" }, { id: "family", label: "Family" },
  { id: "car", label: "Vehicle" }, { id: "target", label: "Other" }
];

function renderGoalCard(g) {
  const pct = Math.round((g.current / g.target) * 100);
  const owners = g.shared ? `
    <div class="goal-owners">
      ${g.owners.map(o => `<span class="avatar avatar-sm" title="${o.name}">${o.initials}</span>`).join("")}
    </div>` : "";
  return `
    <div class="card goal-card">
      <div class="goal-card-top">
        <div class="goal-icon-badge">${ICONS[g.icon] || ICONS.target}</div>
        <span class="status-chip ${g.statusTone}">${g.status}</span>
      </div>
      <div>
        <div class="goal-name">${g.name}${g.shared ? " · Shared" : ""}</div>
        <div class="goal-pct">${pct}%</div>
      </div>
      <div class="goal-bar-track"><div class="goal-bar-fill" data-width="${pct}%"></div></div>
      <div class="goal-amounts"><span>${formatCurrency(g.current)}</span><span>${formatCurrency(g.target)}</span></div>
      <div class="goal-meta-grid">
        <div>Target date<strong>${g.targetDate}</strong></div>
        <div>Monthly contribution<strong>${formatCurrency(g.monthly)}</strong></div>
      </div>
      ${g.shared ? `<div style="display:flex;justify-content:space-between;align-items:center;border-top:1px dashed var(--border);padding-top:12px;"><span style="font-size:12.5px;color:var(--ink-soft);">Owners</span>${owners}</div>` : ""}
    </div>`;
}

function renderGoals() {
  const t = getTranslation();
  const el = document.getElementById("screen-goals");
  el.innerHTML = `
    <h1 style="font-size:24px;">${t.makeVisible}</h1>
    <p class="section-sub" style="margin-top:6px;">${t.goalSubtitle}</p>
    <div class="goals-grid">
      ${DEMO_DATA.goals.map(renderGoalCard).join("")}
      <button class="add-goal-card" id="add-goal-btn">${ICONS.plusCircle}<span>Add a new goal</span></button>
    </div>
  `;
  animateBars(el);
  document.getElementById("add-goal-btn").addEventListener("click", openGoalWizard);
}

/* ---------- Add Goal wizard ---------- */
let goalWizardState = {};

function openGoalWizard() {
  goalWizardState = { step: 1, name: "", icon: "target", amount: "", date: "", monthly: "" };
  openModal(renderGoalWizardModal());
  renderWizardStepBody();
  bindWizardNav();
}

function renderGoalWizardModal() {
  return `
    <div class="modal-head">
      <h3>Add a new goal</h3>
      <button class="modal-close" data-close-modal>${ICONS.close}</button>
    </div>
    <div class="wizard-steps">
      ${[1,2,3,4,5].map(n => `<div class="wizard-dot ${n < goalWizardState.step ? "done" : ""} ${n === goalWizardState.step ? "active" : ""}"></div>`).join("")}
    </div>
    <div class="wizard-body" id="wizard-body"></div>
    <div class="wizard-nav">
      <button class="btn btn-tertiary" id="wizard-back" ${goalWizardState.step === 1 ? "disabled" : ""}>Back</button>
      <button class="btn btn-primary" id="wizard-next">${goalWizardState.step === 5 ? "Create goal" : "Continue"}</button>
    </div>
  `;
}

function renderWizardStepBody() {
  const s = goalWizardState;
  const body = document.getElementById("wizard-body");
  if (s.step === 1) {
    body.innerHTML = `
      <label style="font-weight:600;font-size:14.5px;display:block;margin-bottom:14px;">What are you saving for?</label>
      <div class="choice-grid">
        ${GOAL_ICON_OPTIONS.map(o => `
          <button class="choice-card ${s.icon === o.id ? "selected" : ""}" data-icon="${o.id}">
            ${ICONS[o.id]}<span>${o.label}</span>
          </button>`).join("")}
      </div>
      <div class="field" style="margin-top:16px;">
        <label>Goal name</label>
        <input type="text" id="wiz-name" value="${s.name}" placeholder="e.g. New car" />
      </div>`;
    body.querySelectorAll("[data-icon]").forEach(btn => btn.addEventListener("click", () => {
      s.icon = btn.dataset.icon;
      renderWizardStepBody();
    }));
  } else if (s.step === 2) {
    body.innerHTML = `
      <label style="font-weight:600;font-size:14.5px;display:block;margin-bottom:14px;">Target amount</label>
      <div class="field"><label>Amount (R)</label><input type="number" id="wiz-amount" value="${s.amount}" placeholder="e.g. 150000" /></div>`;
  } else if (s.step === 3) {
    body.innerHTML = `
      <label style="font-weight:600;font-size:14.5px;display:block;margin-bottom:14px;">Target date</label>
      <div class="field"><label>When do you want to reach this?</label><input type="month" id="wiz-date" value="${s.date}" /></div>`;
  } else if (s.step === 4) {
    body.innerHTML = `
      <label style="font-weight:600;font-size:14.5px;display:block;margin-bottom:14px;">Monthly contribution</label>
      <div class="field"><label>Amount per month (R)</label><input type="number" id="wiz-monthly" value="${s.monthly}" placeholder="e.g. 2000" /></div>`;
  } else if (s.step === 5) {
    body.innerHTML = `
      <label style="font-weight:600;font-size:14.5px;display:block;margin-bottom:14px;">Goal preview</label>
      <div class="wizard-preview">
        <div style="display:flex;align-items:center;gap:14px;margin-bottom:14px;">
          <div class="goal-icon-badge">${ICONS[s.icon]}</div>
          <div class="goal-name">${s.name || "Untitled goal"}</div>
        </div>
        <div class="goal-meta-grid" style="border-top:none;padding-top:0;">
          <div>Target amount<strong>${formatCurrency(Number(s.amount) || 0)}</strong></div>
          <div>Monthly contribution<strong>${formatCurrency(Number(s.monthly) || 0)}</strong></div>
          <div>Target date<strong>${s.date || "—"}</strong></div>
          <div>Status<strong>Building</strong></div>
        </div>
      </div>`;
  }
}

function bindWizardNav() {
  document.getElementById("wizard-back").addEventListener("click", () => {
    if (goalWizardState.step > 1) { goalWizardState.step--; refreshWizard(); }
  });
  document.getElementById("wizard-next").addEventListener("click", () => {
    // capture current step's field into state
    if (goalWizardState.step === 1) goalWizardState.name = document.getElementById("wiz-name")?.value || "";
    if (goalWizardState.step === 2) goalWizardState.amount = document.getElementById("wiz-amount")?.value || "";
    if (goalWizardState.step === 3) goalWizardState.date = document.getElementById("wiz-date")?.value || "";
    if (goalWizardState.step === 4) goalWizardState.monthly = document.getElementById("wiz-monthly")?.value || "";

    if (goalWizardState.step === 5) {
      createGoalFromWizard();
      return;
    }
    goalWizardState.step++;
    refreshWizard();
  });
}

function refreshWizard() {
  document.getElementById("modal-root").innerHTML = renderGoalWizardModal();
  renderWizardStepBody();
  bindWizardNav();
  document.getElementById("modal-root").querySelectorAll("[data-close-modal]").forEach(b => b.addEventListener("click", closeModal));
}

function createGoalFromWizard() {
  const s = goalWizardState;
  const newGoal = {
    id: "goal-" + (DEMO_DATA.goals.length + 1),
    icon: s.icon || "target",
    name: s.name || "New goal",
    current: 0,
    target: Number(s.amount) || 10000,
    targetDate: s.date || "TBC",
    monthly: Number(s.monthly) || 0,
    status: "Building",
    statusTone: "amber",
    shared: false
  };
  DEMO_DATA.goals.unshift(newGoal);
  closeModal();
  showToast("Goal created successfully.", "success");
  renderGoals();
}
