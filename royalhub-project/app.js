/* ============================================================
   ROYALHUB — APP CORE
   State, routing, shared UI systems (modals/toasts/speech),
   translations, profile & providers, and bootstrapping.

   API-READY ARCHITECTURE
   -----------------------------------------------------------
   Backend developers: replace the bodies of the functions in
   API below with real fetch() calls to your endpoints. Every
   screen currently reads from DEMO_DATA directly for prototype
   speed — swap those reads for calls into API.* when the
   backend is ready. Response shapes should mirror the objects
   in data/demo-data.js.
   ============================================================ */

const API = {
  request: async (path, options = {}) => { const r = await fetch(path, { headers: { "Content-Type": "application/json" }, ...options }); if (!r.ok) throw new Error("API request failed"); return r.json(); },
  getDashboard: async () => API.request("/api/bootstrap"),
  getGoals: async () => DEMO_DATA.goals,
  createGoal: async (goal) => { DEMO_DATA.goals.unshift(goal); return goal; },
  getReminders: async () => DEMO_DATA.reminders,
  createReminder: async (rule) => rule,
  getClaims: async () => DEMO_DATA.claims,
  createClaim: async (claim) => API.request("/api/claims", { method: "POST", body: JSON.stringify(claim) }),
  uploadDocument: async (file) => file,
  getDocuments: async () => DEMO_DATA.documents,
  getClientProfile: async (id) => API.request(`/api/profile/${id}`),
  updateProfile: async (profile) => API.request("/api/profile/RSF-1048", { method: "PATCH", body: JSON.stringify(profile) }),
  createRequest: async (request) => API.request("/api/requests", { method: "POST", body: JSON.stringify(request) })
};

async function hydrateBackend() {
  try {
    const data = await API.getDashboard();
    if (data.profile) {
      Object.assign(DEMO_DATA.client, { fullName: data.profile.full_name, email: data.profile.email, phone: data.profile.phone, address: data.profile.address });
    }
    if (data.providers?.length) DEMO_DATA.providers = data.providers;
    state.demoMode = false;
  } catch (_) { state.demoMode = true; }
}

/* ---------- Global state ---------- */
const state = {
  role: "client",           // "client" | "adviser"
  currentScreen: "dashboard",
  language: "en",
  demoMode: true,
  loggedIn: false
};

/* ---------- Icon set (consistent line icons) ---------- */
const ICONS = {
  grid: `<svg class="icon" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>`,
  target: `<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="0.6" fill="currentColor"/></svg>`,
  bell: `<svg class="icon" viewBox="0 0 24 24"><path d="M6 8a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>`,
  inbox: `<svg class="icon" viewBox="0 0 24 24"><path d="M3 12h4l2 3h6l2-3h4"/><path d="M5 12 3 5.5A1 1 0 0 1 4 4h16a1 1 0 0 1 1 1.5L19 12v6a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z"/></svg>`,
  shield: `<svg class="icon" viewBox="0 0 24 24"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/></svg>`,
  folder: `<svg class="icon" viewBox="0 0 24 24"><path d="M3 7a1 1 0 0 1 1-1h5l2 2h9a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/></svg>`,
  user: `<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.5"/><path d="M4.5 20c1.5-4 5-5.5 7.5-5.5s6 1.5 7.5 5.5"/></svg>`,
  users: `<svg class="icon" viewBox="0 0 24 24"><circle cx="9" cy="8" r="3"/><path d="M2 20c1-3.5 4-5 7-5s6 1.5 7 5"/><circle cx="17" cy="9" r="2.4"/><path d="M15.5 14c2 .2 4 1.5 4.8 4"/></svg>`,
  search: `<svg class="icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>`,
  home: `<svg class="icon" viewBox="0 0 24 24"><path d="M4 11 12 4l8 7"/><path d="M6 10v9a1 1 0 0 0 1 1h4v-6h2v6h4a1 1 0 0 0 1-1v-9"/></svg>`,
  cap: `<svg class="icon" viewBox="0 0 24 24"><path d="M12 4 2 9l10 5 10-5z"/><path d="M6 11.5V17c0 1.5 3 3 6 3s6-1.5 6-3v-5.5"/></svg>`,
  sun: `<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8 6 18M18 6l1.8-1.8"/></svg>`,
  family: `<svg class="icon" viewBox="0 0 24 24"><circle cx="8" cy="7" r="2.3"/><circle cx="16" cy="7" r="2.3"/><path d="M3.5 19c.6-3 2.4-4.6 4.5-4.6s3.9 1.6 4.5 4.6"/><path d="M11.5 19c.6-3 2.4-4.6 4.5-4.6s3.9 1.6 4.5 4.6"/></svg>`,
  car: `<svg class="icon" viewBox="0 0 24 24"><path d="M4 16v-3l2-4h12l2 4v3"/><rect x="3.5" y="16" width="17" height="3.5" rx="1"/><circle cx="7.5" cy="19.5" r="1.3"/><circle cx="16.5" cy="19.5" r="1.3"/></svg>`,
  plusCircle: `<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></svg>`,
  close: `<svg class="icon" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg>`,
  sparkle: `<svg class="icon" viewBox="0 0 24 24"><path d="M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6z"/></svg>`,
  trendUp: `<svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M4 16 10 10l4 4 6-6"/><path d="M15 8h5v5"/></svg>`,
  speaker: `<svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M4 10v4h3l5 4V6l-5 4z"/><path d="M16 9a4 4 0 0 1 0 6"/><path d="M18.5 7a7.5 7.5 0 0 1 0 10"/></svg>`,
  clock: `<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3.5 2"/></svg>`,
  alert: `<svg class="icon" viewBox="0 0 24 24"><path d="M12 3 2 20h20z"/><path d="M12 10v4"/><circle cx="12" cy="17" r="0.6" fill="currentColor"/></svg>`,
  alertLarge: `<svg class="icon icon-lg" viewBox="0 0 24 24"><path d="M12 3 2 20h20z"/><path d="M12 10v4"/><circle cx="12" cy="17" r="0.6" fill="currentColor"/></svg>`,
  check: `<svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M5 12.5 10 17 19 7"/></svg>`,
  checkSm: `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5 10 17 19 7"/></svg>`,
  calendar: `<svg class="icon" viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="16" rx="2"/><path d="M8 3v4M16 3v4M3.5 10h17"/></svg>`,
  arrowRight: `<svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M4 12h16M14 6l6 6-6 6"/></svg>`,
  arrowLeft: `<svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M20 12H4M10 6l-6 6 6 6"/></svg>`,
  upload: `<svg class="icon icon-lg" viewBox="0 0 24 24"><path d="M12 16V4M8 8l4-4 4 4"/><path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/></svg>`,
  file: `<svg class="icon" viewBox="0 0 24 24"><path d="M6 3h9l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v5h5"/></svg>`,
  doc: `<svg class="icon" viewBox="0 0 24 24"><path d="M6 3h9l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v5h5M8 13h8M8 17h5"/></svg>`,
  pin: `<svg class="icon" viewBox="0 0 24 24"><path d="M12 21s7-6.5 7-11.5A7 7 0 0 0 5 9.5C5 14.5 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.4"/></svg>`,
  card: `<svg class="icon" viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18"/></svg>`,
  plane: `<svg class="icon" viewBox="0 0 24 24"><path d="M2 16l20-8-8 20-2-8z"/></svg>`,
  notif: `<svg class="icon" viewBox="0 0 24 24"><path d="M6 8a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>`
};

/* ---------- Helpers ---------- */
function formatCurrency(value) {
  return "R " + Math.round(value).toLocaleString("en-ZA");
}

function getTranslation() {
  return DEMO_DATA.translations[state.language] || DEMO_DATA.translations.en;
}

function animateCountUps(root) {
  root.querySelectorAll(".count-up").forEach(el => {
    const target = Number(el.dataset.countTo);
    const isNumberFmt = el.dataset.format === "number";
    const duration = 1100;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      el.textContent = isNumberFmt ? value.toLocaleString("en-ZA") : value;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

function animateBars(root) {
  root.querySelectorAll("[data-width]").forEach(el => {
    const w = el.dataset.width;
    requestAnimationFrame(() => setTimeout(() => { el.style.width = w; }, 60));
  });
}

/* ---------- Speech synthesis ---------- */
function bindSpeakers(root) {
  root.querySelectorAll("[data-speak]").forEach(btn => {
    btn.addEventListener("click", () => speakText(btn.dataset.speak, btn));
  });
}
function speakText(text, btn) {
  if (!("speechSynthesis" in window)) { showToast("Voice playback isn't supported in this browser.", "info"); return; }
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 0.98;
  if (btn) {
    btn.classList.add("speaking");
    utter.onend = () => btn.classList.remove("speaking");
    utter.onerror = () => btn.classList.remove("speaking");
  }
  window.speechSynthesis.speak(utter);
}

/* ---------- Toasts ---------- */
function showToast(message, type = "info") {
  const wrap = document.getElementById("toast-wrap");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-dot"></span><span>${message}</span>`;
  wrap.appendChild(toast);
  setTimeout(() => {
    toast.style.transition = "opacity .3s ease, transform .3s ease";
    toast.style.opacity = "0";
    toast.style.transform = "translateX(20px)";
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

/* ---------- Modals ---------- */
function openModal(innerHtml) {
  const overlay = document.getElementById("modal-overlay");
  const root = document.getElementById("modal-root");
  root.innerHTML = innerHtml;
  overlay.classList.add("show");
  root.querySelectorAll("[data-close-modal]").forEach(b => b.addEventListener("click", closeModal));
}
function closeModal() {
  document.getElementById("modal-overlay").classList.remove("show");
  document.getElementById("modal-root").innerHTML = "";
}

/* ---------- Router ---------- */
const CLIENT_SCREENS = ["dashboard", "goals", "reminders", "requests", "claims", "profile"];
const ADVISER_SCREENS = ["adviser-dashboard", "adviser-clients", "claims", "requests", "profile"];

function navigateTo(screenId) {
  state.currentScreen = screenId;
  document.querySelectorAll(".screen-view").forEach(v => v.classList.remove("active"));
  const target = document.getElementById("screen-" + screenId);
  if (target) target.classList.add("active");

  renderCurrentScreen();
  renderSidebarNav();
  renderTopbar();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderCurrentScreen() {
  switch (state.currentScreen) {
    case "dashboard": renderDashboard(); break;
    case "goals": renderGoals(); break;
    case "reminders": renderReminders(); break;
    case "requests": renderRequests(); break;
    case "claims": renderClaims(); break;
    case "documents": renderDocuments(); break;
    case "profile": renderProfile(); break;
    case "adviser-dashboard": renderAdviserDashboard(); break;
    case "adviser-clients": renderAdviserClients(); break;
  }
}

function renderSidebarNav() {
  const sidebarNav = document.getElementById("sidebar-nav");
  const screens = state.role === "client" ? CLIENT_SCREENS : ADVISER_SCREENS;
  
  const navItems = {
    dashboard: { icon: ICONS.grid, label: "Dashboard" },
    "adviser-dashboard": { icon: ICONS.users, label: "Dashboard" },
    goals: { icon: ICONS.target, label: "Goals" },
    "adviser-clients": { icon: ICONS.users, label: "Clients" },
    reminders: { icon: ICONS.bell, label: "Reminders" },
    requests: { icon: ICONS.inbox, label: "Requests" },
    claims: { icon: ICONS.shield, label: "Claims" },
    profile: { icon: ICONS.user, label: "Profile" }
  };

  sidebarNav.innerHTML = screens.map(screenId => {
    const item = navItems[screenId];
    if (!item) return "";
    const isActive = state.currentScreen === screenId ? "active" : "";
    return `
      <button class="nav-item ${isActive}" data-screen="${screenId}">
        ${item.icon}
        <span>${item.label}</span>
      </button>
    `;
  }).join("");

  sidebarNav.querySelectorAll(".nav-item").forEach(btn => {
    btn.addEventListener("click", () => navigateTo(btn.dataset.screen));
  });
}

function renderTopbar() {
  const titleEl = document.getElementById("topbar-title");
  const titleMap = {
    dashboard: "Dashboard",
    "adviser-dashboard": "Clients Overview",
    goals: "Financial Goals",
    "adviser-clients": "Client Portfolio",
    reminders: "Reminders & Actions",
    requests: "Requests",
    claims: "Claims",
    profile: "Profile"
  };
  
  if (titleEl) {
    titleEl.textContent = titleMap[state.currentScreen] || "Dashboard";
  }
}

/* ---------- Profile screen ---------- */
function renderProfile() {
  const c = DEMO_DATA.client;
  const el = document.getElementById("screen-profile");
  el.innerHTML = `
    <h1 style="font-size:24px;">Profile</h1>
    <div class="profile-grid">
      <div class="card card-pad">
        <div class="section-head"><h2>Personal information</h2><button class="btn btn-secondary btn-sm" id="edit-profile-btn">Edit</button></div>
        <div id="profile-details"><div class="profile-field-row"><span>Full name</span><span>${c.fullName}</span></div>
        <div class="profile-field-row"><span>Client ID</span><span>${c.id}</span></div>
        <div class="profile-field-row"><span>Email</span><span>${c.email}</span></div>
        <div class="profile-field-row"><span>Phone</span><span>${c.phone}</span></div>
        <div class="profile-field-row"><span>Address</span><span>${c.address}</span></div></div>
      </div>
      <div class="card card-pad">
        <div class="section-head"><h2>Communication preferences</h2></div>
        ${["Email","SMS","WhatsApp","Voice notifications","In-app"].map((ch, i) => `
          <div class="pref-toggle-row">
            <span>${ch}</span>
            <div class="toggle ${i < 3 ? "on" : ""}" data-toggle></div>
          </div>`).join("")}
      </div>
      <div class="card card-pad">
        <div class="section-head"><h2>Language</h2></div>
        <p class="section-sub">Changing your language updates key labels across RoyalHub.</p>
        <div class="lang-grid">
          ${["en","zu"].map(code => `
            <button class="lang-chip ${state.language === code ? "selected" : ""}" data-lang="${code}">${code === "en" ? "English" : "isiZulu"}</button>`).join("")}
          ${["Sesotho","Setswana","Sepedi","isiXhosa"].map(l => `<button class="lang-chip" disabled style="opacity:.45;">${l}</button>`).join("")}
        </div>
      </div>
      <div class="card card-pad">
        <div class="section-head"><h2>Security</h2></div>
        <div class="trust-row">
          <span class="trust-chip">${ICONS.check} Secure connection</span>
          <span class="trust-chip">${ICONS.check} Verified identity</span>
          <span class="trust-chip">${ICONS.check} POPIA-conscious design</span>
        </div>
      </div>
    </div>

    <div class="card card-pad" style="margin-top:18px;">
      <div class="section-head"><h2>Connected providers</h2></div>
      <div class="provider-grid">
        ${DEMO_DATA.providers.map(p => `
          <div class="card provider-card">
            <div class="provider-name">${p.name}</div>
            <div class="provider-status">
              <span class="status-dot-sm ${p.status.toLowerCase().replace(" ","-")}"></span>${p.status}
            </div>
            <div class="provider-sync-time">Last synced: ${p.lastSynced} · Prototype connection</div>
          </div>`).join("")}
      </div>
    </div>
  `;

  el.querySelectorAll("[data-toggle]").forEach(t => t.addEventListener("click", () => { t.classList.toggle("on"); showToast("Profile updated.", "success"); }));
  document.getElementById("edit-profile-btn").addEventListener("click", () => {
    const detail = document.getElementById("profile-details");
    detail.innerHTML = `<div class="field"><label>Full name</label><input id="profile-name" value="${c.fullName}"></div><div class="field"><label>Email</label><input id="profile-email" value="${c.email}"></div><div class="field"><label>Phone</label><input id="profile-phone" value="${c.phone}"></div><div class="field"><label>Address</label><textarea id="profile-address" rows="2">${c.address}</textarea></div><button class="btn btn-primary btn-sm" id="save-profile-btn">Save changes</button>`;
    document.getElementById("edit-profile-btn").style.display = "none";
    document.getElementById("save-profile-btn").addEventListener("click", () => {
      c.fullName = document.getElementById("profile-name").value;
      c.email = document.getElementById("profile-email").value;
      c.phone = document.getElementById("profile-phone").value;
      c.address = document.getElementById("profile-address").value;
      API.updateProfile({ full_name: c.fullName, email: c.email, phone: c.phone, address: c.address }).catch(() => showToast("Profile saved locally; it will sync when the service is available.", "info"));
      showToast("Profile changes saved.", "success"); renderProfile();
    });
  });
  el.querySelectorAll("[data-lang]").forEach(btn => btn.addEventListener("click", () => {
    state.language = btn.dataset.lang;
    showToast("Language updated.", "success");
    navigateTo("profile");
  }));
}

/* ---------- Notifications drawer ---------- */
function initNotifDrawer() {
  renderNotifications();
}
function renderNotifications() {
  const unreadCount = DEMO_DATA.notifications.filter(n => !n.read).length;
  const badge = document.getElementById("notif-bell-badge");
  badge.classList.toggle("hidden", unreadCount === 0);

  const drawer = document.getElementById("notif-drawer");
  drawer.innerHTML = `
    <div class="notif-head">
      <h3 style="font-size:16px;">Notifications</h3>
      <button class="modal-close" id="close-notif">${ICONS.close}</button>
    </div>
    <div class="notif-list">
      ${DEMO_DATA.notifications.map(n => `
        <div class="notif-item ${n.read ? "" : "unread"}">
          <div class="notif-icon">${ICONS[n.type === "claim" ? "shield" : n.type === "document" ? "folder" : "bell"]}</div>
          <div>
            <div class="notif-text">${n.text}</div>
            <div class="notif-time">${n.time}</div>
          </div>
        </div>`).join("")}
    </div>
  `;
  document.getElementById("close-notif").addEventListener("click", closeNotifDrawer);
}
function openNotifDrawer() {
  DEMO_DATA.notifications.forEach(n => n.read = true);
  renderNotifications();
  document.getElementById("notif-drawer").classList.add("open");
  document.getElementById("drawer-scrim").classList.add("show");
}
function closeNotifDrawer() {
  document.getElementById("notif-drawer").classList.remove("open");
  document.getElementById("drawer-scrim").classList.remove("show");
}

/* ---------- Auth / login flow ---------- */
function setupAuthScreen() {
  // Role selector
  const roleOptions = document.querySelectorAll(".role-option");
  roleOptions.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      roleOptions.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.role = btn.dataset.role;
    });
  });

  // Form submission
  document.getElementById("login-form").addEventListener("submit", (e) => {
    e.preventDefault();
    runLoginSequence();
  });

  // Demo credentials button
  document.getElementById("fill-demo-btn").addEventListener("click", () => {
    const role = state.role || "client";
    if (role === "client") {
      document.getElementById("email-input").value = "lerato.demo@example.co.za";
    } else {
      document.getElementById("email-input").value = "adviser@royal.co.za";
    }
    document.getElementById("password-input").value = "demo-password";
  });
}

function runLoginSequence() {
  // Validate role is selected
  if (!state.role || (state.role !== "client" && state.role !== "admin")) {
    showToast("Please select a valid access role.", "warning");
    return;
  }

  // Validate credentials (demo-only)
  const email = document.getElementById("email-input").value.trim();
  const password = document.getElementById("password-input").value.trim();
  
  if (!email || !password) {
    showToast("Please enter email and password.", "warning");
    return;
  }

  // Validate role-credential match (demo mode)
  if (state.role === "client" && !email.includes("lerato") && email !== "lerato.demo@example.co.za") {
    showToast("For client access, use: lerato.demo@example.co.za", "info");
    return;
  }
  if (state.role === "admin" && !email.includes("adviser") && email !== "adviser@royal.co.za") {
    showToast("For adviser access, use: adviser@royal.co.za", "info");
    return;
  }

  document.getElementById("screen-auth").style.display = "none";
  const loading = document.getElementById("screen-loading");
  loading.style.display = "flex";
  
  const messages = state.role === "client" 
    ? ["Connecting your financial information...", "Syncing provider updates...", "Preparing your dashboard..."]
    : ["Connecting advisor portal...", "Loading client portfolio...", "Preparing adviser dashboard..."];
  
  const textEl = document.getElementById("loader-text");
  let i = 0;
  textEl.textContent = messages[0];
  const interval = setInterval(() => {
    i++;
    if (i < messages.length) textEl.textContent = messages[i];
  }, 700);

  setTimeout(() => {
    clearInterval(interval);
    loading.style.display = "none";
    document.getElementById("app-shell").classList.add("active");
    state.loggedIn = true;
    hydrateBackend().finally(boot);
  }, 2300);
}

/* ---------- Boot ---------- */
function boot() {
  navigateTo(state.role === "admin" ? "adviser-dashboard" : "dashboard");
  initAssistDrawer();
  initNotifDrawer();

  document.getElementById("open-assist-btn").addEventListener("click", openAssistDrawer);
  document.getElementById("open-notif-btn").addEventListener("click", openNotifDrawer);
  document.getElementById("drawer-scrim").addEventListener("click", () => { closeAssistDrawer(); closeNotifDrawer(); });
  document.getElementById("modal-overlay").addEventListener("click", (e) => { if (e.target.id === "modal-overlay") closeModal(); });
  document.getElementById("sidebar-toggle").addEventListener("click", () => {
    const shell = document.getElementById("app-shell"); shell.classList.toggle("sidebar-collapsed");
    document.getElementById("sidebar-toggle").setAttribute("aria-label", shell.classList.contains("sidebar-collapsed") ? "Open navigation" : "Close navigation");
  });

  // ---- LOGOUT HANDLER ----
  document.getElementById("logout-btn").addEventListener("click", () => {
    state.loggedIn = false;
    state.currentScreen = "dashboard";
    document.getElementById("app-shell").classList.remove("active");
    document.getElementById("screen-auth").style.display = "flex";
    // Reset any open drawers/modals
    closeModal();
    closeAssistDrawer();
    closeNotifDrawer();
    showToast("You have been logged out.", "info");
    // Reset login form
    document.getElementById("email-input").value = "";
    document.getElementById("password-input").value = "";
    // Reset role selector to client
    document.querySelectorAll(".role-option").forEach(b => b.classList.remove("active"));
    document.querySelector('[data-role="client"]').classList.add("active");
    state.role = "client";
  });

  // Demo-mode simulated notification arriving after a delay, for realism
  if (state.demoMode) {
    setTimeout(() => {
      DEMO_DATA.notifications.unshift({ id: "n-live-" + Date.now(), text: "RoyalHub received your document.", time: "Just now", type: "document", read: false });
      renderNotifications();
      showToast("New notification received.", "info");
    }, 16000);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setupAuthScreen();
});
