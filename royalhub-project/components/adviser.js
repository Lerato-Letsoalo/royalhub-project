/* ============================================================
   COMPONENT: ADVISER EXPERIENCE
   ============================================================ */

function renderLegacyAdviserDashboard() {
  const a = DEMO_DATA.adviser;
  const el = document.getElementById("screen-adviser-dashboard");
  el.innerHTML = `
    <h1 style="font-size:24px;">Good morning, Adviser.</h1>
    <p class="section-sub">Here's where your book of clients needs you today.</p>

    <div class="kpi-grid">
      <div class="card kpi-card"><div class="kpi-value">${a.kpis.clients}</div><div class="kpi-label">Clients</div></div>
      <div class="card kpi-card"><div class="kpi-value" style="color:var(--amber);">${a.kpis.actionsDue}</div><div class="kpi-label">Actions due</div></div>
      <div class="card kpi-card"><div class="kpi-value" style="color:var(--red);">${a.kpis.overdue}</div><div class="kpi-label">Overdue</div></div>
      <div class="card kpi-card"><div class="kpi-value" style="color:var(--royal);">${a.kpis.claimsInProgress}</div><div class="kpi-label">Claims in progress</div></div>
      <div class="card kpi-card"><div class="kpi-value">${a.kpis.docsAwaitingReview}</div><div class="kpi-label">Documents awaiting review</div></div>
    </div>

    <div class="dash-lower" style="margin-top:22px;">
      <div class="card card-pad">
        <div class="section-head"><h2>Today's priorities</h2></div>
        ${a.priorities.map(p => `
          <div class="priority-row">
            <div class="priority-time">${p.time}</div>
            <div>${p.label}</div>
          </div>`).join("")}
      </div>
      <div class="card card-pad">
        <div class="section-head"><h2>Client attention required</h2></div>
        <div style="display:flex;flex-direction:column;gap:10px;">
          ${a.attentionClients.map(c => `
            <div class="card client-attn-card ${c.tone}">
              <div style="font-weight:600;font-size:14px;">${c.name}</div>
              <div class="attn-meta">${c.issue}${c.date && c.date !== "—" ? " · " + c.date : ""}</div>
            </div>`).join("")}
        </div>
      </div>
    </div>
  `;
}

let clientFilter = "all";
let clientSearch = "";

function renderAdviserClients() {
  const el = document.getElementById("screen-adviser-clients");
  el.innerHTML = `
    <h1 style="font-size:24px;">Client directory</h1>
    <div class="doc-filters">
      <div class="search-box" style="width:280px;">
        ${ICONS.search}
        <input type="text" id="client-search-input" placeholder="Search name, policy, client ID..." value="${clientSearch}">
      </div>
      <div class="filter-row" style="margin:0;">
        ${["all","healthy","attention","overdue","claims"].map(f => `<button class="tab-btn ${clientFilter === f ? "active" : ""}" data-client-filter="${f}">${f[0].toUpperCase()+f.slice(1)}</button>`).join("")}
      </div>
    </div>
    <div class="client-list" id="client-list"></div>
  `;
  renderClientList();
  el.querySelectorAll("[data-client-filter]").forEach(btn => btn.addEventListener("click", () => { clientFilter = btn.dataset.clientFilter; renderAdviserClients(); }));
  document.getElementById("client-search-input").addEventListener("input", (e) => { clientSearch = e.target.value; renderClientList(); });
}

function renderClientList() {
  const list = document.getElementById("client-list");
  let clients = DEMO_DATA.clientDirectory;
  if (clientFilter !== "all") clients = clients.filter(c => c.status === clientFilter);
  if (clientSearch.trim()) clients = clients.filter(c => c.name.toLowerCase().includes(clientSearch.toLowerCase()) || c.id.toLowerCase().includes(clientSearch.toLowerCase()));

  if (clients.length === 0) {
    list.innerHTML = `<div class="empty-state">${ICONS.users}<h4>No clients match this view</h4><p>Try a different filter or search term.</p></div>`;
    return;
  }

  list.innerHTML = clients.map(c => {
    const healthTone = c.health >= 75 ? "green" : c.health >= 55 ? "amber" : "red";
    return `
      <div class="card client-row" data-client="${c.id}" style="cursor:pointer;">
        <span class="avatar">${c.initials}</span>
        <div style="flex:1;min-width:0;">
          <div class="client-row-name">${c.name}</div>
          <div class="client-row-meta">${c.upcoming} · Last contact ${c.lastContact}</div>
        </div>
        <span class="health-pill status-chip ${healthTone}">${c.health}</span>
      </div>`;
  }).join("");

  list.querySelectorAll("[data-client]").forEach(row => row.addEventListener("click", () => openClientProfile(row.dataset.client)));
}

function openClientProfile(clientId) {
  const c = DEMO_DATA.clientDirectory.find(x => x.id === clientId) || DEMO_DATA.clientDirectory[0];
  openModal(`
    <div class="modal-head">
      <h3>${c.name}</h3>
      <button class="modal-close" data-close-modal>${ICONS.close}</button>
    </div>
    <p class="modal-sub">${c.id} · Client relationship overview</p>
    <div class="profile-field-row"><span>Financial health</span><span>${c.health}/100</span></div>
    <div class="profile-field-row"><span>Net worth</span><span>${formatCurrency(DEMO_DATA.client.netWorth.value)}</span></div>
    <div class="profile-field-row"><span>Investments</span><span>${formatCurrency(DEMO_DATA.client.overview.investments)}</span></div>
    <div class="profile-field-row"><span>Protection</span><span>${formatCurrency(DEMO_DATA.client.overview.protection)}</span></div>
    <div class="profile-field-row"><span>Upcoming action</span><span>${c.upcoming}</span></div>
    <div class="profile-field-row"><span>Last contact</span><span>${c.lastContact}</span></div>
    <div class="modal-footer">
      <button class="btn btn-secondary" data-close-modal>Close</button>
      <button class="btn btn-primary" id="contact-client-btn">Contact client</button>
    </div>
  `);
  document.getElementById("contact-client-btn").addEventListener("click", () => { closeModal(); showToast("Message drafted for " + c.name + ".", "success"); });
}
