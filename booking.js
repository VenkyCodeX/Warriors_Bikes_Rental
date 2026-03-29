// ─── DATA ─────────────────────────────────────────────────────────────────────
const defaultBikes = [
  { id: 1, name: "Royal Enfield Classic 350", price: 799, category: "cruiser", location: "Banjara Hills", rating: 4.9, reviews: 128, badge: "Popular", status: "available", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80" },
  { id: 2, name: "KTM Duke 390", price: 999, category: "sport", location: "Gachibowli", rating: 4.8, reviews: 94, badge: "Hot", status: "available", img: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800&q=80" },
  { id: 3, name: "Honda Activa 6G", price: 299, category: "scooter", location: "Madhapur", rating: 4.7, reviews: 210, badge: "Available", status: "available", img: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&q=80" },
  { id: 4, name: "Bajaj Pulsar NS200", price: 649, category: "sport", location: "Jubilee Hills", rating: 4.6, reviews: 76, badge: "Available", status: "available", img: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&q=80" },
  { id: 5, name: "Royal Enfield Himalayan", price: 1099, category: "adventure", location: "Secunderabad", rating: 4.9, reviews: 58, badge: "Premium", status: "available", img: "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=800&q=80" },
  { id: 6, name: "TVS Apache RTR 200", price: 549, category: "sport", location: "Kukatpally", rating: 4.5, reviews: 112, badge: "Available", status: "available", img: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80" },
  { id: 7, name: "Yamaha MT-15", price: 749, category: "sport", location: "Ameerpet", rating: 4.7, reviews: 89, badge: "Available", status: "available", img: "https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?w=800&q=80" },
  { id: 8, name: "Honda CB500X", price: 1299, category: "adventure", location: "Banjara Hills", rating: 4.8, reviews: 41, badge: "Premium", status: "available", img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80" },
];

function getBikes() {
  return JSON.parse(localStorage.getItem("wb_bikes") || "null") || defaultBikes;
}

// ─── STATE ────────────────────────────────────────────────────────────────────
let bk = { bike: null, days: 0, pickDate: "", dropDate: "", total: 0, base: 0, helmetCost: 0, kmCost: 0 };

// ─── INIT: READ URL PARAM ─────────────────────────────────────────────────────
window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"));
  const bike = getBikes().find(b => b.id === id);

  if (!bike) {
    showToast("Bike not found. Redirecting...", "error");
    setTimeout(() => window.location.href = "index.html#bikes", 2000);
    return;
  }

  bk.bike = bike;
  populateBike(bike);

  // Set today as min date
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("pickDate").min = today;
  document.getElementById("dropDate").min = today;

  // Navbar scroll
  window.addEventListener("scroll", () => {
    document.getElementById("navbar").classList.toggle("scrolled", window.scrollY > 10);
  });
  document.getElementById("navbar").classList.add("scrolled");

  // Hamburger
  document.getElementById("hamburger").addEventListener("click", () => {
    document.getElementById("mobileMenu").classList.toggle("open");
  });
});

function populateBike(bike) {
  document.title = `Book ${bike.name} – Warrior Bikes`;
  document.getElementById("bkBikeImg").src = bike.img;
  document.getElementById("bkBikeName").textContent = bike.name;
  document.getElementById("bkBikeLoc").textContent = bike.location;
  document.getElementById("bkBikePrice").textContent = bike.price;
  document.getElementById("bkBikeRating").textContent = bike.rating || "4.5";
  document.getElementById("bkBikeReviews").textContent = `(${bike.reviews || "New"} reviews)`;
  document.getElementById("bkBikeBadge").textContent = bike.badge || "Available";
}

// ─── DATE CALCULATION ─────────────────────────────────────────────────────────
function calcDays() {
  const p = document.getElementById("pickDate").value;
  const d = document.getElementById("dropDate").value;
  clearErr("pickDateErr"); clearErr("dropDateErr");
  document.getElementById("pickDate").classList.remove("error");
  document.getElementById("dropDate").classList.remove("error");

  if (!p || !d) {
    document.getElementById("bkDurationPill").style.display = "none";
    document.getElementById("bkBreakdown").style.display = "none";
    return;
  }

  const pick = new Date(p), drop = new Date(d);
  if (drop <= pick) {
    setErr("dropDateErr", "Drop-off must be after pick-up date");
    document.getElementById("dropDate").classList.add("error");
    document.getElementById("bkDurationPill").style.display = "none";
    document.getElementById("bkBreakdown").style.display = "none";
    return;
  }

  const days = Math.ceil((drop - pick) / 86400000);
  const helmet = document.getElementById("helmetCheck").checked ? 50 * days : 0;
  const km = parseInt(document.getElementById("kmPackage").value) || 0;
  const base = bk.bike.price * days;
  const total = base + helmet + km;

  bk.days = days; bk.pickDate = p; bk.dropDate = d;
  bk.base = base; bk.helmetCost = helmet; bk.kmCost = km; bk.total = total;

  // Duration pill
  const pill = document.getElementById("bkDurationPill");
  pill.style.display = "flex";
  document.getElementById("bkDurText").textContent = `${days} day${days > 1 ? "s" : ""} · ${formatDate(p)} → ${formatDate(d)}`;
  document.getElementById("bkDurTotal").textContent = `₹${total}`;

  // Breakdown card
  document.getElementById("bkBreakdown").style.display = "block";
  document.getElementById("bdBase").textContent = `₹${base}`;

  const helmetRow = document.getElementById("bdHelmetRow");
  if (helmet > 0) {
    helmetRow.style.display = "flex";
    document.getElementById("bdHelmetDays").textContent = days;
    document.getElementById("bdHelmet").textContent = `₹${helmet}`;
  } else {
    helmetRow.style.display = "none";
  }

  const kmRow = document.getElementById("bdKmRow");
  if (km > 0) {
    kmRow.style.display = "flex";
    document.getElementById("bdKm").textContent = `₹${km}`;
  } else {
    kmRow.style.display = "none";
  }

  document.getElementById("bdTotal").textContent = `₹${total}`;
}

// ─── STEP NAVIGATION ──────────────────────────────────────────────────────────
function setStep(n) {
  document.getElementById("pageStep1").style.display = n === 1 ? "block" : "none";
  document.getElementById("pageStep2").style.display = n === 2 ? "block" : "none";
  document.getElementById("pageStep3").style.display = n === 3 ? "flex" : "none";

  [1, 2, 3].forEach(i => {
    const el = document.getElementById(`bkStep${i}`);
    const line = document.getElementById(`bkLine${i}`);
    el.className = "bk-step" + (i === n ? " active" : i < n ? " done" : "");
    if (line) line.className = "bk-step-line" + (i < n ? " done" : "");
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ─── PROCEED TO PAYMENT ───────────────────────────────────────────────────────
function proceedToPayment() {
  let valid = true;

  if (!document.getElementById("pickDate").value) {
    setErr("pickDateErr", "Please select a pick-up date");
    document.getElementById("pickDate").classList.add("error");
    valid = false;
  }
  if (!document.getElementById("dropDate").value) {
    setErr("dropDateErr", "Please select a drop-off date");
    document.getElementById("dropDate").classList.add("error");
    valid = false;
  }
  if (bk.days <= 0 && valid) {
    setErr("dropDateErr", "Drop-off must be after pick-up date");
    valid = false;
  }

  const name = document.getElementById("riderName").value.trim();
  if (!name) {
    setErr("riderNameErr", "Full name is required");
    document.getElementById("riderName").classList.add("error");
    valid = false;
  }

  const phone = document.getElementById("riderPhone").value.trim();
  if (!phone || phone.replace(/\D/g, "").length < 10) {
    setErr("riderPhoneErr", "Enter a valid 10-digit phone number");
    document.getElementById("riderPhone").classList.add("error");
    valid = false;
  }

  if (!valid) { showToast("Please fix the errors above", "error"); return; }

  // Populate payment page
  document.getElementById("payBikeImg").src = bk.bike.img;
  document.getElementById("payBikeName").textContent = bk.bike.name;
  document.getElementById("payBikeLoc").textContent = "📍 " + bk.bike.location;
  document.getElementById("payDates").textContent = `${formatDate(bk.pickDate)} → ${formatDate(bk.dropDate)}`;
  document.getElementById("payDuration").textContent = `${bk.days} day${bk.days > 1 ? "s" : ""}`;
  document.getElementById("payCustomer").textContent = name;
  document.getElementById("payPhone").textContent = phone;
  document.getElementById("payTotal").textContent = `₹${bk.total}`;
  document.getElementById("payTotalBar").textContent = `₹${bk.total}`;
  document.getElementById("bkQrAmount").textContent = `₹${bk.total}`;

  generateQR();
  setStep(2);
}

function goBackToBooking() { setStep(1); }

// ─── PROCESS PAYMENT ──────────────────────────────────────────────────────────
function processPayment() {
  const upi = document.getElementById("upiId").value.trim();
  if (!upi || !upi.includes("@")) {
    setErr("upiErr", "Enter a valid UPI ID (e.g. name@upi)");
    document.getElementById("upiId").classList.add("error");
    return;
  }
  clearErr("upiErr");

  const btn = document.querySelector("#pageStep2 .bk-btn-primary");
  btn.textContent = "Processing...";
  btn.disabled = true;

  showToast("Processing payment...", "info");

  setTimeout(() => {
    const ref = "WB" + Date.now().toString().slice(-6).toUpperCase();
    saveBookingRecord(ref);
    populateSuccessPage(ref);
    setStep(3);
    showToast("🎉 Payment Successful! Booking Confirmed", "success");
    btn.textContent = "⚡ Pay Now";
    btn.disabled = false;
  }, 1600);
}

function populateSuccessPage(ref) {
  document.getElementById("bkBookingId").textContent = `Booking ID: #${ref}`;
  document.getElementById("bkSuccessDetails").innerHTML = `
    <strong>Bike:</strong> ${bk.bike.name}<br>
    <strong>Pick-up:</strong> ${formatDate(bk.pickDate)}<br>
    <strong>Drop-off:</strong> ${formatDate(bk.dropDate)}<br>
    <strong>Duration:</strong> ${bk.days} day${bk.days > 1 ? "s" : ""}<br>
    <strong>Customer:</strong> ${document.getElementById("riderName").value.trim()}<br>
    <strong>Phone:</strong> ${document.getElementById("riderPhone").value.trim()}<br>
    <strong>Amount Paid:</strong> ₹${bk.total}
  `;
}

function saveBookingRecord(ref) {
  const bookings = JSON.parse(localStorage.getItem("wb_bookings") || "[]");
  bookings.unshift({
    id: ref,
    customer: document.getElementById("riderName").value.trim(),
    phone: document.getElementById("riderPhone").value.trim(),
    bike: bk.bike.name,
    from: bk.pickDate,
    to: bk.dropDate,
    amount: bk.total,
    status: "confirmed",
    date: new Date().toLocaleDateString("en-IN")
  });
  localStorage.setItem("wb_bookings", JSON.stringify(bookings));
}

// ─── WHATSAPP ─────────────────────────────────────────────────────────────────
function sendWhatsAppBooking() {
  const name = document.getElementById("riderName").value.trim() || "Customer";
  const phone = document.getElementById("riderPhone").value.trim();
  const pick = bk.pickDate ? formatDate(bk.pickDate) : "TBD";
  const drop = bk.dropDate ? formatDate(bk.dropDate) : "TBD";
  const msg = encodeURIComponent(
    `Hi, I want to rent ${bk.bike.name} from ${pick} to ${drop}.\n` +
    `Name: ${name}\nPhone: ${phone}\nTotal: ₹${bk.total || bk.bike.price}`
  );
  window.open(`https://wa.me/919876543210?text=${msg}`, "_blank");
}

function shareOnWhatsApp() {
  const name = document.getElementById("riderName").value.trim();
  const msg = encodeURIComponent(
    `✅ Booking Confirmed!\nBike: ${bk.bike.name}\nDates: ${formatDate(bk.pickDate)} → ${formatDate(bk.dropDate)}\nAmount: ₹${bk.total}\nThank you, Warrior Bikes! 🏍️`
  );
  window.open(`https://wa.me/919876543210?text=${msg}`, "_blank");
}

// ─── PAYMENT METHOD PILLS ─────────────────────────────────────────────────────
function selectPayMethod(el) {
  document.querySelectorAll(".bk-pay-method").forEach(m => m.classList.remove("active"));
  el.classList.add("active");
}

// ─── QR GENERATOR ────────────────────────────────────────────────────────────
function generateQR() {
  const grid = document.getElementById("bkQrGrid");
  const seed = bk.bike.name.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  let html = "";
  for (let i = 0; i < 100; i++) {
    const r = Math.floor(i / 10), c = i % 10;
    const corner = (r < 3 && c < 3) || (r < 3 && c > 6) || (r > 6 && c < 3);
    const dark = corner || ((seed * (i + 7) * 31) % 97) > 45;
    html += `<div class="bk-qr-cell" style="background:${dark ? "#000" : "#fff"}"></div>`;
  }
  grid.innerHTML = html;
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
function showToast(msg, type = "info") {
  const container = document.getElementById("toastContainer");
  const t = document.createElement("div");
  t.className = `toast ${type}`;
  t.textContent = msg;
  container.appendChild(t);
  setTimeout(() => {
    t.style.opacity = "0";
    t.style.transform = "translateY(10px)";
    t.style.transition = "all 0.3s";
    setTimeout(() => t.remove(), 300);
  }, 3000);
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function setErr(id, msg) { const el = document.getElementById(id); if (el) el.textContent = msg; }
function clearErr(id) { const el = document.getElementById(id); if (el) el.textContent = ""; }
function formatDate(str) {
  if (!str) return "";
  return new Date(str).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
