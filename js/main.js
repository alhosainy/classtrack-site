/* ============================================================
   ClassTrack landing page — runtime
   i18n (AR default / EN), light-dark theme, screenshot carousel.
   ============================================================ */

const ICONS = {
  rollcall:
    '<path d="M3 5.5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-13Zm7 10 5-5"/><path d="m9 11 1 1 2-2"/>',
  groups:
    '<path d="M17 20v-1.5a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4V20"/><circle cx="10" cy="7" r="4"/><path d="M23 20v-1.5a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  payments:
    '<rect x="2" y="5" width="20" height="14" rx="2.5"/><path d="M2 9h20"/><circle cx="17" cy="14" r="1.4"/>',
  tests: '<path d="M3 3v18h18"/><path d="m7 15 3.2-3.8 2.4 2.3L18 7"/>',
  reports:
    '<path d="M21 12a8 8 0 0 1-8 8H4l1.5-2.5A8 8 0 1 1 21 12Z"/><path d="M8 10.5h8M8 14h5"/>',
  qr: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM20 14h1M17 20v1M21 18v3"/>',
  offline:
    '<path d="M2 20h16"/><rect x="7" y="4" width="10" height="16" rx="2.5"/><path d="M12 17h.01"/>',
  language:
    '<path d="M4 5h9M8.5 3v2M5.5 12a9 9 0 0 0 6-4M9 9.5A12 12 0 0 1 20 5"/><path d="M17 21l3-7 3 7M18.5 18.5h3"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  cloud:
    '<path d="M6 18h11a4 4 0 0 0 .4-7.98A6.5 6.5 0 0 0 4.4 9.5 4.5 4.5 0 0 0 6 18Z"/>',
  shield: '<path d="M12 22s8-3.5 8-9V5l-8-3-8 3v8c0 5.5 8 9 8 9Z"/>',
  bell: '<path d="M18 9a6 6 0 0 0-12 0c0 7-3 8-3 8h18s-3-1-3-8"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>',
  download:
    '<path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>',
  github:
    '<path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>',
  playStore:
    '<path d="M3 4.5 13.5 12 3 19.5V4.5ZM14 10.6l2.8-1.6 3.9 2.3-3.9 2.3L14 13.4v-2.8ZM3 4.5 13.5 12 3 19.5V4.5Z"/>',
  apple:
    '<path d="M16.5 12.7c0-2.5 2-3.7 2.1-3.8-1.2-1.7-3-1.9-3.6-1.9-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.3-.9-1.7 0-3.3 1-4.2 2.5-1.8 3.1-.5 7.7 1.3 10.2.8 1.2 1.9 2.6 3.3 2.5 1.3 0 1.8-.8 3.4-.8s2 .8 3.4.8c1.4 0 2.3-1.2 3.2-2.4.9-1.3 1.3-2.6 1.3-2.7-.1 0-2.5-1-2.5-3.5ZM13.9 5.3c.7-.9 1.2-2 1-3.3-1.2 0-2.4.8-3.1 1.7-.6.8-1.2 2.1-1 3.2 1.3.2 2.5-.6 3.1-1.6Z"/>',
};

/* ---------------- Copy (AR default) ---------------- */

const I18N = {
  ar: {
    meta: {
      title: "ClassTrack — كل ما يحتاجه المدرّس لإدارة حصصه",
      desc: "أدِر مجموعاتك، الحضور، الدفعات، والاختبارات في تطبيق واحد يعمل بدون إنترنت",
    },

    nav: {
      features: "المميزات",
      how: "كيف تعمل",
      screens: "لقطات الشاشة",
      download: "التحميل",
      cta: "حمّل الآن",
    },

    hero: {
      badge: "يعمل بدون إنترنت · أندرويد · مجاني",
      title: "كل أدوات المدرّس في تطبيق واحد",
      lead: "ClassTrack يساعدك على تنظيم حصصك: سجل الحضور والواجبات، تابع الدفعات، سجّل الاختبارات، وأرسل التقارير للأهالي عبر واتساب — كل شيء على جهازك.",
      download: "تحميل التطبيق",
      github: "عرض على GitHub",
      points: [
        { icon: "offline", text: "بدون إنترنت وبدون حساب" },
        { icon: "language", text: "عربي وإنجليزي بالكامل" },
        { icon: "shield", text: "بياناتك تبقى على جهازك" },
      ],
      caption: "نظرة سريعة على التطبيق",
    },

    stats: [
      { value: "100%", label: "يعمل بدون إنترنت" },
      { value: "ع/EN", label: "دعم كامل للغتين" },
      { value: "٣", label: "أنواع تذكيرات ذكية" },
      { value: ".zip", label: "نسخ احتياطي واستعادة" },
    ],

    features: {
      overline: "المميزات",
      title: "ماذا يقدم لك ClassTrack؟",
      subtitle: "كل ما تحتاجه لإدارة الحصص في مكان واحد",
      items: [
        {
          icon: "rollcall",
          title: "سجل الحضور",
          desc: 'حاضر / غائب / متأخر مع تقييم الواجب بلمسة واحدة، وزر "الكل حاضر" لمسح المجموعة في ثانية.',
        },
        {
          icon: "groups",
          title: "المجموعات والجداول",
          desc: "مجموعات بجدول أسبوعي مرن مع منع تعارض الحصص، من المركز أو أونلاين.",
        },
        {
          icon: "payments",
          title: "الدفعات",
          desc: "دفع شهري أو بالحصة، مع نسبة تحصيل واضحة ومتابعة لكل طالب ومجموعة.",
        },
        {
          icon: "tests",
          title: "الاختبارات",
          desc: "حدّد الاختبارات، سجّل الدرجات، وشاهد المتوسطات في رسوم بيانية واضحة.",
        },
        {
          icon: "reports",
          title: "تقارير واتساب",
          desc: "تقرير يومي لكل طالب وملخص درجات للمجموعة، بقالب عربي جاهز للتخصيص.",
        },
        {
          icon: "qr",
          title: "رموز QR",
          desc: "لكل طالب رمز QR ثابت — امسح الرمز وافتح الملف مباشرة، وشارك الملصق على واتساب.",
        },
        {
          icon: "cloud",
          title: "نسخ احتياطي ومزامنة",
          desc: "تصدير واستعادة كامل للبيانات، مع مزامنة سحابية اختيارية عند تسجيل الدخول.",
        },
        {
          icon: "bell",
          title: "تذكيرات ذكية",
          desc: "تذكير قبل الحصص، تذكير بالدفعات، وتنبيه عند تكرار غياب الطالب.",
        },
      ],
    },

    how: {
      overline: "كيف تعمل",
      title: "ثلاث خطوات وتبدأ",
      steps: [
        {
          title: "أنشئ مجموعاتك",
          desc: "أضف مجموعات بمواعيدها الأسبوعية ثم الطلاب — واحدًا تلو الآخر أو دفعة واحدة.",
        },
        {
          title: "تابع يوميًا",
          desc: "سجّل الحضور والواجبات، تابع الدفعات، وسجّل درجات الاختبارات أثناء الحصة.",
        },
        {
          title: "شارك النتائج",
          desc: "أرسل التقارير اليومية وملخص الدرجات للأهالي عبر واتساب بضغطة واحدة.",
        },
      ],
    },

    screens: {
      overline: "لقطات الشاشة",
      title: "صور من داخل التطبيق",
      subtitle: "تصميم بسيط وواضح مصمم لمدرّس مشغول",
      items: [
        { img: "home.png", caption: "الرئيسية — تحليلات الشهر" },
        { img: "group_hub.png", caption: "سجل الحضور والواجب" },
        { img: "schedule.png", caption: "الجدول الأسبوعي" },
        { img: "payments.png", caption: "الدفعات ونسبة التحصيل" },
        { img: "attendance_grid.png", caption: "شبكة الحضور الشهرية" },
        { img: "student_qr.png", caption: "كود QR لكل طالب" },
      ],
    },

    carousel: [
      { img: "home.png", caption: "الرئيسية — تحليلات الشهر" },
      { img: "group_hub.png", caption: "سجل الحضور والواجب" },
      { img: "schedule.png", caption: "الجدول الأسبوعي" },
      { img: "payments.png", caption: "الدفعات ونسبة التحصيل" },
    ],

    download: {
      title: "حمّل ClassTrack الآن",
      desc: "متاح على أندرويد. حمّل أحدث إصدار مباشرة من GitHub، أو انتظر النسخ الرسمية قريبًا.",
      apk: "تحميل APK",
      apkNote: "أحدث إصدار مباشرة من GitHub Releases",
      play: "قريبًا على Google Play",
      ios: "iOS قريبًا",
      count: "تحميل",
    },

    footer: {
      tagline: "أُنجز بشغف لمدرّسين الخصوصي.",
      rights: "جميع الحقوق محفوظة.",
    },
  },

  en: {
    meta: {
      title: "ClassTrack — Everything a private teacher needs",
      desc: "Manage your groups, roll-call, payments, and tests in one app that works offline",
    },

    nav: {
      features: "Features",
      how: "How it works",
      screens: "Screenshots",
      download: "Download",
      cta: "Get the app",
    },

    hero: {
      badge: "Offline-first · Android · Free",
      title: "Everything a private teacher needs, in one app",
      lead: "ClassTrack helps you run your classes: take roll-call and homework quality, track payments, record tests, and send reports to parents over WhatsApp — all on your device, no internet required.",
      download: "Download the app",
      github: "View on GitHub",
      points: [
        { icon: "offline", text: "Works offline, no account needed" },
        { icon: "language", text: "Full Arabic & English" },
        { icon: "shield", text: "Your data stays on your device" },
      ],
      caption: "A quick look inside",
    },

    stats: [
      { value: "100%", label: "Works fully offline" },
      { value: "AR/EN", label: "Full bilingual support" },
      { value: "3", label: "Smart reminder types" },
      { value: ".zip", label: "Backup & restore" },
    ],

    features: {
      overline: "Features",
      title: "What ClassTrack does for you",
      subtitle: "Everything you need to run your classes in one place",
      items: [
        {
          icon: "rollcall",
          title: "Roll-call",
          desc: 'Present / Absent / Late plus homework quality in one tap, with a "mark all present" shortcut to clear the room in a second.',
        },
        {
          icon: "groups",
          title: "Groups & schedules",
          desc: "Groups with a flexible weekly schedule and automatic conflict detection — center or online.",
        },
        {
          icon: "payments",
          title: "Payments",
          desc: "Monthly or per-session billing, with a clear collection rate per student and group.",
        },
        {
          icon: "tests",
          title: "Tests & scores",
          desc: "Define tests, record scores, and watch averages in clear progress charts.",
        },
        {
          icon: "reports",
          title: "WhatsApp reports",
          desc: "A daily report per student and a group grades summary, with a customizable Arabic template.",
        },
        {
          icon: "qr",
          title: "QR codes",
          desc: "Every student gets a stable QR — scan to open their profile instantly and share the label on WhatsApp.",
        },
        {
          icon: "cloud",
          title: "Backup & sync",
          desc: "Full export and restore, with optional cloud sync once you sign in.",
        },
        {
          icon: "bell",
          title: "Smart reminders",
          desc: "Lesson reminders, payment due reminders, and alerts when a student crosses the absence threshold.",
        },
      ],
    },

    how: {
      overline: "How it works",
      title: "Three steps to get going",
      steps: [
        {
          title: "Set up your groups",
          desc: "Add groups with their weekly schedule, then add students — one by one or in bulk.",
        },
        {
          title: "Track it daily",
          desc: "Take roll-call, follow payments, and log test scores as class runs.",
        },
        {
          title: "Share the results",
          desc: "Send daily reports and grade summaries to parents over WhatsApp in one tap.",
        },
      ],
    },

    screens: {
      overline: "Screenshots",
      title: "Inside the app",
      subtitle: "A clean interface built for a busy teacher",
      items: [
        { img: "home.png", caption: "Home — monthly analytics" },
        { img: "group_hub.png", caption: "Roll-call & homework" },
        { img: "schedule.png", caption: "Weekly schedule" },
        { img: "payments.png", caption: "Payments & collection rate" },
        { img: "attendance_grid.png", caption: "Monthly attendance grid" },
        { img: "student_qr.png", caption: "A QR code per student" },
      ],
    },

    carousel: [
      { img: "home.png", caption: "Home — monthly analytics" },
      { img: "group_hub.png", caption: "Roll-call & homework" },
      { img: "schedule.png", caption: "Weekly schedule" },
      { img: "payments.png", caption: "Payments & collection rate" },
    ],

    download: {
      title: "Get ClassTrack now",
      desc: "Available on Android. Download the latest version straight from GitHub, or wait for official store releases soon.",
      apk: "Download APK",
      apkNote: "Latest version straight from GitHub Releases",
      play: "Coming soon on Google Play",
      ios: "iOS coming soon",
      count: "downloads",
    },

    footer: {
      tagline: "Built with love for private teachers.",
      rights: "All rights reserved.",
    },
  },
};

/* ---------------- i18n engine ---------------- */

let lang = localStorage.getItem("ct-lang") || "ar";
let savedTheme = localStorage.getItem("ct-theme") || "light";

const svg = (inner, viewBox = "0 0 24 24") =>
  `<svg viewBox="${viewBox}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;

function t(key) {
  const dict = I18N[lang];
  return key.split(".").reduce((o, k) => o?.[k], dict);
}

function applyLanguage() {
  const dict = I18N[lang];
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.title = dict.meta.title;
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute("content", dict.meta.desc);

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    el.innerHTML = t(el.dataset.i18nHtml);
  });

  document.getElementById("langToggle").textContent =
    lang === "ar" ? "EN" : "ع";
  document.getElementById("downloadBtnIcon").innerHTML = svg(ICONS.download);
  document.getElementById("githubBtnIcon").innerHTML = svg(ICONS.github);
  document.getElementById("apkBtnIcon").innerHTML = svg(ICONS.download);

  renderHeroPoints();
  renderStats();
  renderFeatures();
  renderHow();
  renderGallery();
  renderCarousel();
  renderDownload();
  renderFooter();
  updateDownloadBadge();
}

function renderHeroPoints() {
  document.getElementById("heroPoints").innerHTML = t("hero.points")
    .map((p) => `<li>${svg(ICONS[p.icon])} <span>${p.text}</span></li>`)
    .join("");
}

function renderStats() {
  document.getElementById("statsGrid").innerHTML = t("stats")
    .map(
      (s) =>
        `<div><div class="stat-value">${s.value}</div><div class="stat-label">${s.label}</div></div>`,
    )
    .join("");
}

function renderFeatures() {
  document.getElementById("featuresGrid").innerHTML = t("features.items")
    .map(
      (f) =>
        `<article class="feature-card"><span class="feature-icon">${svg(ICONS[f.icon])}</span><h3>${f.title}</h3><p>${f.desc}</p></article>`,
    )
    .join("");
}

function renderHow() {
  document.getElementById("howGrid").innerHTML = t("how.steps")
    .map(
      (s) => `<div class="how-step"><h3>${s.title}</h3><p>${s.desc}</p></div>`,
    )
    .join("");
}

function renderGallery() {
  document.getElementById("galleryGrid").innerHTML = t("screens.items")
    .map(
      (g) =>
        `<figure class="gallery-item"><div class="mini-phone"><div class="phone-screen"><img  src="assets/screenshots/${g.img}" alt="${g.caption}" loading="lazy"></div></div><figcaption>${g.caption}</figcaption></figure>`,
    )
    .join("");
}

/* ---------------- Carousel ---------------- */

function renderCarousel() {
  const slides = t("carousel");
  const screen = document.getElementById("phoneScreen");
  screen.innerHTML = slides
    .map(
      (s, i) =>
        `<img src="assets/screenshots/${s.img}" alt="${s.caption}" class="${i === 0 ? "active" : ""}">`,
    )
    .join("");

  const dots = document.getElementById("carouselDots");
  dots.innerHTML = slides
    .map(
      (_, i) =>
        `<button data-slide="${i}" aria-label="slide ${i + 1}" class="${i === 0 ? "active" : ""}"></button>`,
    )
    .join("");

  const caption = document.getElementById("carouselCaption");
  caption.textContent = slides[0].caption;

  let current = 0;
  clearInterval(window._carouselTimer);
  window._carouselTimer = setInterval(
    () => next((current + 1) % slides.length),
    4500,
  );

  function next(i) {
    current = i;
    screen
      .querySelectorAll("img")
      .forEach((img, idx) => img.classList.toggle("active", idx === i));
    dots
      .querySelectorAll("button")
      .forEach((btn, idx) => btn.classList.toggle("active", idx === i));
    caption.textContent = slides[i].caption;
  }

  dots.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      clearInterval(window._carouselTimer);
      next(Number(btn.dataset.slide));
      window._carouselTimer = setInterval(
        () => next((current + 1) % slides.length),
        4500,
      );
    });
  });
}

/* ---------------- Download / footer ---------------- */

function renderDownload() {
  document.getElementById("downloadTitle").textContent = t("download.title");
  document.getElementById("downloadDesc").textContent = t("download.desc");
  document.getElementById("apkBtnText").textContent = t("download.apk");
  document.getElementById("downloadNote").textContent = t("download.apkNote");

  document.getElementById("playStoreCard").innerHTML =
    `${svg(ICONS.playStore)} <span>${t("download.play")}</span>`;
  document.getElementById("iosCard").innerHTML =
    `${svg(ICONS.apple)} <span>${t("download.ios")}</span>`;
}

function renderFooter() {
  document.getElementById("footerTagline").textContent = t("footer.tagline");
  document.getElementById("footerRights").textContent =
    `${new Date().getFullYear()} ClassTrack — ${t("footer.rights")}`;
}

/* ---------------- Theme ---------------- */

function applyTheme() {
  const dark = savedTheme === "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);
  document.getElementById("themeToggle").innerHTML = svg(
    ICONS[dark ? "sun" : "moon"],
  );
  if (dark) {
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", "#12161b");
  } else {
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", "#f6f8fa");
  }
}

/* ---------------- APK link (versioned asset) ---------------- */

const APK_FALLBACK =
  "https://github.com/alhosainy/classtrack-site/releases/latest";
const SITE_API =
  "https://api.github.com/repos/alhosainy/classtrack-site/releases/latest";

async function setApkLinks() {
  const links = document.querySelectorAll("[data-apk-link]");
  try {
    const res = await fetch(SITE_API);
    if (!res.ok) throw new Error(String(res.status));
    const release = await res.json();
    const asset = (release.assets || []).find((a) =>
      /^classtrack-.*\.apk$/.test(a.name),
    );
    links.forEach((a) => {
      a.href = asset?.browser_download_url || APK_FALLBACK;
    });
  } catch {
    links.forEach((a) => {
      a.href = APK_FALLBACK;
    });
  }
}

/* ---------------- Download count badge ---------------- */

let dlTotal = 0;

function updateDownloadBadge() {
  const el = document.getElementById("dlCount");
  if (!dlTotal) {
    el.hidden = true;
    return;
  }
  const formatted = dlTotal.toLocaleString(lang === "ar" ? "ar-EG" : "en-US");
  el.textContent = `${formatted} ${t("download.count")}`;
  el.hidden = false;
}

async function fetchDownloadCount() {
  try {
    const res = await fetch(
      "https://api.github.com/repos/alhosainy/classtrack-site/releases?per_page=100",
    );
    if (!res.ok) throw new Error(String(res.status));
    const releases = await res.json();
    dlTotal = (releases || []).reduce(
      (sum, r) =>
        sum +
        (r.assets || []).reduce(
          (s, a) =>
            s + (/^classtrack-.*\.apk$/.test(a.name) ? a.download_count : 0),
          0,
        ),
      0,
    );
    updateDownloadBadge();
  } catch {
    document.getElementById("dlCount").hidden = true;
  }
}

/* ---------------- Wire up ---------------- */

document.addEventListener("DOMContentLoaded", () => {
  applyTheme();
  applyLanguage();
  setApkLinks();
  fetchDownloadCount();

  document.getElementById("langToggle").addEventListener("click", () => {
    lang = lang === "ar" ? "en" : "ar";
    localStorage.setItem("ct-lang", lang);
    applyLanguage();
  });

  document.getElementById("themeToggle").addEventListener("click", () => {
    savedTheme = savedTheme === "light" ? "dark" : "light";
    localStorage.setItem("ct-theme", savedTheme);
    applyTheme();
  });
});
