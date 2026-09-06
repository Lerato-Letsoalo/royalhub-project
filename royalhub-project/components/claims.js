/* ============================================================
   COMPONENT: CLAIMS HUB
   Sub-views inside the "claims" screen: hub -> accident flow ->
   emergency SOS -> evidence -> timeline
   ============================================================ */

let claimFlow = {
  view: "hub", // hub | emergency | upload | timeline
  checklist: {},
  insurer: "Sanlam",
  details: {},
  files: [],
  activeClaimId: null
};

function renderClaims() {
  const t = getTranslation();
  const el = document.getElementById("screen-claims");

  if (claimFlow.view === "hub") {
    el.innerHTML = `
      <h1 style="font-size:24px;">${t.fromAccident}</h1>
      <p class="section-sub">${t.claimsSubtitle}</p>
      <div class="claims-hero">
        <div class="claim-choice primary" id="report-accident-card">
          <h3>${ICONS.alertLarge} Emergency SOS</h3>
          <p>Alert your linked insurer and Royal Square emergency partners in one tap. Time and live location are captured automatically.</p>
          <span class="btn btn-ghost-light btn-sm" style="align-self:flex-start;margin-top:6px;">Send SOS</span>
        </div>
        <div class="claim-choice secondary" id="track-claim-card">
          <h3 style="color:var(--ink);">${ICONS.search} Track an Existing Claim</h3>
          <p style="color:var(--ink-soft);">See exactly where your claim stands, with real-time updates.</p>
          <span class="btn btn-secondary btn-sm" style="align-self:flex-start;margin-top:6px;">View claims</span>
        </div>
      </div>
      <div class="section-head" style="margin-top:28px;">
        <h2>Your claims</h2>
      </div>
      <div class="existing-claims-list">
        ${DEMO_DATA.claims.map(c => `
          <div class="card claim-row" data-open-claim="${c.id}" style="cursor:pointer;">
            <div class="claim-row-left">
              <div class="rem-icon due-soon">${ICONS.shield}</div>
              <div>
                <div class="claim-id-badge">Claim ${c.id}</div>
                <div class="attn-meta">${c.insurer} · ${c.type}</div>
              </div>
            </div>
            <span class="claim-status-pill">${c.status}</span>
          </div>`).join("")}
      </div>
    `;
    document.getElementById("report-accident-card").addEventListener("click", () => startAccidentFlow());
    document.getElementById("track-claim-card").addEventListener("click", () => {
      document.querySelector(".existing-claims-list").scrollIntoView({ behavior: "smooth" });
    });
    el.querySelectorAll("[data-open-claim]").forEach(row => row.addEventListener("click", () => {
      claimFlow.activeClaimId = row.dataset.openClaim;
      claimFlow.view = "timeline";
      renderClaims();
    }));
    return;
  }

  if (claimFlow.view === "emergency") return renderEmergencyReport(el);
  if (claimFlow.view === "upload") return renderEvidenceUpload(el);
  if (claimFlow.view === "timeline") return renderClaimTimeline(el);
}

function startAccidentFlow() {
  const now = new Date();
  claimFlow = { view: "emergency", checklist: {}, insurer: DEMO_DATA.claims[0]?.insurer || "Your linked insurer", details: { date: now.toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" }), time: now.toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" }), location: "Getting your live location…", desc: "Emergency incident reported through RoyalHub." }, files: [], activeClaimId: null };
  if (navigator.geolocation) navigator.geolocation.getCurrentPosition(pos => {
    claimFlow.details.location = `Live location captured (${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)})`;
    if (claimFlow.view === "emergency") renderClaims();
  }, () => { claimFlow.details.location = "Live location unavailable — location request sent to support team."; if (claimFlow.view === "emergency") renderClaims(); });
  renderClaims();
}

/* ---------- Emergency SOS: context is captured automatically ---------- */
function renderEmergencyReport(el) {
  const d = claimFlow.details;
  el.innerHTML = `
    <div class="accident-flow">
      <div class="safety-banner">
        <h2>Emergency support is ready.</h2>
        <p>Your linked insurer and Royal Square's emergency partners will be alerted immediately.</p>
      </div>
      <button class="sos-button" id="send-sos-btn">SOS — send emergency alert</button>
      <div class="emergency-summary">
        <div><span>Insurer</span><strong>${claimFlow.insurer} (linked policy)</strong></div>
        <div><span>Live location</span><strong>${d.location}</strong></div>
        <div><span>Reported at</span><strong>${d.date} · ${d.time}</strong></div>
        <div><span>Incident note</span><strong>${d.desc}</strong></div>
      </div>
      <div class="checklist-cta-row">
        <button class="btn btn-secondary" id="emergency-photo-btn">${ICONS.upload} Add photos</button>
        <button class="btn btn-primary" id="emergency-continue-btn">Continue claim ${ICONS.arrowRight}</button>
      </div>
    </div>
  `;
  document.getElementById("send-sos-btn").addEventListener("click", () => { showToast(`SOS sent to ${claimFlow.insurer} and emergency partners.`, "success"); document.getElementById("send-sos-btn").textContent = "SOS sent — help is on the way"; });
  document.getElementById("emergency-photo-btn").addEventListener("click", () => { claimFlow.view = "upload"; renderClaims(); });
  document.getElementById("emergency-continue-btn").addEventListener("click", () => { claimFlow.view = "upload"; renderClaims(); });
}

/* ---------- Step 2: Insurer selection ---------- */
function renderInsurerSelection(el) {
  el.innerHTML = `
    <div class="accident-flow">
      <div class="section-head"><h2>Who is your insurer?</h2></div>
      <p class="section-sub">Select the provider this claim should go to.</p>
      <div class="insurer-grid">
        ${DEMO_DATA.insurers.map(name => `
          <button class="insurer-card ${claimFlow.insurer === name ? "selected" : ""}" data-insurer="${name}">
            <div class="insurer-logo-dot">${name.slice(0,2).toUpperCase()}</div>
            <span>${name}</span>
          </button>`).join("")}
      </div>
      <div class="checklist-cta-row">
        <button class="btn btn-tertiary" id="back-to-checklist">${ICONS.arrowLeft} Back</button>
        <button class="btn btn-primary" id="insurer-continue-btn" ${!claimFlow.insurer ? "disabled" : ""}>Continue ${ICONS.arrowRight}</button>
      </div>
    </div>
  `;
  el.querySelectorAll("[data-insurer]").forEach(btn => btn.addEventListener("click", () => {
    claimFlow.insurer = btn.dataset.insurer;
    renderInsurerSelection(el);
  }));
  document.getElementById("back-to-checklist").addEventListener("click", () => { claimFlow.view = "checklist"; renderClaims(); });
  document.getElementById("insurer-continue-btn").addEventListener("click", () => {
    if (!claimFlow.insurer) return;
    claimFlow.view = "details";
    renderClaims();
  });
}

/* ---------- Step 3: Claim details form ---------- */
function renderClaimDetailsForm(el) {
  const d = claimFlow.details;
  el.innerHTML = `
    <div class="accident-flow">
      <div class="section-head"><h2>Claim details</h2></div>
      <p class="section-sub">Filing with <strong>${claimFlow.insurer}</strong>.</p>
      <div class="form-grid" style="margin-top:18px;">
        <div class="field"><label>Date</label><input type="date" id="cd-date" value="${d.date || ""}"></div>
        <div class="field"><label>Time</label><input type="time" id="cd-time" value="${d.time || ""}"></div>
        <div class="field field-full"><label>Location</label><input type="text" id="cd-location" placeholder="e.g. N1 highway, Midrand" value="${d.location || ""}"></div>
        <div class="field field-full"><label>Description</label><textarea id="cd-desc" rows="3" placeholder="Briefly describe what happened">${d.desc || ""}</textarea></div>
        <div class="field field-full">
          <label>Police notified?</label>
          <div class="radio-row" id="cd-police">
            <button class="radio-chip ${d.police === "Yes" ? "selected" : ""}" data-police="Yes">Yes</button>
            <button class="radio-chip ${d.police === "No" ? "selected" : ""}" data-police="No">No</button>
          </div>
        </div>
        <div class="field"><label>Case number (optional)</label><input type="text" id="cd-case" value="${d.caseNumber || ""}"></div>
        <div class="field">
          <label>Who was driving?</label>
          <div class="radio-row" id="cd-driver">
            <button class="radio-chip ${d.driverType === "Personal" ? "selected" : ""}" data-driver="Personal">Personal</button>
            <button class="radio-chip ${d.driverType === "Business" ? "selected" : ""}" data-driver="Business">Business</button>
          </div>
        </div>
        <div class="field"><label>Third-party licence number</label><input type="text" id="cd-tp-licence" value="${d.tpLicence || ""}"></div>
        <div class="field"><label>Third-party registration</label><input type="text" id="cd-tp-reg" value="${d.tpReg || ""}"></div>
        <div class="field"><label>Your policy number</label><input type="text" id="cd-policy" placeholder="e.g. POL-88213" value="${d.policyNumber || ""}"></div>
      </div>
      <div class="checklist-cta-row">
        <button class="btn btn-tertiary" id="back-to-insurer">${ICONS.arrowLeft} Back</button>
        <button class="btn btn-primary" id="details-continue-btn">Continue to evidence ${ICONS.arrowRight}</button>
      </div>
    </div>
  `;
  el.querySelectorAll("[data-police]").forEach(b => b.addEventListener("click", () => {
    document.querySelectorAll("#cd-police .radio-chip").forEach(x => x.classList.remove("selected"));
    b.classList.add("selected"); d.police = b.dataset.police;
  }));
  el.querySelectorAll("[data-driver]").forEach(b => b.addEventListener("click", () => {
    document.querySelectorAll("#cd-driver .radio-chip").forEach(x => x.classList.remove("selected"));
    b.classList.add("selected"); d.driverType = b.dataset.driver;
  }));
  document.getElementById("back-to-insurer").addEventListener("click", () => { claimFlow.view = "insurer"; renderClaims(); });
  document.getElementById("details-continue-btn").addEventListener("click", () => {
    d.date = document.getElementById("cd-date").value;
    d.time = document.getElementById("cd-time").value;
    d.location = document.getElementById("cd-location").value;
    d.desc = document.getElementById("cd-desc").value;
    d.caseNumber = document.getElementById("cd-case").value;
    d.tpLicence = document.getElementById("cd-tp-licence").value;
    d.tpReg = document.getElementById("cd-tp-reg").value;
    d.policyNumber = document.getElementById("cd-policy").value;
    claimFlow.view = "upload";
    renderClaims();
  });
}

/* ---------- Step 4: Evidence upload ---------- */
function renderEvidenceUpload(el) {
  el.innerHTML = `
    <div class="accident-flow">
      <div class="section-head"><h2>Attach your evidence</h2></div>
      <p class="section-sub">Add photos or documents now if it is safe to do so. You can also submit without evidence and we will request only what is needed.</p>
      <div class="upload-zone" id="upload-zone">
        ${ICONS.upload}
        <p style="margin-top:10px;font-weight:600;color:var(--ink);">Drop files here</p>
        <p style="font-size:12.5px;">or</p>
        <button class="btn btn-secondary btn-sm" id="browse-btn" style="margin-top:8px;">Choose photos or files</button>
        <input type="file" id="evidence-file-input" accept="image/*,.pdf" multiple hidden>
        <div class="upload-cats">
          ${DEMO_DATA.uploadCategories.map(c => `<span class="upload-cat-chip">${c}</span>`).join("")}
        </div>
      </div>
      <div class="upload-file-list" id="upload-file-list"></div>
      <div class="upload-status-banner" id="upload-status-banner">${ICONS.check} <span id="upload-status-text"></span></div>
      <div class="checklist-cta-row">
        <button class="btn btn-tertiary" id="back-to-details">${ICONS.arrowLeft} Back</button>
        <button class="btn btn-primary" id="submit-claim-btn">Submit claim</button>
      </div>
    </div>
  `;

  const zone = document.getElementById("upload-zone");
  ["dragover", "dragenter"].forEach(ev => zone.addEventListener(ev, (e) => { e.preventDefault(); zone.classList.add("dragover"); }));
  ["dragleave", "drop"].forEach(ev => zone.addEventListener(ev, (e) => { e.preventDefault(); zone.classList.remove("dragover"); }));
  zone.addEventListener("drop", (e) => addFiles(e.dataTransfer.files));
  document.getElementById("browse-btn").addEventListener("click", () => document.getElementById("evidence-file-input").click());
  document.getElementById("evidence-file-input").addEventListener("change", e => addFiles(e.target.files));
  document.getElementById("back-to-details").addEventListener("click", () => { claimFlow.view = "emergency"; renderClaims(); });
  document.getElementById("submit-claim-btn").addEventListener("click", submitClaim);

  renderUploadFileList();
}

function addFiles(files) {
  Array.from(files || []).forEach((file, i) => claimFlow.files.push({ id: "f" + Date.now() + i, name: file.name, category: "Evidence", progress: 0 }));
  if (files && files.length) { renderUploadFileList(); animateUploadProgress(); }
}

function addDemoFiles(count) {
  const cats = DEMO_DATA.uploadCategories;
  for (let i = 0; i < count; i++) {
    const cat = cats[(claimFlow.files.length + i) % cats.length];
    claimFlow.files.push({ id: "f" + Date.now() + i, name: `${cat.replace(/\s+/g,"_")}_${claimFlow.files.length + i + 1}.jpg`, category: cat, progress: 0 });
  }
  renderUploadFileList();
  animateUploadProgress();
}

function renderUploadFileList() {
  const list = document.getElementById("upload-file-list");
  if (!list) return;
  list.innerHTML = claimFlow.files.map(f => `
    <div class="upload-file-row">
      ${ICONS.file}
      <span style="min-width:160px;">${f.name}</span>
      <div class="progress-track"><div class="progress-fill" style="width:${f.progress}%" data-file-progress="${f.id}"></div></div>
      <span style="font-size:11.5px;color:var(--ink-faint);width:60px;text-align:right;">${f.progress}%</span>
    </div>`).join("");
}

function animateUploadProgress() {
  const interval = setInterval(() => {
    let allDone = true;
    claimFlow.files.forEach(f => {
      if (f.progress < 100) { f.progress = Math.min(100, f.progress + 20); allDone = false; }
    });
    renderUploadFileList();
    if (allDone) {
      clearInterval(interval);
      const banner = document.getElementById("upload-status-banner");
      const text = document.getElementById("upload-status-text");
      if (banner && text) {
        text.textContent = `${claimFlow.files.length} files ready — securely attached to claim.`;
        banner.classList.add("show");
      }
      const submitBtn = document.getElementById("submit-claim-btn");
      if (submitBtn) submitBtn.disabled = claimFlow.files.length === 0;
    }
  }, 220);
}

function submitClaim() {
  const newId = "RSF-" + (2050 + DEMO_DATA.claims.length);
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-ZA", { day: "numeric", month: "short" });
  const timeStr = now.toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" });
  const newClaim = {
    id: newId,
    insurer: claimFlow.insurer,
    type: "Motor",
    status: "Submitted",
    statusStage: 4,
    lastUpdated: now.toISOString(),
    nextAction: "Vehicle assessment",
    timeline: [
      { label: "Claim submitted", date: `${dateStr} • ${timeStr}`, done: true },
      { label: "Evidence received", date: `${dateStr} • ${timeStr}`, done: true },
      { label: "Insurer notified", date: `${dateStr} • ${timeStr}`, done: true },
      { label: "Claim number received", date: `${dateStr} • ${timeStr}`, done: true },
      { label: "Vehicle assessment", date: "Pending", done: false, current: true },
      { label: "Authorisation", date: "Upcoming", done: false },
      { label: "Repair", date: "Upcoming", done: false },
      { label: "Vehicle collection", date: "Upcoming", done: false }
    ]
  };
  DEMO_DATA.claims.unshift(newClaim);
  API.createClaim({ insurer: newClaim.insurer, type: newClaim.type, location: claimFlow.details.location, evidenceCount: claimFlow.files.length }).catch(() => showToast("Saved locally; it will sync when the service is available.", "info"));
  claimFlow.activeClaimId = newId;
  claimFlow.view = "timeline";
  showToast("Claim submitted.", "success");
  renderClaims();

  // Reflect in adviser attention centre for the "wow moment" of cross-role visibility
  DEMO_DATA.adviser.attentionClients.unshift({ id: "claim-" + newId, name: "Lerato Letsoalo", issue: `New claim ${newId} needs review`, date: dateStr, tone: "amber" });
  DEMO_DATA.adviser.kpis.claimsInProgress += 1;
}

/* ---------- Step 5: Claim timeline ---------- */
function renderClaimTimeline(el) {
  const claim = DEMO_DATA.claims.find(c => c.id === claimFlow.activeClaimId) || DEMO_DATA.claims[0];
  el.innerHTML = `
    <div class="card card-pad">
      <div class="timeline-header">
        <div>
          <button class="btn btn-tertiary btn-sm" id="back-to-hub" style="padding-left:0;">${ICONS.arrowLeft} All claims</button>
          <div class="claim-title" style="margin-top:6px;">Claim ${claim.id}</div>
          <div class="section-sub">${claim.insurer} · ${claim.type}</div>
        </div>
        <span class="claim-status-pill">${claim.status}</span>
      </div>

      <div class="stepper-h">
        ${claim.timeline.map((step, i) => `
          <div class="step-node ${step.done ? "done" : ""} ${step.current ? "current" : ""}">
            <div class="line"></div>
            <div class="dot">${step.done ? ICONS.checkSm : i + 1}</div>
            <div class="step-label">${step.label}</div>
            <div class="step-date">${step.date}</div>
          </div>`).join("")}
      </div>

      <div class="stepper-v">
        ${claim.timeline.map((step) => `
          <div class="priority-row">
            <div class="dot" style="width:26px;height:26px;border-radius:50%;background:${step.done ? "var(--green)" : step.current ? "var(--royal)" : "var(--border-soft)"};color:${step.done || step.current ? "#fff" : "var(--ink-faint)"};display:flex;align-items:center;justify-content:center;flex-shrink:0;">${step.done ? ICONS.checkSm : ""}</div>
            <div>
              <div style="font-weight:600;font-size:14px;">${step.label}</div>
              <div class="attn-meta">${step.date}</div>
            </div>
          </div>`).join("")}
      </div>

      <div class="chase-banner">
        <div class="chase-banner-icon">${ICONS.shield}</div>
        <div>
          <div style="font-weight:700;">You don't need to chase the insurer.</div>
          <div class="section-sub" style="margin-top:2px;">RoyalHub will keep you updated when your claim moves forward.</div>
          <div class="chase-meta">
            <span>Last updated: ${new Date(claim.lastUpdated).toLocaleString("en-ZA", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
            <span>Next expected action: ${claim.nextAction}</span>
          </div>
        </div>
      </div>
    </div>
  `;
  document.getElementById("back-to-hub").addEventListener("click", () => { claimFlow.view = "hub"; renderClaims(); });

  // simulate a real-time progress update after a short delay for the demo
  if (claim.status !== "Assessment complete") {
    setTimeout(() => {
      if (claimFlow.view !== "timeline" || claimFlow.activeClaimId !== claim.id) return;
      const assessStep = claim.timeline.find(s => s.label === "Vehicle assessment");
      if (assessStep && !assessStep.done) {
        assessStep.done = true; assessStep.current = false; assessStep.date = "Updated just now";
        const authStep = claim.timeline.find(s => s.label === "Authorisation");
        if (authStep) authStep.current = true;
        claim.status = "Assessment complete";
        claim.nextAction = "Authorisation";
        claim.lastUpdated = new Date().toISOString();
        if (claimFlow.view === "timeline" && claimFlow.activeClaimId === claim.id) {
          renderClaimTimeline(document.getElementById("screen-claims"));
          showToast("Your claim has moved forward.", "info");
        }
      }
    }, 9000);
  }
}
