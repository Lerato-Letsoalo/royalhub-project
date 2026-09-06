/* ============================================================
   COMPONENT: REQUESTS
   ============================================================ */

function renderRequests() {
  const t = getTranslation();
  const el = document.getElementById("screen-requests");
  el.innerHTML = `
    <h1 style="font-size:24px;">Requests & document delivery</h1>
    <p class="section-sub">Pick what you need — RoyalHub guides you through it in a few taps.</p>
    <div class="request-grid">
      ${DEMO_DATA.requestTypes.map(r => `
        <button class="request-card" data-request="${r.id}">
          <div class="req-icon">${ICONS[r.icon] || ICONS.inbox}</div>
          <span class="req-name">${r.name}</span>
        </button>`).join("")}
    </div>

    <div class="section-head" style="margin-top:30px;">
      <h2>Your requests</h2>
    </div>
    <div class="existing-claims-list">
      ${DEMO_DATA.requests.length ? DEMO_DATA.requests.map(r => `
        <div class="card request-track-row">
          <div>
            <div class="claim-id-badge">Request ${r.id}</div>
            <div class="attn-meta">${r.type}</div>
          </div>
          <span class="claim-status-pill">${r.status}</span>
        </div>
        <div class="card card-pad" style="margin-top:-6px;">
          <div class="stepper-h" style="margin:0;">
            ${r.timeline.map((step, i) => `
              <div class="step-node ${step.done ? "done" : ""} ${step.current ? "current" : ""}">
                <div class="line"></div>
                <div class="dot">${step.done ? ICONS.checkSm : i + 1}</div>
                <div class="step-label">${step.label}</div>
              </div>`).join("")}
          </div>
        </div>
      `).join("") : `<div class="empty-state">${ICONS.inbox}<h4>No requests yet</h4><p>Requests you submit will be tracked here from start to finish.</p></div>`}
    </div>
  `;

  el.querySelectorAll("[data-request]").forEach(btn => btn.addEventListener("click", () => openRequestWizard(btn.dataset.request)));
}

function openRequestWizard(requestTypeId) {
  const type = DEMO_DATA.requestTypes.find(r => r.id === requestTypeId);
  openModal(`
    <div class="modal-head">
      <h3>${type.name}</h3>
      <button class="modal-close" data-close-modal>${ICONS.close}</button>
    </div>
    <p class="modal-sub">Just the essentials for now — we'll ask for anything else only if needed.</p>
    <div class="field">
      <label>Add a short note (optional)</label>
      <textarea rows="3" placeholder="Any context that will help your adviser"></textarea>
    </div>
    <div class="field">
      <label>Preferred contact method</label>
      <div class="radio-row">
        <button class="radio-chip selected">Email</button>
        <button class="radio-chip">WhatsApp</button>
        <button class="radio-chip">Call me</button>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-tertiary" data-close-modal>Cancel</button>
      <button class="btn btn-primary" id="submit-request-btn">Submit request</button>
    </div>
  `);
  document.querySelectorAll(".modal .radio-row").forEach(row => {
    row.querySelectorAll("button").forEach(b => b.addEventListener("click", () => {
      row.querySelectorAll("button").forEach(x => x.classList.remove("selected"));
      b.classList.add("selected");
    }));
  });
  document.getElementById("submit-request-btn").addEventListener("click", () => {
    const newId = "RSF-" + (1054 + DEMO_DATA.requests.length);
    DEMO_DATA.requests.unshift({
      id: newId, type: type.name, status: "Processing", submitted: new Date().toISOString(),
      timeline: [
        { label: "Request received", done: true },
        { label: "Adviser notified", done: true },
        { label: "Provider request", done: false, current: true },
        { label: "Document available", done: false }
      ]
    });
    API.createRequest({ type: type.name }).catch(() => showToast("Request saved locally; it will sync when the service is available.", "info"));
    closeModal();
    showToast("Request submitted.", "success");
    renderRequests();
  });
}
