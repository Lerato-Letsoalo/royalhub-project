/* ============================================================
   COMPONENT: NAVIGATION
   Sidebar, topbar greeting/search/role-switch, mobile bottom nav.
   ============================================================ */

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "grid" },
  { id: "goals", label: "My Goals", icon: "target" },
  { id: "reminders", label: "Reminders", icon: "bell" },
  { id: "requests", label: "Requests", icon: "inbox" },
  { id: "claims", label: "Claims", icon: "shield" },
  { id: "profile", label: "Profile", icon: "user" }
];

const ADVISER_NAV_ITEMS = [
  { id: "adviser-dashboard", label: "Dashboard", icon: "grid" },
  { id: "adviser-clients", label: "Clients", icon: "users" },
  { id: "claims", label: "Claims", icon: "shield" },
  { id: "requests", label: "Requests", icon: "inbox" },
  { id: "profile", label: "Profile", icon: "user" }
];

function renderSidebarNav() {
  const items = state.role === "adviser" ? ADVISER_NAV_ITEMS : NAV_ITEMS;
  const t = getTranslation();
  const navBadgeCount = state.role === "client" ? DEMO_DATA.client.overview.actionsDue : null;

  const sidebarNav = document.getElementById("sidebar-nav");
  sidebarNav.innerHTML = items.map(item => {
    const isActive = state.currentScreen === item.id;
    const label = t[item.id] || item.label;
    const badge = (item.id === "reminders" && navBadgeCount) ? `<span class="nav-badge">${navBadgeCount}</span>` : "";
    return `
      <a href="#" class="nav-item ${isActive ? "active" : ""}" data-nav="${item.id}" role="link">
        ${ICONS[item.icon]}
        <span>${label}</span>
        ${badge}
      </a>`;
  }).join("");

  sidebarNav.querySelectorAll("[data-nav]").forEach(el => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      navigateTo(el.dataset.nav);
    });
  });

  renderMobileNav(items);
}

function renderMobileNav(items) {
  const mobileItems = items.slice(0, 5);
  const mobileNav = document.getElementById("mobile-nav");
  mobileNav.innerHTML = mobileItems.map(item => {
    const isActive = state.currentScreen === item.id;
    return `
      <a href="#" class="mobile-nav-item ${isActive ? "active" : ""}" data-nav="${item.id}">
        ${ICONS[item.icon]}
        <span>${item.label.split(" ")[0]}</span>
      </a>`;
  }).join("");
  mobileNav.querySelectorAll("[data-nav]").forEach(el => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      navigateTo(el.dataset.nav);
    });
  });
}

function renderTopbar() {
  const t = getTranslation();
  const titleMap = {
    dashboard: t.dashboard, goals: t.goals, reminders: t.reminders, requests: t.requests,
    claims: t.claims, documents: t.documents, profile: t.profile,
    "adviser-dashboard": "Adviser overview", "adviser-clients": "Clients", "client-profile": "Client profile"
  };
  document.getElementById("topbar-title").textContent = titleMap[state.currentScreen] || "RoyalHub";

  const avatar = document.getElementById("topbar-avatar");
  avatar.textContent = state.role === "adviser" ? "RA" : DEMO_DATA.client.initials;

  document.querySelectorAll(".role-switch button").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.role === state.role);
  });
}

function setupRoleSwitch() {
  document.querySelectorAll(".role-switch button").forEach(btn => {
    btn.addEventListener("click", () => {
      const newRole = btn.dataset.role;
      if (newRole === state.role) return;
      state.role = newRole;
      showToast(newRole === "adviser" ? "Switched to adviser view" : "Switched to client view", "info");
      navigateTo(newRole === "adviser" ? "adviser-dashboard" : "dashboard");
    });
  });
}
