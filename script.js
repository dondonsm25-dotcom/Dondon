// Edit these two values to change your email and typing titles
const CONFIG = {
  email: "dondonsm25@gmail.com",
  titles: ["ASPIRING WEB DEVELOPER AND BSIT STUDENT", "JUNIOR AI DEVELOPER"]
};

document.documentElement.classList.add("js");
const $ = id => document.getElementById(id);
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

// Mobile menu
const btn = $("menuBtn"), menu = $("menu");
function setMenu(open) {
  menu.classList.toggle("open", open);
  btn.setAttribute("aria-expanded", open);
  btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}
btn.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
menu.addEventListener("click", e => { if (e.target.tagName === "A") setMenu(false); });

// Typing effect
if (!reduce) {
  const out = $("typing");
  let p = 0, i = 0, del = false;
  (function tick() {
    const t = CONFIG.titles[p];
    out.textContent = t.slice(0, i);
    if (!del && i === t.length) { del = true; return setTimeout(tick, 1800); }
    if (del && i === 0) { del = false; p = (p + 1) % CONFIG.titles.length; }
    i += del ? -1 : 1;
    setTimeout(tick, del ? 35 : 75);
  })();
}

// Scroll fade-ins
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("show"); io.unobserve(e.target); }
  });
}, { threshold: 0.1 });
document.querySelectorAll(".reveal").forEach(el => reduce ? el.classList.add("show") : io.observe(el));

// Footer year
$("year").textContent = new Date().getFullYear();

// Contact form opens the email app
$("contactForm").addEventListener("submit", e => {
  e.preventDefault();
  const name = $("fname").value.trim(), mail = $("femail").value.trim(), msg = $("fmsg").value.trim();
  const body = msg + "\n\nFrom: " + name + " (" + mail + ")";
  location.href = "mailto:" + CONFIG.email +
    "?subject=" + encodeURIComponent("Portfolio message from " + name) +
    "&body=" + encodeURIComponent(body);
});

// Animated background (light particles)
(function () {
  const c = $("bg"), x = c.getContext("2d");
  let w = 0, h = 0, dots = [], raf, lastW = 0;
  function size() {
    w = c.width = innerWidth; h = c.height = innerHeight;
    const n = Math.min(70, Math.floor(w * h / 22000));
    dots = Array.from({ length: n }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4
    }));
  }
  function frame() {
    x.clearRect(0, 0, w, h);
    for (const d of dots) {
      if (!reduce) {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0 || d.x > w) d.vx *= -1;
        if (d.y < 0 || d.y > h) d.vy *= -1;
      }
      x.fillStyle = "rgba(34,211,238,.7)";
      x.beginPath(); x.arc(d.x, d.y, 1.6, 0, 6.283); x.fill();
    }
    for (let i = 0; i < dots.length; i++) for (let j = i + 1; j < dots.length; j++) {
      const dx = dots[i].x - dots[j].x, dy = dots[i].y - dots[j].y, d2 = dx * dx + dy * dy;
      if (d2 < 12000) {
        x.strokeStyle = "rgba(139,92,246," + (.35 * (1 - d2 / 12000)) + ")";
        x.beginPath(); x.moveTo(dots[i].x, dots[i].y); x.lineTo(dots[j].x, dots[j].y); x.stroke();
      }
    }
  }
  function loop() { frame(); raf = requestAnimationFrame(loop); }
  function start() { cancelAnimationFrame(raf); reduce ? frame() : loop(); }
  lastW = innerWidth; size(); start();
  addEventListener("resize", () => { if (innerWidth !== lastW) { lastW = innerWidth; size(); start(); } });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(raf); else if (!reduce) start();
  });
})();
