// ─── SEED LOCALSTORAGE (so bikes.html has data) ───────────────────────────────
const defaultBikes = [
  { id: 1, name: "Activa", price: 299, category: "scooter", location: "Banjara Hills", rating: 4.9, reviews: 128, badge: "Popular", status: "available", img: "assets/bike1.jpg" },
  { id: 2, name: "Jupiter", price: 279, category: "scooter", location: "Gachibowli", rating: 4.8, reviews: 94, badge: "Available", status: "available", img: "assets/bike2.jpg" },
  { id: 3, name: "Honda", price: 349, category: "commuter", location: "Madhapur", rating: 4.7, reviews: 210, badge: "Available", status: "available", img: "assets/bike3.webp" },
  { id: 4, name: "Suzuki", price: 399, category: "scooter", location: "Jubilee Hills", rating: 4.6, reviews: 76, badge: "Available", status: "available", img: "assets/bike4.webp" },
  { id: 5, name: "Activa", price: 329, category: "scooter", location: "Secunderabad", rating: 4.9, reviews: 58, badge: "Premium", status: "available", img: "assets/bike5.webp" },
  { id: 6, name: "Honda", price: 449, category: "commuter", location: "Kukatpally", rating: 4.5, reviews: 112, badge: "Available", status: "available", img: "assets/bike6.webp" },
  { id: 7, name: "Platinum", price: 249, category: "commuter", location: "Ameerpet", rating: 4.7, reviews: 89, badge: "Available", status: "available", img: "assets/bike7.webp" },
  { id: 8, name: "Avenger", price: 599, category: "cruiser", location: "Banjara Hills", rating: 4.8, reviews: 41, badge: "Hot", status: "available", img: "assets/bike8.webp" },
  { id: 9, name: "TVS", price: 549, category: "sport", location: "Gachibowli", rating: 4.7, reviews: 63, badge: "Available", status: "available", img: "assets/bike9.webp" },
];

// Always reset to latest data
localStorage.setItem("wb_bikes", JSON.stringify(defaultBikes));
localStorage.setItem("wb_version", "v5");

// ─── TOAST ────────────────────────────────────────────────────────────────────
function showToast(msg, type = "info") {
  const container = document.getElementById("toastContainer");
  if (!container) return;
  const t = document.createElement("div");
  t.className = `toast ${type}`;
  t.textContent = msg;
  container.appendChild(t);
  setTimeout(() => {
    t.style.opacity = "0";
    t.style.transition = "all 0.3s";
    setTimeout(() => t.remove(), 300);
  }, 3000);
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
window.addEventListener("scroll", () => {
  document.getElementById("navbar").classList.toggle("scrolled", window.scrollY > 50);
});

document.getElementById("hamburger").addEventListener("click", () => {
  document.getElementById("mobileMenu").classList.toggle("open");
});

document.querySelectorAll(".mobile-menu a").forEach(a => {
  a.addEventListener("click", () => document.getElementById("mobileMenu").classList.remove("open"));
});

// ─── SCROLL REVEAL ────────────────────────────────────────────────────────────
function observeReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add("visible"), i * 80);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll(".reveal:not(.visible)").forEach(el => observer.observe(el));
}

// ─── LOADER ───────────────────────────────────────────────────────────────────
window.addEventListener("load", () => {
  const pct = document.getElementById("loaderPercent");
  let n = 0;
  const tick = setInterval(() => {
    n = Math.min(n + Math.floor(Math.random() * 18) + 6, 99);
    if (pct) pct.textContent = n + "%";
    if (n >= 99) clearInterval(tick);
  }, 120);

  setTimeout(() => {
    if (pct) pct.textContent = "100%";
    clearInterval(tick);
    setTimeout(() => {
      document.getElementById("loader").classList.add("hidden");
      observeReveal();
    }, 300);
  }, 1600);
});

// ─── COUNT-UP ANIMATION ───────────────────────────────────────────────────────
function countUp(el) {
  const target = parseInt(el.getAttribute("data-target"));
  const prefix = el.getAttribute("data-prefix") || "";
  const suffix = el.getAttribute("data-suffix") || "+";
  let current = 0;
  const increment = Math.ceil(target / 60);
  const timer = setInterval(function() {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = prefix + current + suffix;
  }, 25);
}

function initCountUp() {
  const stats = document.querySelectorAll(".stat-num[data-target]");
  if (!stats.length) return;
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        countUp(e.target);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  stats.forEach(function(el) { observer.observe(el); });
}

// Call after loader hides
window.addEventListener("load", function() {
  setTimeout(initCountUp, 1800);
});
