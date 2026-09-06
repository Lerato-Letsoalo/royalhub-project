/* ============================================================
   COMPONENT: CLIENT DASHBOARD
   ============================================================ */

function renderDashboard() {
  const c = DEMO_DATA.client;
  const t = getTranslation();
  const el = document.getElementById("screen-dashboard");

  el.innerHTML = `
    <div class="dash-greeting">
      <h1 style="font-size:26px;">${t.greeting}</h1>
      <p class="section-sub">${t.overviewTagline}</p>
    </div>

    <div class="hero-row" style="margin-top:22px;">
      <div class="health-card">
        <div class="health-top">
          <h4>${t.financialHealth.toUpperCase()}</h4>
          <button class="speaker-btn" data-speak="Your financial health score is ${c.financialHealth.score} out of 100, which is ${c.financialHealth.label}.">${ICONS.speaker} Listen</button>
        </div>
        <div class="health-ring-wrap">
          <svg width="86" height="86" viewBox="0 0 86 86">
            <circle cx="43" cy="43" r="36" fill="none" stroke="rgba(255,255,255,0.14)" stroke-width="9"/>
            <circle id="health-ring-fill" cx="43" cy="43" r="36" fill="none" stroke="url(#hg)" stroke-width="9"
              stroke-linecap="round" stroke-dasharray="${2*Math.PI*36}" stroke-dashoffset="${2*Math.PI*36}"
              transform="rotate(-90 43 43)"/>
            <defs><linearGradient id="hg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#C9B8ED"/><stop offset="100%" stop-color="#7C5CC4"/>
            </linearGradient></defs>
          </svg>
          <div>
            <div class="health-score"><span class="count-up" data-count-to="${c.financialHealth.score}">0</span>/100</div>
            <div class="health-label">${c.financialHealth.label}</div>
          </div>
        </div>
        <div class="health-breakdown">
          ${c.financialHealth.breakdown.map(b => `
            <div class="hb-row" title="${b.label} reflects how well this area of your financial life is positioned.">
              <span class="hb-label">${b.label}</span>
              <div class="hb-bar-track"><div class="hb-bar-fill" data-width="${b.value}%"></div></div>
              <span class="hb-val">${b.value}</span>
            </div>`).join("")}
        </div>
      </div>

      <div class="card networth-card">
        <div>
          <div class="nw-top-label">${t.netWorth}</div>
          <div class="nw-value">R <span class="count-up" data-count-to="${c.netWorth.value}" data-format="number">0</span></div>
          <div class="nw-change">${ICONS.trendUp} +${c.netWorth.changePct}% this year</div>
        </div>
        <div class="nw-chart"><canvas id="networth-canvas" height="90"></canvas></div>
        <div class="nw-sync"><span class="pulse-dot"></span> Last synced 2 minutes ago</div>
      </div>
    </div>

    <div class="overview-grid">
      <div class="card ov-card"><div class="ov-label">Investments</div><div class="ov-value">${formatCurrency(c.overview.investments)}</div></div>
      <div class="card ov-card"><div class="ov-label">Protection</div><div class="ov-value">${formatCurrency(c.overview.protection)}</div></div>
      <div class="card ov-card"><div class="ov-label">Monthly Contributions</div><div class="ov-value">${formatCurrency(c.overview.monthlyContributions)}</div></div>
      <div class="card ov-card attn"><div class="ov-label">Actions Due</div><div class="ov-value">${c.overview.actionsDue}</div></div>
    </div>

    <div class="card card-pad">
      <div class="section-head">
        <h2>${t.whatNeedsAttention}</h2>
      </div>
      <div class="attention-list">
        ${DEMO_DATA.attention.map(a => `
          <div class="attn-item">
            <span class="attn-dot ${a.severity}"></span>
            <div class="attn-body">
              <div class="attn-title">${a.title}</div>
              <div class="attn-meta">${a.dateLabel} • ${a.daysRemaining} day${a.daysRemaining === 1 ? "" : "s"} remaining</div>
            </div>
            <div class="attn-actions">
              <button class="speaker-btn" data-speak="${a.audioText}">${ICONS.speaker}</button>
              <button class="btn btn-secondary btn-sm" data-attn-action="${a.id}">${a.cta}</button>
            </div>
          </div>`).join("")}
      </div>
    </div>

    <div class="dash-lower">
      <div class="card card-pad">
        <div class="section-head">
          <h2>Your goals</h2>
          <a href="#" class="link-action" data-nav="goals">View all</a>
        </div>
        <div class="goal-mini-list">
          ${DEMO_DATA.goals.slice(0, 3).map(g => `
            <div class="goal-mini">
              <div class="goal-mini-icon">${ICONS[g.icon] || ICONS.target}</div>
              <div class="goal-mini-body">
                <div class="goal-mini-top"><span>${g.name}</span><span>${Math.round(g.current / g.target * 100)}%</span></div>
                <div class="mini-bar-track"><div class="mini-bar-fill" data-width="${Math.round(g.current / g.target * 100)}%"></div></div>
              </div>
            </div>`).join("")}
        </div>
      </div>

      <div class="insight-card">
        <div class="insight-eyebrow">${ICONS.sparkle} Royal Insight</div>
        <p class="insight-text">${DEMO_DATA.royalInsight.text}</p>
        <span class="insight-demo-tag">Illustrative, prototype-only estimate — not a regulated projection.</span>
        <button class="btn btn-secondary btn-sm" id="explore-impact-btn" style="align-self:flex-start;">Explore impact</button>
        <div class="scenario-box" id="scenario-box">
          <div class="scenario-row"><span>Current contribution</span><strong>${formatCurrency(DEMO_DATA.royalInsight.current)}/month</strong></div>
          <div class="scenario-row"><span>New contribution</span><strong>${formatCurrency(DEMO_DATA.royalInsight.proposed)}/month</strong></div>
          <div class="scenario-row"><span>Estimated target improvement</span><strong>${DEMO_DATA.royalInsight.monthsSaved} months sooner</strong></div>
        </div>
      </div>
    </div>
  `;

  el.querySelectorAll("[data-nav]").forEach(a => a.addEventListener("click", (e) => { e.preventDefault(); navigateTo(a.dataset.nav); }));
  el.querySelectorAll("[data-attn-action]").forEach(btn => btn.addEventListener("click", () => {
    showToast("Opening reminder…", "info");
    navigateTo("reminders");
  }));
  document.getElementById("explore-impact-btn").addEventListener("click", () => {
    document.getElementById("scenario-box").classList.toggle("show");
  });

  animateCountUps(el);
  animateBars(el);
  drawNetWorthChart(c.netWorth.trend);
  bindSpeakers(el);

  // animate the health ring
  requestAnimationFrame(() => {
    const ring = document.getElementById("health-ring-fill");
    const circumference = 2 * Math.PI * 36;
    const offset = circumference - (c.financialHealth.score / 100) * circumference;
    setTimeout(() => { ring.style.transition = "stroke-dashoffset 1.2s cubic-bezier(.2,.8,.2,1)"; ring.style.strokeDashoffset = offset; }, 80);
  });
}

function drawNetWorthChart(trend) {
  const canvas = document.getElementById("networth-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = 90 * dpr;
  ctx.scale(dpr, dpr);
  const w = rect.width, h = 90;
  const min = Math.min(...trend) * 0.98, max = Math.max(...trend) * 1.02;
  const pts = trend.map((v, i) => ({
    x: (i / (trend.length - 1)) * w,
    y: h - ((v - min) / (max - min)) * (h - 10) - 5
  }));

  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, "rgba(91,62,150,0.22)");
  grad.addColorStop(1, "rgba(91,62,150,0)");

  ctx.beginPath();
  pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
  ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath();
  ctx.fillStyle = grad; ctx.fill();

  ctx.beginPath();
  pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
  ctx.strokeStyle = "#5B3E96"; ctx.lineWidth = 2.5; ctx.lineJoin = "round"; ctx.stroke();

  const last = pts[pts.length - 1];
  ctx.beginPath(); ctx.arc(last.x, last.y, 4, 0, Math.PI * 2);
  ctx.fillStyle = "#5B3E96"; ctx.fill();
}
