/* ============================================================
   ROYALHUB — DEMO DATA
   All data below is fictional and generated for prototype/demo
   purposes only. No real personal, financial or identity data
   is used anywhere in this file.
   ============================================================ */

const DEMO_DATA = {
  client: {
    id: "RSF-1048",
    firstName: "Lerato",
    fullName: "Lerato Letsoalo",
    initials: "LL",
    email: "lerato.demo@example.co.za",
    phone: "071 000 0000",
    idNumber: "•••••• 0000 08 0",
    address: "12 Jacaranda Close, Sandton, Johannesburg, 2196",
    language: "en",
    financialHealth: {
      score: 78,
      label: "Healthy",
      breakdown: [
        { key: "protection", label: "Protection", value: 86 },
        { key: "savings", label: "Savings", value: 74 },
        { key: "goals", label: "Goals", value: 68 },
        { key: "documents", label: "Documents", value: 92 }
      ]
    },
    netWorth: {
      value: 1420000,
      changePct: 8.4,
      trend: [1180000, 1225000, 1260000, 1310000, 1345000, 1360000, 1395000, 1420000]
    },
    overview: {
      investments: 1080450,
      protection: 2500000,
      monthlyContributions: 8750,
      actionsDue: 3
    }
  },

  attention: [
    {
      id: "att-1",
      title: "Driving licence expires",
      date: "2026-09-28",
      dateLabel: "28 Sep 2026",
      daysRemaining: 23,
      severity: "amber",
      cta: "View reminder",
      audioText: "Your driving licence expires on 28 September, in 23 days."
    },
    {
      id: "att-2",
      title: "Insurance valuation certificate",
      date: "2026-10-06",
      dateLabel: "6 Oct 2026",
      daysRemaining: 31,
      severity: "amber",
      cta: "View document",
      audioText: "Your insurance valuation certificate is due in 31 days."
    },
    {
      id: "att-3",
      title: "Annual financial review",
      date: "2026-09-12",
      dateLabel: "12 Sep 2026 • 10:00",
      daysRemaining: 7,
      severity: "green",
      cta: "Confirm meeting",
      audioText: "Your annual financial review is booked for 12 September at 10 a.m."
    }
  ],

  goals: [
    {
      id: "goal-1",
      icon: "home",
      name: "First Home",
      current: 320000,
      target: 500000,
      targetDate: "May 2028",
      monthly: 5200,
      status: "On track",
      statusTone: "green",
      shared: false
    },
    {
      id: "goal-2",
      icon: "cap",
      name: "Education Fund",
      current: 162000,
      target: 200000,
      targetDate: "Jan 2027",
      monthly: 2100,
      status: "Almost there",
      statusTone: "green",
      shared: false
    },
    {
      id: "goal-3",
      icon: "sun",
      name: "Family Holiday",
      current: 21500,
      target: 50000,
      targetDate: "Dec 2026",
      monthly: 1400,
      status: "Building",
      statusTone: "amber",
      shared: false
    },
    {
      id: "goal-4",
      icon: "family",
      name: "Family Home",
      current: 855000,
      target: 1500000,
      targetDate: "Mar 2030",
      monthly: 8500,
      status: "On track",
      statusTone: "green",
      shared: true,
      owners: [
        { initials: "LL", name: "Lerato" },
        { initials: "TM", name: "Partner" }
      ]
    }
  ],

  royalInsight: {
    text: "Increasing your home deposit contribution by R800/month could move your target date forward by approximately 4 months.",
    goalId: "goal-1",
    current: 5200,
    proposed: 6000,
    monthsSaved: 4
  },

  reminders: [
    {
      id: "rem-1",
      title: "Driving licence expiry",
      due: "2026-09-28",
      dueLabel: "Due 28 Sep",
      recipient: "Client",
      status: "due-soon",
      priority: "medium",
      automated: false
    },
    {
      id: "rem-2",
      title: "Insurance valuation certificate",
      due: "2026-10-06",
      dueLabel: "Due 6 Oct",
      recipient: "Client + Adviser",
      status: "due-soon",
      priority: "medium",
      automated: false
    },
    {
      id: "rem-3",
      title: "Annual financial review",
      due: "2026-09-12",
      dueLabel: "12 Sep",
      recipient: "Adviser",
      status: "due-soon",
      priority: "high",
      automated: false
    },
    {
      id: "rem-4",
      title: "Retirement fee renewal",
      due: "2026-11-12",
      dueLabel: "12 Nov",
      recipient: "Adviser",
      status: "upcoming",
      priority: "low",
      automated: true
    },
    {
      id: "rem-5",
      title: "Birthday",
      due: "2026-10-19",
      dueLabel: "19 Oct",
      recipient: "Adviser",
      status: "upcoming",
      priority: "low",
      automated: true
    },
    {
      id: "rem-6",
      title: "Vehicle licence renewal",
      due: "2026-08-02",
      dueLabel: "2 Aug",
      recipient: "Client",
      status: "overdue",
      priority: "high",
      automated: false
    },
    {
      id: "rem-7",
      title: "Retirement annuity statement sent",
      due: "2026-07-15",
      dueLabel: "15 Jul",
      recipient: "Client",
      status: "completed",
      priority: "low",
      automated: true
    }
  ],

  claims: [
    {
      id: "RSF-2048",
      insurer: "Sanlam",
      type: "Motor",
      status: "In progress",
      statusStage: 5,
      lastUpdated: "2026-09-03T10:14:00",
      nextAction: "Vehicle assessment",
      timeline: [
        { label: "Claim submitted", date: "2 Sep • 09:02", done: true },
        { label: "Evidence received", date: "2 Sep • 09:04", done: true },
        { label: "Insurer notified", date: "2 Sep • 09:10", done: true },
        { label: "Claim number received", date: "2 Sep • 09:40", done: true },
        { label: "Vehicle assessment", date: "Pending", done: false, current: true },
        { label: "Authorisation", date: "Upcoming", done: false },
        { label: "Repair", date: "Upcoming", done: false },
        { label: "Vehicle collection", date: "Upcoming", done: false }
      ]
    },
    {
      id: "RSF-2049",
      insurer: "Santam",
      type: "Motor",
      status: "Submitted",
      statusStage: 4,
      lastUpdated: "2026-09-03T10:14:00",
      nextAction: "Vehicle assessment",
      timeline: [
        { label: "Claim submitted", date: "3 Sep • 10:04", done: true },
        { label: "Evidence received", date: "3 Sep • 10:05", done: true },
        { label: "Insurer notified", date: "3 Sep • 10:06", done: true },
        { label: "Claim number received", date: "3 Sep • 10:14", done: true },
        { label: "Vehicle assessment", date: "Pending", done: false, current: true },
        { label: "Authorisation", date: "Upcoming", done: false },
        { label: "Repair", date: "Upcoming", done: false },
        { label: "Vehicle collection", date: "Upcoming", done: false }
      ]
    }
  ],

  requests: [
    {
      id: "RSF-1053",
      type: "Policy document",
      status: "Processing",
      submitted: "2026-08-30",
      timeline: [
        { label: "Request received", done: true },
        { label: "Adviser notified", done: true },
        { label: "Provider request", done: false, current: true },
        { label: "Document available", done: false }
      ]
    }
  ],

  requestTypes: [
    { id: "req-policy-doc", icon: "doc", name: "Request policy document" },
    { id: "req-consult", icon: "calendar", name: "Request consultation" },
    { id: "req-address", icon: "pin", name: "Change address" },
    { id: "req-bank", icon: "card", name: "Change bank details" },
    { id: "req-border", icon: "plane", name: "Request border letter" },
    { id: "req-irp5", icon: "doc", name: "Request IRP5" },
    { id: "req-update-info", icon: "user", name: "Update client information" },
    { id: "req-submit-info", icon: "upload", name: "Submit financial information" }
  ],

  documents: [
    { id: "doc-1", category: "Insurance", name: "Motor Insurance Policy", provider: "Santam", date: "3 Sep 2026", status: "Current" },
    { id: "doc-2", category: "Investments", name: "Investment Statement", provider: "Allan Gray", date: "31 Aug 2026", status: "Current" },
    { id: "doc-3", category: "Financial Planning", name: "Financial Plan", provider: "Royal Square", date: "12 Aug 2026", status: "Current" },
    { id: "doc-4", category: "Insurance", name: "Life Insurance Policy", provider: "Liberty", date: "2 Jul 2026", status: "Current" },
    { id: "doc-5", category: "Tax", name: "IRP5 Certificate", provider: "Royal Square", date: "28 Feb 2026", status: "Archived" },
    { id: "doc-6", category: "Identity", name: "Certified ID Copy", provider: "Client upload", date: "14 Jan 2026", status: "Verified" },
    { id: "doc-7", category: "Claims", name: "Claim Evidence Pack — RSF-2049", provider: "Santam", date: "3 Sep 2026", status: "Attached" }
  ],

  providers: [
    { name: "Santam", status: "Connected", lastSynced: "2 minutes ago" },
    { name: "Sanlam", status: "Connected", lastSynced: "5 minutes ago" },
    { name: "Discovery", status: "Syncing", lastSynced: "Syncing now" },
    { name: "Old Mutual", status: "Connected", lastSynced: "1 hour ago" },
    { name: "Momentum", status: "Needs attention", lastSynced: "3 days ago" },
    { name: "Liberty", status: "Connected", lastSynced: "18 minutes ago" },
    { name: "Allan Gray", status: "Connected", lastSynced: "31 minutes ago" }
  ],

  notifications: [
    { id: "n1", text: "Your claim RSF-2049 has moved to assessment.", time: "2m ago", type: "claim", read: false },
    { id: "n2", text: "Your annual review is booked for 12 September.", time: "1h ago", type: "reminder", read: false },
    { id: "n3", text: "Your insurance valuation certificate is due soon.", time: "3h ago", type: "reminder", read: true },
    { id: "n4", text: "RoyalHub received your document.", time: "Yesterday", type: "document", read: true }
  ],

  insurers: ["Santam", "Sanlam", "Discovery", "Momentum", "Other"],

  accidentChecklist: [
    { id: "chk-1", label: "Photograph road surface and direction of travel" },
    { id: "chk-2", label: "Capture address or nearest cross streets" },
    { id: "chk-3", label: "Photograph every vehicle involved" },
    { id: "chk-4", label: "Photograph people involved where appropriate" },
    { id: "chk-5", label: "Capture licence plates" },
    { id: "chk-6", label: "Capture registration discs" },
    { id: "chk-7", label: "Capture ID documents" },
    { id: "chk-8", label: "Capture witness names and contact details" },
    { id: "chk-9", label: "Record witness voice note" },
    { id: "chk-10", label: "Capture other party insurance details" }
  ],

  uploadCategories: [
    "Accident photos", "Driver licence", "Registration disc",
    "ID documents", "Other vehicle documents", "Accident sketch", "Witness information"
  ],

  adviser: {
    name: "Adviser",
    kpis: { clients: 248, actionsDue: 17, overdue: 4, claimsInProgress: 12, docsAwaitingReview: 8 },
    priorities: [
      { time: "08:30", label: "Financial review — Lerato" },
      { time: "09:15", label: "Insurance valuation — 3 clients" },
      { time: "10:00", label: "Claim update — RSF-2048" },
      { time: "11:30", label: "Retirement fee renewal" }
    ],
    attentionClients: [
      { id: "c1", name: "Lerato Letsoalo", issue: "Financial review due", date: "12 Sep", tone: "amber" },
      { id: "c2", name: "Karabo Nkosi", issue: "Document missing", date: "—", tone: "red" },
      { id: "c3", name: "Sipho Dlamini", issue: "Driving licence expired", date: "—", tone: "red" }
    ]
  },

  clientDirectory: [
    { id: "RSF-1048", name: "Lerato Letsoalo", initials: "LL", health: 78, upcoming: "Annual review — 12 Sep", lastContact: "3 Sep 2026", status: "attention" },
    { id: "RSF-1049", name: "Karabo Nkosi", initials: "KN", health: 54, upcoming: "Document missing", lastContact: "28 Aug 2026", status: "attention" },
    { id: "RSF-1050", name: "Sipho Dlamini", initials: "SD", health: 41, upcoming: "Driving licence expired", lastContact: "12 Aug 2026", status: "overdue" },
    { id: "RSF-1051", name: "Naledi Mokoena", initials: "NM", health: 88, upcoming: "None", lastContact: "1 Sep 2026", status: "healthy" },
    { id: "RSF-1052", name: "Thabo Van Wyk", initials: "TV", health: 92, upcoming: "None", lastContact: "30 Aug 2026", status: "healthy" },
    { id: "RSF-1053", name: "Zanele Khumalo", initials: "ZK", health: 63, upcoming: "Claim RSF-2048 in progress", lastContact: "2 Sep 2026", status: "claims" }
  ],

  translations: {
    en: {
      dashboard: "Dashboard", goals: "My Goals", reminders: "Reminders", requests: "Requests",
      claims: "Claims", documents: "Documents", profile: "Profile",
      greeting: "Good morning, Lerato.", overviewTagline: "Here's your financial picture at a glance.",
      financialHealth: "Financial Health", netWorth: "Estimated net worth",
      whatNeedsAttention: "What needs your attention?", makeVisible: "Make the future visible.",
      goalSubtitle: "Turn your financial ambitions into measurable progress.",
      nothingSlips: "Nothing important slips through.",
      fromAccident: "From accident to resolution.",
      claimsSubtitle: "A guided evidence-first workflow for stressful moments.",
      whatDoYouNeed: "What do you need today?",
      secure: "Secure portal", secureSub: "Your information is protected",
      signIn: "Sign in", welcome: "Welcome to RoyalHub", tagline: "Your financial life, connected."
    },
    zu: {
      dashboard: "Ideshibhodi", goals: "Izinhloso Zami", reminders: "Izikhumbuzo", requests: "Izicelo",
      claims: "Izimangalo", documents: "Amadokhumenti", profile: "Iphrofayela",
      greeting: "Sawubona ekuseni, Lerato.", overviewTagline: "Nasi isithombe sezimali zakho.",
      financialHealth: "Impilo Yezimali", netWorth: "Inani lengcebo elilinganiselwe",
      whatNeedsAttention: "Yini edinga ukunakwa kwakho?", makeVisible: "Yenza ikusasa libonakale.",
      goalSubtitle: "Guqula izifiso zakho zezimali zibe yinqubekelaphambili engalinganiswa.",
      nothingSlips: "Akukho okubalulekile okushonayo.",
      fromAccident: "Kusukela engozini kuya ekuxazululweni.",
      claimsSubtitle: "Inqubo eqondisiwe egxile ebufakazini yezikhathi ezicindezelayo.",
      whatDoYouNeed: "Yini oyidingayo namuhla?",
      secure: "Iphothali evikelekile", secureSub: "Ulwazi lwakho luvikelekile",
      signIn: "Ngena", welcome: "Wamukelekile ku-RoyalHub", tagline: "Impilo yakho yezimali, ixhunyiwe."
    }
  }
};
