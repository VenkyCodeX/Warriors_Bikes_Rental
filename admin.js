// ─── DEFAULT BIKES ────────────────────────────────────────────────────────────
const defaultBikes = [
  { id: 1, name: "Activa", category: "scooter", price: 299, location: "Banjara Hills", rating: 4.9, reviews: 128, badge: "Popular", status: "available", img: "assets/bike1.jpg" },
  { id: 2, name: "Jupiter", category: "scooter", price: 279, location: "Gachibowli", rating: 4.8, reviews: 94, badge: "Available", status: "available", img: "assets/bike2.jpg" },
  { id: 3, name: "Honda", category: "commuter", price: 349, location: "Madhapur", rating: 4.7, reviews: 210, badge: "Available", status: "available", img: "assets/bike3.webp" },
  { id: 4, name: "Suzuki", category: "scooter", price: 399, location: "Jubilee Hills", rating: 4.6, reviews: 76, badge: "Available", status: "available", img: "assets/bike4.webp" },
  { id: 5, name: "Activa", category: "scooter", price: 329, location: "Secunderabad", rating: 4.9, reviews: 58, badge: "Premium", status: "available", img: "assets/bike5.webp" },
  { id: 6, name: "Honda", category: "commuter", price: 449, location: "Kukatpally", rating: 4.5, reviews: 112, badge: "Available", status: "available", img: "assets/bike6.webp" },
  { id: 7, name: "Platinum", category: "commuter", price: 249, location: "Ameerpet", rating: 4.7, reviews: 89, badge: "Available", status: "available", img: "assets/bike7.webp" },
  { id: 8, name: "Avenger", category: "cruiser", price: 599, location: "Banjara Hills", rating: 4.8, reviews: 41, badge: "Hot", status: "available", img: "assets/bike8.webp" },
  { id: 9, name: "TVS", category: "sport", price: 549, location: "Gachibowli", rating: 4.7, reviews: 63, badge: "Available", status: "available", img: "assets/bike9.webp" },
];

if (!localStorage.getItem("wb_bikes")) {
  localStorage.setItem("wb_bikes", JSON.stringify(defaultBikes));
}

let bikes = JSON.parse(localStorage.getItem("wb_bikes"));

function save() { localStorage.setItem("wb_bikes", JSON.stringify(bikes)); }

// ─── NAVIGATION ───────────────────────────────────────────────────────────────
const pageTitles = {
  dashboard: ["Dashboard", "Welcome back, Admin"],
  "add-bike": ["Add Bike", "Add a new bike to the fleet"],
  "manage-bikes": ["Manage Bikes", "Edit or remove bikes"],
  bookings: ["Bookings", "View all customer bookings"],
  payments: ["Payments", "Track revenue & transactions"]
};

function showPage(id, el) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
  document.getElementById("page-" + id).classList.add("active");
  if (el) el.classList.add("active");
  const [title, sub] = pageTitles[id] || [id, ""];
  document.getElementById("pageTitle").textContent = title;
  document.getElementById("pageSubtitle").textContent = sub;
  if (id === "manage-bikes") renderTable();
  if (id === "dashboard") renderDashboard();
  if (id === "bookings") renderBookings();
  if (id === "payments") renderPayments();
  document.getElementById("sidebar").classList.remove("open");
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function renderDashboard() {
  const bookings = JSON.parse(localStorage.getItem("wb_bookings") || "[]");
  const revenue = bookings.reduce(function(sum, b) { return sum + (b.amount || 0); }, 0);
  const confirmed = bookings.filter(function(b) { return b.status === "confirmed"; }).length;
  document.getElementById("totalBikes").textContent = bikes.length;
  document.getElementById("dashBookings").textContent = bookings.length;
  document.getElementById("dashRevenue").textContent = "\u20b9" + revenue.toLocaleString("en-IN");
  document.getElementById("dashConfirmed").textContent = confirmed;

  // Recent bookings table
  const recent = bookings.slice(0, 5);
  const statusBadge = { confirmed: "badge-green", pending: "badge-orange", cancelled: "badge-red" };
  const tbody = document.getElementById("dashRecentBody");
  if (!recent.length) {
    tbody.innerHTML = "<tr><td colspan='7' style='text-align:center;color:var(--text-muted);padding:20px;'>No bookings yet</td></tr>";
  } else {
    tbody.innerHTML = recent.map(function(b) {
      return "<tr>" +
        "<td style='color:var(--orange);font-weight:600;'>#" + b.id + "</td>" +
        "<td>" + b.customer + "</td>" +
        "<td>" + b.bike + "</td>" +
        "<td>" + fmtDate(b.from) + "</td>" +
        "<td>" + fmtDate(b.to) + "</td>" +
        "<td style='font-weight:700;'>&#8377;" + b.amount + "</td>" +
        "<td><span class='badge " + (statusBadge[b.status] || "badge-orange") + "'>" + b.status + "</span></td>" +
        "</tr>";
    }).join("");
  }
}

function renderPayments() {
  const bookings = JSON.parse(localStorage.getItem("wb_bookings") || "[]");
  const revenue = bookings.reduce(function(sum, b) { return sum + (b.amount || 0); }, 0);
  const confirmed = bookings.filter(function(b) { return b.status === "confirmed"; }).length;
  const pending = bookings.filter(function(b) { return b.status === "pending"; }).length;
  document.getElementById("payTotal").textContent = "\u20b9" + revenue.toLocaleString("en-IN");
  document.getElementById("payConfirmed").textContent = confirmed;
  document.getElementById("payPending").textContent = pending;
  const statusBadge = { confirmed: "badge-green", pending: "badge-orange", cancelled: "badge-red" };
  const tbody = document.getElementById("paymentsTableBody");
  if (!bookings.length) {
    tbody.innerHTML = "<tr><td colspan='7' style='text-align:center;color:var(--text-muted);padding:20px;'>No payments yet</td></tr>";
  } else {
    tbody.innerHTML = bookings.map(function(b) {
      return "<tr>" +
        "<td style='color:var(--orange);font-weight:600;'>#" + b.id + "</td>" +
        "<td>" + b.customer + "</td>" +
        "<td>" + b.phone + "</td>" +
        "<td>" + b.bike + "</td>" +
        "<td style='font-weight:700;'>&#8377;" + b.amount + "</td>" +
        "<td>" + fmtDate(b.from) + "</td>" +
        "<td><span class='badge " + (statusBadge[b.status] || "badge-orange") + "'>" + b.status + "</span></td>" +
        "</tr>";
    }).join("");
  }
}

// ─── RENDER TABLE ─────────────────────────────────────────────────────────────
function renderTable(list) {
  list = list || bikes;
  document.getElementById("bikeCount").textContent = list.length + " bikes in fleet";
  const statusBadge = { available: "badge-green", rented: "badge-orange", maintenance: "badge-red" };
  const rows = list.map(function(b) {
    return "<tr>" +
      "<td><img class='bike-thumb' src='" + (b.img || '') + "' alt='" + b.name + "' onerror=\"this.style.display='none'\" /></td>" +
      "<td style='font-weight:600;'>" + b.name + "</td>" +
      "<td style='text-transform:capitalize;'>" + b.category + "</td>" +
      "<td style='color:var(--orange);font-weight:700;'>&#8377;" + b.price + "</td>" +
      "<td>" + b.location + "</td>" +
      "<td><span class='badge " + (statusBadge[b.status] || 'badge-orange') + "' style='text-transform:capitalize;'>" + b.status + "</span></td>" +
      "<td><div style='display:flex;gap:8px;'>" +
      "<button class='btn btn-edit btn-sm' onclick='openEdit(" + b.id + ")'>&#9998; Edit</button>" +
      "<button class='btn btn-danger btn-sm' onclick='deleteBike(" + b.id + ")'>&#128465; Delete</button>" +
      "</div></td></tr>";
  });
  document.getElementById("bikesTableBody").innerHTML = rows.join("");
}

// ─── ADD BIKE ─────────────────────────────────────────────────────────────────
function addBike(e) {
  e.preventDefault();
  const name = document.getElementById("bikeName").value.trim();
  const price = parseInt(document.getElementById("bikePrice").value);
  const category = document.getElementById("bikeCategory").value;
  const location = document.getElementById("bikeLocation").value.trim();
  const status = document.getElementById("bikeStatus").value;
  const img = document.getElementById("bikeImg").value.trim() || "assets/bike1.jpg";
  const newBike = { id: Date.now(), name: name, category: category, price: price, location: location, status: status, img: img, rating: 4.5, reviews: 0, badge: "New" };
  bikes.unshift(newBike);
  save();
  toast("Bike added successfully!", "success");
  document.getElementById("addBikeForm").reset();
  document.getElementById("imgPreview").style.display = "none";
  document.getElementById("totalBikes").textContent = bikes.length;
}

// ─── DELETE ───────────────────────────────────────────────────────────────────
function deleteBike(id) {
  if (!confirm("Delete this bike from the fleet?")) return;
  bikes = bikes.filter(function(b) { return b.id !== id; });
  save();
  renderTable();
  toast("Bike removed.", "error");
}

// ─── EDIT ─────────────────────────────────────────────────────────────────────
function openEdit(id) {
  const b = bikes.find(function(b) { return b.id === id; });
  if (!b) return;
  document.getElementById("editId").value = id;
  document.getElementById("editName").value = b.name;
  document.getElementById("editCategory").value = b.category;
  document.getElementById("editPrice").value = b.price;
  document.getElementById("editLocation").value = b.location;
  document.getElementById("editStatus").value = b.status;
  document.getElementById("editModal").classList.add("open");
}

function saveEdit() {
  const id = parseInt(document.getElementById("editId").value);
  const idx = bikes.findIndex(function(b) { return b.id === id; });
  if (idx === -1) return;
  bikes[idx] = Object.assign({}, bikes[idx], {
    name: document.getElementById("editName").value,
    category: document.getElementById("editCategory").value,
    price: parseInt(document.getElementById("editPrice").value),
    location: document.getElementById("editLocation").value,
    status: document.getElementById("editStatus").value
  });
  save();
  renderTable();
  closeModal();
  toast("Bike updated!", "success");
}

function closeModal() { document.getElementById("editModal").classList.remove("open"); }
document.getElementById("editModal").addEventListener("click", function(e) {
  if (e.target === document.getElementById("editModal")) closeModal();
});

// ─── SEARCH ───────────────────────────────────────────────────────────────────
function searchBikes(q) {
  const filtered = bikes.filter(function(b) {
    return b.name.toLowerCase().includes(q.toLowerCase()) ||
      b.location.toLowerCase().includes(q.toLowerCase()) ||
      b.category.toLowerCase().includes(q.toLowerCase());
  });
  renderTable(filtered);
}

// ─── IMAGE PREVIEW ────────────────────────────────────────────────────────────
function previewImage(input) {
  if (!input.files[0]) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = document.getElementById("imgPreview");
    img.src = e.target.result;
    img.style.display = "block";
    document.getElementById("bikeImg").value = e.target.result;
  };
  reader.readAsDataURL(input.files[0]);
}

function previewUrl(input) {
  const url = input.value.trim();
  const img = document.getElementById("imgPreview");
  if (url) {
    img.src = url;
    img.style.display = "block";
    img.onerror = function() { img.style.display = "none"; };
  } else {
    img.style.display = "none";
  }
}

function resetForm() { document.getElementById("imgPreview").style.display = "none"; }

// ─── BOOKINGS ─────────────────────────────────────────────────────────────────
function renderBookings() {
  const all = JSON.parse(localStorage.getItem("wb_bookings") || "[]");
  const statusBadge = { confirmed: "badge-green", pending: "badge-orange", cancelled: "badge-red" };
  document.getElementById("bookingCount").textContent = all.length + " total bookings";

  if (!all.length) {
    document.getElementById("bookingsTableBody").innerHTML = "<tr><td colspan='8' style='text-align:center;color:var(--text-muted);padding:30px;'>No bookings yet</td></tr>";
    return;
  }

  const rows = all.map(function(b) {
    return "<tr>" +
      "<td style='font-weight:600;color:var(--orange);'>#" + b.id + "</td>" +
      "<td>" + b.customer + "</td>" +
      "<td>" + b.phone + "</td>" +
      "<td>" + b.bike + "</td>" +
      "<td>" + fmtDate(b.from) + "</td>" +
      "<td>" + fmtDate(b.to) + "</td>" +
      "<td style='font-weight:700;'>&#8377;" + b.amount + "</td>" +
      "<td><span class='badge " + (statusBadge[b.status] || 'badge-orange') + "' style='text-transform:capitalize;'>" + b.status + "</span></td>" +
      "</tr>";
  });
  document.getElementById("bookingsTableBody").innerHTML = rows.join("");
}

function fmtDate(str) {
  if (!str) return "-";
  const d = new Date(str);
  return isNaN(d) ? str : d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
function toast(msg, type) {
  type = type || "success";
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.className = "show " + type;
  setTimeout(function() { t.className = ""; }, 3000);
}

// ─── HAMBURGER ────────────────────────────────────────────────────────────────
document.getElementById("hamburgerAdmin").addEventListener("click", function() {
  document.getElementById("sidebar").classList.toggle("open");
});

// ─── INIT ─────────────────────────────────────────────────────────────────────
renderTable();
renderDashboard();
