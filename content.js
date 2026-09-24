/* ============================================================
   PORTFOLIO CONTENT — Single source of truth
   Owner: Durgesh Yadav — IT Support Engineer
   Data sourced from: https://yadavdurgesh01.github.io/My-Portfolio/
   The Super Admin panel edits this content and saves overrides
   to localStorage. "Export content.js" produces an updated copy
   of THIS file for uploading to your web host.
   ============================================================ */

const DEFAULT_CONTENT = {
  profile: {
    name: "Durgesh Yadav",
    roles: [
      "IT Support Engineer",
      "Desktop Support Specialist",
      "Network Administrator",
      "Active Directory Administrator"
    ],
    heroDescription:
      "IT Support Engineer at Vserv Infosystems Pvt. Ltd. supporting Haryana Gramin Bank. Specializing in Desktop Support, Network Administration, Active Directory Management, and Banking IT Solutions across 33+ branches.",
    // Photo paths (relative) — upload your own via Admin → Photos
    avatar: "assets/profile.jpg",
    photo: "assets/about.jpg",
    aboutLead:
      "A dedicated IT Support Engineer currently working with Vserv Infosystems Pvt. Ltd., providing comprehensive IT support to Haryana Gramin Bank. With over a year of hands-on experience, I specialize in maintaining IT infrastructure across 33+ bank branches.",
    aboutBody:
      "To leverage my technical expertise in IT infrastructure, desktop support, and network administration to contribute to organizational growth while continuously enhancing my skills in emerging technologies. Seeking opportunities to work with innovative teams in solving complex IT challenges in banking and enterprise environments.",
    infoCards: [
      { icon: "briefcase", title: "Current Role",  value: "Vserv Infosystems Pvt. Ltd." },
      { icon: "server",    title: "Client",        value: "Haryana Gramin Bank" },
      { icon: "cap",       title: "Education",     value: "MCA — AI & Machine Learning" },
      { icon: "pin",       title: "Location",      value: "Haryana, India" }
    ],
    traits: [
      { icon: "cog",   label: "Desktop Expert" },
      { icon: "network", label: "Network Troubleshooting" },
      { icon: "users", label: "Client Focused" },
      { icon: "trend", label: "99% User Satisfaction" }
    ],
    stats: [
      { icon: "building", value: 33,   label: "Branches" },
      { icon: "server",   value: 500,  label: "Systems" },
      { icon: "term",     value: 1000, label: "Tickets" },
      { icon: "users",    value: 99,   label: "Satisfaction %" }
    ]
  },

  skills: {
    categories: [
      {
        id: "system",
        icon: "server",
        label: "Operating Systems",
        items: [
          { name: "Windows 11",       icon: "win",     percent: 95 },
          { name: "Windows Server",   icon: "server",  percent: 90 },
          { name: "Active Directory", icon: "folder",  percent: 92 }
        ]
      },
      {
        id: "network",
        icon: "network",
        label: "Networking",
        items: [
          { name: "LAN / WAN",   icon: "network", percent: 88 },
          { name: "TCP/IP",      icon: "globe",   percent: 85 },
          { name: "DNS / DHCP",  icon: "db",      percent: 87 },
          { name: "VPN",         icon: "shield",  percent: 80 }
        ]
      },
      {
        id: "programming",
        icon: "term",
        label: "Programming",
        items: [
          { name: "HTML",       icon: "term",  percent: 90 },
          { name: "CSS",        icon: "grid",  percent: 85 },
          { name: "JavaScript", icon: "bulb",  percent: 80 },
          { name: "Python",     icon: "rocket",percent: 75 },
          { name: "MySQL",      icon: "db",    percent: 78 }
        ]
      },
      {
        id: "tools",
        icon: "cog",
        label: "Tools",
        items: [
          { name: "Printer Support", icon: "server", percent: 93 },
          { name: "Office 365",      icon: "cloud",  percent: 88 },
          { name: "Finacle",         icon: "db",     percent: 85 },
          { name: "Git / GitHub",    icon: "github", percent: 82 }
        ]
      }
    ],
    cards: [
      {
        icon: "headphones",
        title: "Desktop Support",
        tags: "Hardware Troubleshooting, Software Installation, System Performance Tuning"
      },
      {
        icon: "network",
        title: "Network Troubleshooting",
        tags: "LAN/WAN Configuration, TCP/IP, DNS, DHCP, VPN Troubleshooting"
      },
      {
        icon: "win",
        title: "Windows Administration",
        tags: "Windows 10/11 Installation, System Updates & Patches, Performance Monitoring"
      },
      {
        icon: "folder",
        title: "Active Directory",
        tags: "User Management, Password Reset, Group Policy Setup"
      },
      {
        icon: "server",
        title: "Printer Support",
        tags: "Printer Installation, Driver Configuration, Print Queue Management"
      },
      {
        icon: "cog",
        title: "Hardware Maintenance",
        tags: "Component Replacement, System Upgrades, Preventive Maintenance"
      },
      {
        icon: "grid",
        title: "IT Asset Management",
        tags: "Asset Tracking, Inventory Management, Branch IT Audit"
      },
      {
        icon: "db",
        title: "Banking Software Support",
        tags: "Finacle Support, Application Troubleshooting, User Training"
      }
    ]
  },

  experience: [
    {
      current: true,
      date: "2026 – Present",
      icon: "building",
      role: "IT Support Engineer",
      company: "Vserv Infosystems Pvt. Ltd.",
      location: "Haryana, India · Client: Haryana Gramin Bank",
      responsibilities: [
        "Supporting 33+ Haryana Gramin Bank branches",
        "Desktop & Laptop troubleshooting and maintenance",
        "Network configuration and troubleshooting (LAN/WAN)",
        "Active Directory user management & password resets",
        "Printer installation, configuration & support",
        "Hardware maintenance & component replacement",
        "IT asset management & inventory tracking",
        "Finacle banking software support",
        "Conducting branch IT audits",
        "System performance monitoring & optimization"
      ],
      tech: "Windows, Active Directory, LAN/WAN, Finacle, Office 365"
    },
    {
      current: false,
      date: "Jan 2025 – Dec 2025",
      icon: "building",
      role: "IT Support Engineer",
      company: "Integreon Managed Solutions (India) Pvt. Ltd.",
      location: "Noida, India",
      responsibilities: [
        "Provided day-to-day IT support for desktops, applications, and connectivity",
        "Managed user accounts, access requests, and service tickets",
        "Assisted with hardware setup, maintenance, and inventory records",
        "Supported seamless operations for enterprise clients"
      ],
      tech: "Desktop Support, Office 365, Ticketing, IT Assets"
    }
  ],

  education: [
    {
      kind: "degree",
      icon: "cap",
      ribbon: "Degree",
      title: "Master of Computer Applications",
      subtitle: "Specialization: AI & Machine Learning",
      footer: "Completed",
      badge: ""
    },
    {
      kind: "cert",
      icon: "network",
      ribbon: "Certified",
      title: "Networking Fundamentals",
      subtitle: "Professional Certification",
      footer: "",
      badge: "Certified"
    },
    {
      kind: "cert",
      icon: "headphones",
      ribbon: "Certified",
      title: "IT Support Specialist",
      subtitle: "Industry Certification",
      footer: "",
      badge: "Certified"
    },
    {
      kind: "cert",
      icon: "term",
      ribbon: "Certified",
      title: "Python Programming",
      subtitle: "Programming Certification",
      footer: "",
      badge: "Certified"
    },
    {
      kind: "cert",
      icon: "db",
      ribbon: "Certified",
      title: "SQL & Database Management",
      subtitle: "Database Certification",
      footer: "",
      badge: "Certified"
    },
    {
      kind: "cert",
      icon: "globe",
      ribbon: "Certified",
      title: "CCNA Certification",
      subtitle: "Cisco Networking",
      footer: "",
      badge: "In Progress"
    }
  ],

  resume: {
    // Set a path (e.g. "assets/resume.pdf") or upload via Admin → Resume (base64).
    // null = no resume yet → site shows "available on request".
    file: null,
    fileName: "",
    updated: ""
  },

  contact: {
    introTitle: "Let's discuss your IT support needs",
    introText:
      "Available for banking & enterprise IT support opportunities across Haryana and the NCR region. Feel free to reach out!",
    email: "durgesh@example.com",
    phone: "+91 8932 922 696",
    location: "Haryana, India",
    linkedin: "linkedin.com/in/yadavdurgesh01",
    socials: [
      { platform: "github",   url: "https://github.com/YADAVDURGESH01" },
      { platform: "linkedin", url: "https://www.linkedin.com/in/yadavdurgesh01" },
      { platform: "whatsapp", url: "https://wa.me/918932922696" },
      { platform: "email",    url: "mailto:durgesh@example.com" }
    ]
  },

  footer: {
    tagline: "IT Support Engineer",
    ticker:
      "Active Directory • LAN/WAN • DNS/DHCP • Windows Server • Office 365 • Finacle • Printer Support • IT Asset Management • VPN Troubleshooting • Branch IT Audit • Desktop Support • "
  }
};

/* ---------- Storage helpers (shared by site + admin) ---------- */

const CONTENT_STORE_KEY = "noc_portfolio2_content_v1";
const MESSAGES_STORE_KEY = "noc_portfolio2_messages_v1";

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/** Recursively merge src into dst (arrays replaced wholesale, objects merged). */
function deepMerge(dst, src) {
  if (!src || typeof src !== "object") return dst;
  Object.keys(src).forEach(function (k) {
    if (
      src[k] &&
      typeof src[k] === "object" &&
      !Array.isArray(src[k]) &&
      dst[k] &&
      typeof dst[k] === "object" &&
      !Array.isArray(dst[k])
    ) {
      deepMerge(dst[k], src[k]);
    } else {
      dst[k] = Array.isArray(src[k]) ? deepClone(src[k]) : src[k];
    }
  });
  return dst;
}

/** Get live content: defaults + any admin overrides saved in this browser. */
function getContent() {
  var base = deepClone(DEFAULT_CONTENT);
  try {
    var raw = localStorage.getItem(CONTENT_STORE_KEY);
    if (raw) deepMerge(base, JSON.parse(raw));
  } catch (e) { /* corrupted store → fall back to defaults */ }
  return base;
}

/** Persist content overrides (admin Publish). */
function saveContent(content) {
  localStorage.setItem(CONTENT_STORE_KEY, JSON.stringify(content));
}

/** Remove all overrides → back to shipped defaults. */
function resetContent() {
  localStorage.removeItem(CONTENT_STORE_KEY);
}

/* ----- Contact messages (managed in Admin → Messages) ----- */

function getMessages() {
  try {
    return JSON.parse(localStorage.getItem(MESSAGES_STORE_KEY) || "[]");
  } catch (e) { return []; }
}

function saveMessages(list) {
  localStorage.setItem(MESSAGES_STORE_KEY, JSON.stringify(list));
}

function addMessage(msg) {
  var list = getMessages();
  msg.id = "m_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7);
  msg.date = new Date().toISOString();
  msg.read = false;
  list.unshift(msg);
  saveMessages(list);
  return msg;
}
