/* ============================================================
   COMPONENT: DOCUMENT VAULT
   ============================================================ */

let docFilter = "All";
let docSearch = "";

function renderDocuments() {
  const t = getTranslation();
  const el = document.getElementById("screen-documents");
  const categories = ["All", ...new Set(DEMO_DATA.documents.map(d => d.category))];

  el.innerHTML = `
    <div class="section-head">
      <h1 style="font-size:24px;">${t.documents}</h1>
      <button class="btn btn-secondary btn-sm" id="request-doc-btn">${ICONS.plusCircle} Request new document</button>
    </div>
    <div class="doc-filters">
      <div class="search-box" style="width:260px;">
        ${ICONS.search}
        <input type="text" id="doc-search-input" placeholder="Search documents..." value="${docSearch}">
      </div>
      <div class="filter-row" style="margin:0;">
        ${categories.map(c => `<button class="tab-btn ${docFilter === c ? "active" : ""}" data-doc-filter="${c}">${c}</button>`).join("")}
      </div>
    </div>
    <div class="doc-grid" id="doc-grid"></div>
  `;

  renderDocGrid();
  el.querySelectorAll("[data-doc-filter]").forEach(btn => btn.addEventListener("click", () => { docFilter = btn.dataset.docFilter; renderDocuments(); }));
  document.getElementById("doc-search-input").addEventListener("input", (e) => { docSearch = e.target.value; renderDocGrid(); });
  document.getElementById("request-doc-btn").addEventListener("click", () => openRequestWizard("req-policy-doc"));
}

function renderDocGrid() {
  const grid = document.getElementById("doc-grid");
  let docs = DEMO_DATA.documents;
  if (docFilter !== "All") docs = docs.filter(d => d.category === docFilter);
  if (docSearch.trim()) docs = docs.filter(d => d.name.toLowerCase().includes(docSearch.toLowerCase()) || d.provider.toLowerCase().includes(docSearch.toLowerCase()));

  if (docs.length === 0) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;">${ICONS.folder}<h4>No documents yet</h4><p>Once Royal Square receives your documents, they'll appear here.</p></div>`;
    return;
  }

  grid.innerHTML = docs.map(d => `
    <div class="card doc-card">
      <div class="doc-icon">${ICONS.file}</div>
      <div class="doc-body">
        <div class="doc-name">${d.name}</div>
        <div class="doc-meta">${d.provider} · Updated ${d.date}</div>
        <div class="doc-actions">
          <button class="btn btn-secondary btn-sm" data-preview="${d.id}">Preview</button>
          <button class="btn btn-tertiary btn-sm" data-download="${d.id}">Download</button>
        </div>
      </div>
    </div>`).join("");

  grid.querySelectorAll("[data-preview]").forEach(b => b.addEventListener("click", () => showToast("Opening preview…", "info")));
  grid.querySelectorAll("[data-download]").forEach(b => b.addEventListener("click", () => showToast("Download started.", "success")));
}
