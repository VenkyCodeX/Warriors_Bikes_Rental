// ─── BIKE REVIEWS DATA ────────────────────────────────────────────────────────
const bikeReviewsData = {
  1: [{ name: "Ravi T.", avatar: "RT", color: "#ff6b00", text: "Activa was super smooth and fuel-efficient. Perfect for city rides!", stars: 5 }],
  2: [{ name: "Meena S.", avatar: "MS", color: "#8b5cf6", text: "Jupiter is very comfortable. Loved the ride quality. Will rent again!", stars: 5 }],
  3: [{ name: "Kiran P.", avatar: "KP", color: "#22c55e", text: "Honda was well-maintained and easy to handle. Great experience!", stars: 4 }],
  4: [{ name: "Suresh R.", avatar: "SR", color: "#3b82f6", text: "Suzuki gave a very smooth ride. Excellent condition. Highly recommend!", stars: 5 }],
  5: [{ name: "Divya N.", avatar: "DN", color: "#ef4444", text: "Activa 125 is perfect for daily commute. Very comfortable and reliable.", stars: 5 }],
  6: [{ name: "Arun K.", avatar: "AK", color: "#f59e0b", text: "Honda was in top condition. Powerful and smooth. Great value!", stars: 4 }],
  7: [{ name: "Priya M.", avatar: "PM", color: "#10b981", text: "Platinum is budget-friendly and very easy to ride. Loved it!", stars: 5 }],
  8: [{ name: "Vikram B.", avatar: "VB", color: "#6366f1", text: "Avenger is a beast! Cruising on Hyderabad roads was an amazing experience.", stars: 5 }],
  9: [{ name: "Sai C.", avatar: "SC", color: "#ec4899", text: "TVS Apache is super sporty and fast. Best bike for weekend rides!", stars: 5 }],
};

function getReviews(bikeId) {
  const stored = localStorage.getItem("wb_reviews_" + bikeId);
  return stored ? JSON.parse(stored) : (bikeReviewsData[bikeId] || []);
}

function saveReview(bikeId, review) {
  const reviews = getReviews(bikeId);
  reviews.push(review);
  localStorage.setItem("wb_reviews_" + bikeId, JSON.stringify(reviews));
}

// ─── BIKE DATA ────────────────────────────────────────────────────────────────
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

function getBikes() {
  return JSON.parse(localStorage.getItem("wb_bikes")) || defaultBikes;
}

// Only seed if no bikes exist yet — never overwrite admin changes
if (!localStorage.getItem("wb_bikes")) {
  localStorage.setItem("wb_bikes", JSON.stringify(defaultBikes));
}

// ─── STATE ────────────────────────────────────────────────────────────────────
let currentFilter = "all";
let currentSort = "default";
let currentSearch = "";
let selectedBike = null;
let selectedStars = 0;

// ─── RENDER BIKES ─────────────────────────────────────────────────────────────
function renderBikes() {
  const grid = document.getElementById("bikesGrid");
  const noMsg = document.getElementById("noBikes");
  let bikes = getBikes();

  if (currentFilter !== "all") bikes = bikes.filter(b => b.category === currentFilter);
  if (currentSearch) bikes = bikes.filter(b => b.name.toLowerCase().includes(currentSearch.toLowerCase()) || b.location.toLowerCase().includes(currentSearch.toLowerCase()));
  if (currentSort === "price-asc") bikes.sort((a, b) => a.price - b.price);
  else if (currentSort === "price-desc") bikes.sort((a, b) => b.price - a.price);
  else if (currentSort === "rating") bikes.sort((a, b) => b.rating - a.rating);

  if (!bikes.length) { grid.innerHTML = ""; noMsg.style.display = "flex"; return; }
  noMsg.style.display = "none";

  grid.innerHTML = bikes.map(bike => `
    <div class="bike-card reveal" data-id="${bike.id}">
      <div class="bike-img">
        <img src="${bike.img}" alt="${bike.name}" loading="lazy" onerror="this.src='assets/bike1.jpg'" />
        <span class="bike-badge ${bike.status === 'available' ? 'available' : ''}">${bike.badge || 'Available'}</span>
      </div>
      <div class="bike-info">
        <div class="bike-name">${bike.name}</div>
        <div class="bike-meta">📍 ${bike.location}</div>
        <div class="bike-price-row">
          <div class="bike-price">₹${bike.price}<span>/day</span></div>
          <div class="bike-rating">★ ${bike.rating} <span style="color:var(--text-muted)">(${bike.reviews})</span></div>
        </div>
        <div class="bike-actions">
          <button class="btn-book" onclick="openBooking(${bike.id})">🏍️ Book Now</button>
          <button class="btn-pay" onclick="openBooking(${bike.id})">💳 Pay Now</button>
        </div>
      </div>
    </div>
  `).join("");
  observeReveal();
}

// ─── FILTER & SORT ────────────────────────────────────────────────────────────
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter || "all";
    renderBikes();
  });
});

function sortBikes(val) { currentSort = val; renderBikes(); }
function searchBikes(val) { currentSearch = val; renderBikes(); }
function resetFilters() {
  currentFilter = "all"; currentSearch = ""; currentSort = "default";
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  document.querySelector("[data-filter='all']").classList.add("active");
  document.getElementById("bikeSearch").value = "";
  document.getElementById("sortSelect").value = "default";
  renderBikes();
}

// ─── MODAL TABS ───────────────────────────────────────────────────────────────
function switchModalTab(btn, tabId) {
  document.querySelectorAll(".modal-tab").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".modal-tab-content").forEach(c => c.style.display = "none");
  btn.classList.add("active");
  document.getElementById(tabId).style.display = "block";
  if (tabId === "reviewsTab") renderModalReviews();
}

// ─── RENDER REVIEWS IN MODAL ──────────────────────────────────────────────────
function renderModalReviews() {
  if (!selectedBike) return;
  const reviews = getReviews(selectedBike.id);
  const container = document.getElementById("reviewsList");
  const colors = ["#ff6b00","#8b5cf6","#22c55e","#3b82f6","#ef4444","#f59e0b","#10b981","#6366f1","#ec4899"];
  if (!reviews.length) {
    container.innerHTML = `<div class="no-reviews">No reviews yet. Be the first to review!</div>`;
    return;
  }
  container.innerHTML = reviews.map((r, i) => {
    const stars = "★".repeat(r.stars) + "☆".repeat(5 - r.stars);
    const initials = r.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0,2);
    const color = r.color || colors[i % colors.length];
    return `
      <div class="modal-review-item">
        <div class="modal-review-top">
          <div class="modal-review-avatar" style="background:${color}">${initials}</div>
          <div>
            <div class="modal-review-name">${r.name}</div>
            <div class="modal-review-stars">${stars}</div>
          </div>
        </div>
        <p class="modal-review-text">"${r.text}"</p>
      </div>`;
  }).join("");
}

// ─── STAR RATING PICKER ───────────────────────────────────────────────────────
function setStars(n) {
  selectedStars = n;
  document.querySelectorAll(".star-pick").forEach((s, i) => {
    s.classList.toggle("active", i < n);
  });
}

// ─── SUBMIT REVIEW ────────────────────────────────────────────────────────────
function submitReview() {
  const name = document.getElementById("reviewName").value.trim();
  const text = document.getElementById("reviewText").value.trim();
  if (!name) { showToast("Please enter your name", "error"); return; }
  if (!selectedStars) { showToast("Please select a star rating", "error"); return; }
  if (!text) { showToast("Please write your review", "error"); return; }

  saveReview(selectedBike.id, { name, text, stars: selectedStars });
  document.getElementById("reviewName").value = "";
  document.getElementById("reviewText").value = "";
  setStars(0);
  renderModalReviews();
  showToast("Review submitted! Thank you 🎉", "success");
}

// ─── BOOKING MODAL ────────────────────────────────────────────────────────────
function openBooking(bikeId) {
  selectedBike = getBikes().find(b => b.id === bikeId);
  if (!selectedBike) return;

  const today = new Date().toISOString().split("T")[0];
  document.getElementById("bookStart").min = today;
  document.getElementById("bookEnd").min = today;
  document.getElementById("bookStart").value = "";
  document.getElementById("bookEnd").value = "";
  document.getElementById("bookName").value = "";
  document.getElementById("bookPhone").value = "";
  document.getElementById("bookingSummary").style.display = "none";
  selectedStars = 0;
  document.querySelectorAll(".star-pick").forEach(s => s.classList.remove("active"));

  document.getElementById("modalBikeHeader").innerHTML = `
    <img src="${selectedBike.img}" alt="${selectedBike.name}" onerror="this.src='assets/bike1.jpg'" />
    <div class="modal-bike-info">
      <div class="modal-bike-name">${selectedBike.name}</div>
      <div class="modal-bike-meta">📍 ${selectedBike.location} &nbsp;|&nbsp; ★ ${selectedBike.rating}</div>
      <div class="modal-bike-price">₹${selectedBike.price}<span>/day</span></div>
    </div>
  `;

  document.getElementById("waBookBtn").href =
    `https://wa.me/919703333120?text=Hi%2C%20I%20want%20to%20rent%20${encodeURIComponent(selectedBike.name)}`;

  // Reset to booking tab
  document.querySelectorAll(".modal-tab").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".modal-tab-content").forEach(c => c.style.display = "none");
  document.querySelector(".modal-tab[data-tab='bookingTab']").classList.add("active");
  document.getElementById("bookingTab").style.display = "block";

  showStep(1);
  document.getElementById("bookingModal").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeBookingModal() {
  document.getElementById("bookingModal").classList.remove("open");
  document.body.style.overflow = "";
}

document.getElementById("bookingModal").addEventListener("click", function(e) {
  if (e.target === this) closeBookingModal();
});

// ─── CALCULATE TOTAL ──────────────────────────────────────────────────────────
function calcTotal() {
  const start = document.getElementById("bookStart").value;
  const end = document.getElementById("bookEnd").value;
  if (!start || !end || !selectedBike) return;
  const days = Math.ceil((new Date(end) - new Date(start)) / 86400000);
  if (days <= 0) { showToast("End date must be after start date", "error"); return; }
  const total = days * selectedBike.price;
  document.getElementById("sumBike").textContent = selectedBike.name;
  document.getElementById("sumDays").textContent = `${days} day${days > 1 ? "s" : ""}`;
  document.getElementById("sumRate").textContent = `₹${selectedBike.price}/day`;
  document.getElementById("sumTotal").textContent = `₹${total.toLocaleString("en-IN")}`;
  document.getElementById("bookingSummary").style.display = "block";
  document.getElementById("payAmount").textContent = `₹${total.toLocaleString("en-IN")}`;
}

// ─── STEP NAVIGATION ──────────────────────────────────────────────────────────
function showStep(n) {
  document.querySelectorAll(".modal-step").forEach(s => s.style.display = "none");
  document.getElementById(`step${n}`).style.display = "block";
}

function goToPayment() {
  const name = document.getElementById("bookName").value.trim();
  const phone = document.getElementById("bookPhone").value.trim();
  const start = document.getElementById("bookStart").value;
  const end = document.getElementById("bookEnd").value;
  if (!name) { showToast("Please enter your name", "error"); return; }
  if (!phone) { showToast("Please enter your phone number", "error"); return; }
  if (!start || !end) { showToast("Please select rental dates", "error"); return; }
  if (new Date(end) <= new Date(start)) { showToast("End date must be after start date", "error"); return; }
  showStep(2);
}

function backToStep1() { showStep(1); }

// ─── PAYMENT TABS ─────────────────────────────────────────────────────────────
function switchTab(btn, tab) {
  document.querySelectorAll(".pay-tab").forEach(t => t.classList.remove("active"));
  btn.classList.add("active");
  document.querySelectorAll(".pay-content").forEach(c => c.style.display = "none");
  document.getElementById(tab + "Content").style.display = "block";
}

function fmtCard(input) {
  let v = input.value.replace(/\D/g, "").substring(0, 16);
  input.value = v.replace(/(.{4})/g, "$1 ").trim();
}

// ─── PROCESS PAYMENT ──────────────────────────────────────────────────────────
function processPayment() {
  const activeTab = document.querySelector(".pay-tab.active").textContent;
  if (activeTab.includes("UPI")) {
    const upi = document.getElementById("upiId").value.trim();
    if (!upi || !upi.includes("@")) { showToast("Please enter a valid UPI ID", "error"); return; }
  }
  const btn = document.querySelector("#step2 .btn-primary");
  btn.textContent = "Processing...";
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = "🔒 Pay Now";
    btn.disabled = false;
    const id = "WB" + Date.now().toString().slice(-6);
    document.getElementById("bookingIdDisplay").textContent = id;

    // Save booking to localStorage so admin panel can see it
    const booking = {
      id,
      customer: document.getElementById("bookName").value.trim(),
      phone: document.getElementById("bookPhone").value.trim(),
      bike: selectedBike.name,
      from: document.getElementById("bookStart").value,
      to: document.getElementById("bookEnd").value,
      amount: parseInt(document.getElementById("payAmount").textContent.replace(/[^0-9]/g, "")),
      status: "confirmed",
      date: new Date().toLocaleDateString("en-IN")
    };
    const existing = JSON.parse(localStorage.getItem("wb_bookings") || "[]");
    existing.unshift(booking);
    localStorage.setItem("wb_bookings", JSON.stringify(existing));

    showStep(3);
  }, 2000);
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

// ─── TOAST ────────────────────────────────────────────────────────────────────
function showToast(msg, type = "info") {
  const container = document.getElementById("toastContainer");
  const t = document.createElement("div");
  t.className = `toast ${type}`;
  t.textContent = msg;
  container.appendChild(t);
  setTimeout(() => { t.style.opacity = "0"; setTimeout(() => t.remove(), 300); }, 3000);
}

// ─── INIT ─────────────────────────────────────────────────────────────────────
renderBikes();
window.addEventListener("storage", e => { if (e.key === "wb_bikes") renderBikes(); });
