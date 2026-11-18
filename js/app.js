const Store = {
  get(k, d) {
    try {
      const v = localStorage.getItem(k);
      return v ? JSON.parse(v) : d;
    } catch (e) {
      return d;
    }
  },
  set(k, v) {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch (e) {}
  },
};

const seed = [
  { id: 1, emo: "🍛", name: "Nasi goreng", cat: "Makanan", price: 22000 },
  { id: 2, emo: "🍜", name: "Mie ayam", cat: "Makanan", price: 18000 },
  { id: 3, emo: "🍗", name: "Ayam geprek", cat: "Makanan", price: 20000 },
  { id: 4, emo: "🍲", name: "Soto ayam", cat: "Makanan", price: 19000 },
  { id: 5, emo: "🍢", name: "Sate ayam", cat: "Makanan", price: 24000 },
  { id: 6, emo: "🍚", name: "Nasi rendang", cat: "Makanan", price: 28000 },
  { id: 7, emo: "🥗", name: "Gado-gado", cat: "Makanan", price: 17000 },
  {
    id: 8,
    emo: "🍝",
    name: "Spaghetti bolognese",
    cat: "Makanan",
    price: 26000,
  },
  { id: 9, emo: "🍔", name: "Burger keju", cat: "Makanan", price: 25000 },
  { id: 10, emo: "🥟", name: "Pangsit goreng", cat: "Camilan", price: 12000 },
  { id: 11, emo: "🍟", name: "Kentang goreng", cat: "Camilan", price: 15000 },
  { id: 12, emo: "🍌", name: "Pisang goreng", cat: "Camilan", price: 10000 },
  { id: 13, emo: "🥔", name: "Tahu crispy", cat: "Camilan", price: 11000 },
  { id: 14, emo: "🍿", name: "Singkong goreng", cat: "Camilan", price: 10000 },
  {
    id: 15,
    emo: "🥪",
    name: "Roti bakar cokelat",
    cat: "Camilan",
    price: 14000,
  },
  { id: 16, emo: "☕", name: "Kopi susu", cat: "Minuman", price: 16000 },
  { id: 17, emo: "☕", name: "Americano", cat: "Minuman", price: 15000 },
  { id: 18, emo: "🥛", name: "Cappuccino", cat: "Minuman", price: 20000 },
  { id: 19, emo: "🍵", name: "Teh hangat", cat: "Minuman", price: 6000 },
  { id: 20, emo: "🧊", name: "Es teh manis", cat: "Minuman", price: 7000 },
  { id: 21, emo: "🧃", name: "Jus jeruk", cat: "Minuman", price: 14000 },
  { id: 22, emo: "🥭", name: "Jus mangga", cat: "Minuman", price: 15000 },
  { id: 23, emo: "🍫", name: "Cokelat dingin", cat: "Minuman", price: 18000 },
  { id: 24, emo: "🍨", name: "Es krim vanila", cat: "Dessert", price: 13000 },
  { id: 25, emo: "🍮", name: "Puding karamel", cat: "Dessert", price: 12000 },
  { id: 26, emo: "🍰", name: "Kue cokelat", cat: "Dessert", price: 22000 },
  { id: 27, emo: "🍧", name: "Es campur", cat: "Dessert", price: 16000 },
  { id: 28, emo: "🍲", name: "Bakso kuah", cat: "Makanan", price: 20000 },
  { id: 29, emo: "🥑", name: "Jus alpukat", cat: "Minuman", price: 17000 },
  { id: 30, emo: "🍩", name: "Donat cokelat", cat: "Dessert", price: 12000 },
];
const MenuService = {
  all: () => Store.get("menu", seed),
  save(list) {
    Store.set("menu", list);
  },
  create(d) {
    const l = this.all();
    l.push({ ...d, id: Date.now() });
    this.save(l);
  },
  update(id, d) {
    this.save(this.all().map((m) => (m.id === id ? { ...m, ...d } : m)));
  },
  remove(id) {
    this.save(this.all().filter((m) => m.id !== id));
  },
};
const Cart = {
  items: {},
  add(id) {
    this.items[id] = (this.items[id] || 0) + 1;
  },
  dec(id) {
    if (--this.items[id] <= 0) delete this.items[id];
  },
  clear() {
    this.items = {};
  },
  lines() {
    const m = MenuService.all();
    return Object.entries(this.items)
      .map(([id, q]) => {
        const p = m.find((x) => x.id == id);
        return p ? { ...p, qty: q, sub: p.price * q } : null;
      })
      .filter(Boolean);
  },
  total() {
    return this.lines().reduce((s, l) => s + l.sub, 0);
  },
};
const Orders = {
  all: () => Store.get("orders", []),
  add(o) {
    const l = this.all(),
      k = new Date().toDateString();
    const no = l.filter((x) => new Date(x.at).toDateString() === k).length + 1;
    l.push({ ...o, no });
    Store.set("orders", l);
    return no;
  },
};

const $ = (s) => document.querySelector(s);
const rp = (n) => "Rp " + new Intl.NumberFormat("id-ID").format(n);
const esc = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const ui = { q: "", cat: "Semua", editId: null, hmode: "harian" };

function renderMenu() {
  const menu = MenuService.all();
  const cats = ["Semua", ...new Set(menu.map((m) => m.cat))];
  if (!cats.includes(ui.cat)) ui.cat = "Semua";
  $("#chips").innerHTML = cats
    .map(
      (c) =>
        `<button class="chip ${c === ui.cat ? "on" : ""}" data-act="cat" data-c="${esc(c)}">${esc(c)}</button>`,
    )
    .join("");
  const list = menu.filter(
    (m) =>
      (ui.cat === "Semua" || m.cat === ui.cat) &&
      m.name.toLowerCase().includes(ui.q.toLowerCase()),
  );
  $("#grid").innerHTML = list.length
    ? list
        .map(
          (m, i) =>
            `<button class="item reveal" style="--dl:${Math.min(i, 8) * 45}ms" data-act="addCart" data-id="${m.id}"><img class="thumb" loading="lazy" alt="" src="${imgFor(m)}"><b>${esc(m.name)}</b><span>${rp(m.price)}</span></button>`,
        )
        .join("")
    : '<div class="empty" style="grid-column:1/-1">Menu tidak ditemukan. Coba kata kunci lain.</div>';
  observeReveals();
  $("#cats").innerHTML = cats
    .slice(1)
    .map((c) => `<option value="${esc(c)}">`)
    .join("");
}
function renderCart() {
  const ls = Cart.lines();
  $("#cart").innerHTML = ls.length
    ? ls
        .map(
          (l) => `
    <div class="line"><img class="mini" alt="" src="${imgFor(l)}"><div class="n"><b>${esc(l.name)}</b><small>${rp(l.price)}</small></div>
    <div class="qty"><button data-act="dec" data-id="${l.id}" aria-label="Kurangi">−</button><span>${l.qty}</span><button data-act="addCart" data-id="${l.id}" aria-label="Tambah">+</button></div>
    <b style="min-width:84px;text-align:right">${rp(l.sub)}</b></div>`,
        )
        .join("")
    : '<div class="empty">Belum ada belanjaan.<br>Pilih menu untuk memulai.</div>';
  $("#total").textContent = rp(Cart.total());
  $("#payBtn").disabled = !ls.length;
  syncDock();
}
function renderTable() {
  const m = MenuService.all();
  $("#rows").innerHTML = m.length
    ? m
        .map(
          (
            x,
          ) => `<tr><td><span class="nm"><img class="mini" alt="" src="${imgFor(x)}">${esc(x.name)}</span></td><td>${esc(x.cat)}</td><td>${rp(x.price)}</td>
    <td style="white-space:nowrap;text-align:right"><button class="btn ghost sm" data-act="edit" data-id="${x.id}">Ubah</button> <button class="btn danger sm" data-act="del" data-id="${x.id}">Hapus</button></td></tr>`,
        )
        .join("")
    : '<tr><td colspan="4" class="empty">Belum ada menu. Tambah menu pertama Anda.</td></tr>';
}
const renderAll = () => {
  renderMenu();
  renderCart();
  renderTable();
};

function openForm(id) {
  ui.editId = id || null;
  const m = id
    ? MenuService.all().find((x) => x.id === id)
    : { emo: "🍽️", name: "", cat: "", price: "" };
  $("#fTitle").textContent = id ? "Ubah menu" : "Tambah menu";
  $("#fEmo").value = m.emo;
  $("#fName").value = m.name;
  $("#fCat").value = m.cat;
  $("#fPrice").value = m.price;
  ui.photo = m.photo || "";
  prevPic();
  $("#mForm").classList.add("open");
  $("#fName").focus();
}
function saveForm() {
  const d = {
    emo: $("#fEmo").value.trim() || "🍽️",
    name: $("#fName").value.trim(),
    cat: $("#fCat").value.trim() || "Lainnya",
    price: Number($("#fPrice").value),
    photo: ui.photo || "",
  };
  if (!d.name || !(d.price >= 0) || $("#fPrice").value === "") {
    alert("Isi nama menu dan harga terlebih dahulu.");
    return;
  }
  ui.editId ? MenuService.update(ui.editId, d) : MenuService.create(d);
  $("#mForm").classList.remove("open");
  renderAll();
}

function openPay() {
  const t = Cart.total();
  if (!t) return;
  $("#pTotal").textContent = rp(t);
  $("#pCash").value = "";
  const opts = [
    ...new Set([
      t,
      Math.ceil(t / 50000) * 50000,
      Math.ceil(t / 100000) * 100000,
    ]),
  ];
  $("#quick").innerHTML = opts
    .map(
      (v, i) =>
        `<button class="btn ghost sm" data-act="quick" data-v="${v}">${i === 0 ? "Uang pas" : rp(v)}</button>`,
    )
    .join("");
  calcChange();
  $("#mPay").classList.add("open");
  $("#pCash").focus();
}
function calcChange() {
  const cash = Number($("#pCash").value) || 0,
    t = Cart.total();
  $("#pChange").textContent = rp(Math.max(0, cash - t));
  $("#confirmPay").disabled = cash < t;
}
function confirmPay() {
  const cash = Number($("#pCash").value),
    total = Cart.total();
  const no = Orders.add({
    at: new Date().toISOString(),
    items: Cart.lines().map(({ photo, emo, ...r }) => r),
    total,
    cash,
    change: cash - total,
  });
  $("#okNo").textContent = "Transaksi #" + String(no).padStart(4, "0");
  $("#okSum").innerHTML =
    `<div><span>Total</span><b>${rp(total)}</b></div><div><span>Dibayar</span><b>${rp(cash)}</b></div><div><span>Kembalian</span><b>${rp(cash - total)}</b></div>`;
  Cart.clear();
  renderCart();
  $("#mPay").classList.remove("open");
  $("#mOk").classList.add("open");
}

const navWrap = $("#navWrap");
const navToggle = $("#navToggle");
const navMenu = $("#navMenu");
function setNavOpen(open, focusToggle = false) {
  navWrap.classList.toggle("is-open", open);
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute(
    "aria-label",
    open ? "Tutup menu navigasi" : "Buka menu navigasi",
  );
  navMenu.setAttribute("aria-hidden", String(!open));
  navMenu.inert = !open;
  if (focusToggle) navToggle.focus();
}

const actions = {
  toggleNav: () => setNavOpen(!navWrap.classList.contains("is-open")),
  view: (el) => {
    const v = el.dataset.v;
    document.querySelectorAll(".tab").forEach((t) => {
      t.classList.toggle("on", t === el);
      if (t === el) t.setAttribute("aria-current", "page");
      else t.removeAttribute("aria-current");
    });
    $("#navSelected").textContent = el.querySelector(
      "span:not(.nav-active-mark)",
    ).textContent;
    $("#v-kasir").classList.toggle("hide", v !== "kasir");
    $("#v-kelola").classList.toggle("hide", v !== "kelola");
    $("#v-riwayat").classList.toggle("hide", v !== "riwayat");
    setNavOpen(false, true);
    syncDock();
    if (v === "riwayat") renderHistory();
  },
  cat: (el) => {
    ui.cat = el.dataset.c;
    renderMenu();
  },
  toCart: () => $("#cartPanel").scrollIntoView({ block: "center" }),
  hmode: (el) => {
    ui.hmode = el.dataset.m;
    renderHistory();
  },
  demo: () => seedDemo(),
  wipe: () => {
    if (confirm("Hapus seluruh riwayat transaksi?")) {
      Store.set("orders", []);
      renderHistory();
    }
  },
  addCart: (el) => {
    Cart.add(el.dataset.id);
    renderCart();
  },
  dec: (el) => {
    Cart.dec(el.dataset.id);
    renderCart();
  },
  clear: () => {
    Cart.clear();
    renderCart();
  },
  pay: openPay,
  confirm: confirmPay,
  quick: (el) => {
    $("#pCash").value = el.dataset.v;
    calcChange();
  },
  closePay: () => $("#mPay").classList.remove("open"),
  done: () => $("#mOk").classList.remove("open"),
  add: () => openForm(),
  edit: (el) => openForm(Number(el.dataset.id)),
  del: (el) => {
    if (confirm("Hapus menu ini?")) {
      const id = Number(el.dataset.id);
      MenuService.remove(id);
      delete Cart.items[id];
      renderAll();
    }
  },
  saveForm,
  closeForm: () => $("#mForm").classList.remove("open"),
};
document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-act]");
  if (el && actions[el.dataset.act]) actions[el.dataset.act](el);
  if (!navWrap.contains(e.target) && navWrap.classList.contains("is-open"))
    setNavOpen(false);
});
$("#q").addEventListener("input", (e) => {
  ui.q = e.target.value;
  renderMenu();
});
$("#pCash").addEventListener("input", calcChange);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document
      .querySelectorAll(".modal.open")
      .forEach((m) => m.classList.remove("open"));
    if (navWrap.classList.contains("is-open")) setNavOpen(false, true);
  }
});
navToggle.addEventListener("keydown", (e) => {
  if (e.key === "ArrowDown") {
    e.preventDefault();
    setNavOpen(true);
    navMenu.querySelector(".tab").focus();
  }
});

let cartSeen = false;
const io =
  "IntersectionObserver" in window
    ? new IntersectionObserver(
        (es) =>
          es.forEach((e) => {
            if (!e.isIntersecting) return;
            const el = e.target;
            el.classList.add("in");
            io.unobserve(el);
            setTimeout(() => el.style.setProperty("--dl", "0s"), 1000);
          }),
        { threshold: 0.08, rootMargin: "0px 0px -5% 0px" },
      )
    : null;
function observeReveals() {
  document
    .querySelectorAll(".reveal:not(.in)")
    .forEach((el) => (io ? io.observe(el) : el.classList.add("in")));
}
function syncDock() {
  const n = Object.values(Cart.items).reduce((a, b) => a + b, 0);
  $("#dockN").textContent = n + " item";
  $("#dockT").textContent = rp(Cart.total());
  $("#dock").classList.toggle(
    "show",
    n > 0 && !cartSeen && !$("#v-kasir").classList.contains("hide"),
  );
}
if ("IntersectionObserver" in window)
  new IntersectionObserver(
    (es) => {
      cartSeen = es[0].isIntersecting;
      syncDock();
    },
    { threshold: 0.35 },
  ).observe($("#cartPanel"));
const prog = $("#prog");
let tick = false;
function onScroll() {
  if (tick) return;
  tick = true;
  requestAnimationFrame(() => {
    const h = document.documentElement.scrollHeight - innerHeight;
    prog.style.transform =
      "scaleX(" + (h > 0 ? Math.min(1, scrollY / h) : 0) + ")";
    tick = false;
  });
}
addEventListener("scroll", onScroll, { passive: true });
addEventListener("resize", onScroll);

const dk = (d) =>
  d.getFullYear() +
  "-" +
  String(d.getMonth() + 1).padStart(2, "0") +
  "-" +
  String(d.getDate()).padStart(2, "0");
const D = (d, k = 0) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate() + k);
const lf = (d, o) => d.toLocaleDateString("id-ID", o);
const MODES = {
  harian: {
    n: 14,
    start: (d) => D(d),
    step: (d, k) => D(d, k),
    prev: "kemarin",
    now: "Hari ini",
  },
  mingguan: {
    n: 8,
    start: (d) => D(d, -((d.getDay() + 6) % 7)),
    step: (d, k) => D(d, 7 * k),
    prev: "minggu lalu",
    now: "Minggu ini",
  },
  bulanan: {
    n: 12,
    start: (d) => new Date(d.getFullYear(), d.getMonth(), 1),
    step: (d, k) => new Date(d.getFullYear(), d.getMonth() + k, 1),
    prev: "bulan lalu",
    now: "Bulan ini",
  },
};
const labels = {
  harian: (d) => lf(d, { day: "numeric", month: "short" }),
  mingguan: (d) => lf(d, { day: "numeric", month: "short" }),
  bulanan: (d) => lf(d, { month: "short", year: "2-digit" }),
};
const titles = {
  harian: (d) =>
    lf(d, { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
  mingguan: (d) =>
    lf(d, { day: "numeric", month: "short" }) +
    " – " +
    lf(D(d, 6), { day: "numeric", month: "short", year: "numeric" }),
  bulanan: (d) => lf(d, { month: "long", year: "numeric" }),
};
const short = (n) => {
  const f = (v, u) =>
    (Number.isInteger(v) ? v : v.toFixed(1).replace(".", ",")) + " " + u;
  return n >= 1e6 ? f(n / 1e6, "jt") : n >= 1e3 ? f(n / 1e3, "rb") : String(n);
};
function groupOrders(mode, orders) {
  const M = MODES[mode],
    g = new Map();
  orders.forEach((o) => {
    const s = M.start(new Date(o.at)),
      k = dk(s);
    if (!g.has(k)) g.set(k, { date: s, total: 0, count: 0, list: [] });
    const x = g.get(k);
    x.total += o.total;
    x.count++;
    x.list.push(o);
  });
  return g;
}
function series(mode, g) {
  const M = MODES[mode],
    cur = M.start(new Date());
  return Array.from({ length: M.n }, (_, i) => {
    const s = M.step(cur, i - M.n + 1),
      x = g.get(dk(s));
    return { date: s, total: x ? x.total : 0, count: x ? x.count : 0 };
  });
}
function chartSVG(s, mode, anim) {
  const W = Math.max(300, $("#chart").clientWidth || 600),
    H = 230,
    L = 48,
    R = 14,
    T = 14,
    B = 32,
    n = s.length;
  const max = Math.max(...s.map((x) => x.total));
  let q = 25000;
  if (max > 0) {
    const raw = max / 4,
      p = Math.pow(10, Math.floor(Math.log10(raw)));
    q = [1, 2, 2.5, 5, 10].map((c) => c * p).find((v) => v >= raw);
  }
  const top = q * 4;
  const x = (i) => L + (W - L - R) * (n === 1 ? 0.5 : i / (n - 1)),
    y = (v) => T + (H - T - B) * (1 - v / top);
  const pts = s.map((p, i) => [x(i), y(p.total)]);
  const line = pts
    .map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1))
    .join(" ");
  const area =
    line + ` L${x(n - 1).toFixed(1)} ${H - B} L${x(0).toFixed(1)} ${H - B} Z`;
  const grid = [0, 1, 2, 3, 4]
    .map((i) => {
      const v = q * i,
        yy = y(v).toFixed(1);
      return `<line class="ch-grid" x1="${L}" x2="${W - R}" y1="${yy}" y2="${yy}"/><text class="ch-t" x="${L - 8}" y="${+yy + 4}" text-anchor="end">${short(v)}</text>`;
    })
    .join("");
  const step = Math.ceil(n / Math.max(2, Math.floor((W - L - R) / 58)));
  const xl = s
    .map((p, i) =>
      (n - 1 - i) % step === 0
        ? `<text class="ch-t" x="${x(i).toFixed(1)}" y="${H - 10}" text-anchor="middle">${esc(labels[mode](p.date))}</text>`
        : "",
    )
    .join("");
  const dots = s
    .map(
      (p, i) =>
        `<circle class="ch-dot" cx="${pts[i][0].toFixed(1)}" cy="${pts[i][1].toFixed(1)}" r="${i === n - 1 ? 5 : 3.5}"><title>${esc(labels[mode](p.date))}: ${rp(p.total)} (${p.count} transaksi)</title></circle>`,
    )
    .join("");
  return `<svg class="${anim ? "" : "noanim"}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Grafik penjualan">${grid}<path class="ch-area" d="${area}"/><path class="ch-line" pathLength="1" d="${line}"/>${xl}${dots}</svg>`;
}
function renderHistory(anim = true) {
  const mode = ui.hmode,
    M = MODES[mode];
  const orders = Orders.all()
    .slice()
    .sort((a, b) => (a.at < b.at ? -1 : 1));
  const g = groupOrders(mode, orders),
    s = series(mode, g),
    cur = s[s.length - 1],
    prev = s[s.length - 2];
  document
    .querySelectorAll(".segb")
    .forEach((b) => b.classList.toggle("on", b.dataset.m === mode));
  const avg = cur.count ? Math.round(cur.total / cur.count) : 0;
  let trend;
  if (prev.total > 0) {
    const p = Math.round(((cur.total - prev.total) / prev.total) * 100);
    trend =
      p === 0
        ? `<p class="trend">Sama dengan ${M.prev}</p>`
        : `<p class="trend ${p > 0 ? "up" : "down"}">${p > 0 ? "▲ Naik" : "▼ Turun"} ${Math.abs(p)}% dibanding ${M.prev}</p>`;
  } else
    trend = `<p class="trend note">Belum ada data ${M.prev} sebagai pembanding</p>`;
  $("#stats").innerHTML =
    `<div class="stat"><small>${M.now}</small><b>${rp(cur.total)}</b></div><div class="stat"><small>Transaksi</small><b>${cur.count}</b></div><div class="stat"><small>Rata-rata</small><b>${rp(avg)}</b></div>`;
  $("#chart").innerHTML = trend + chartSVG(s, mode, anim);
  $("#lTitle").textContent = {
    harian: "Transaksi per hari",
    mingguan: "Ringkasan per minggu",
    bulanan: "Ringkasan per bulan",
  }[mode];
  const keys = [...g.keys()]
    .sort()
    .reverse()
    .slice(0, mode === "harian" ? 30 : 24);
  $("#hlist").innerHTML = keys.length
    ? keys
        .map((k, i) => {
          const x = g.get(k),
            head = `<div class="gt">${esc(titles[mode](x.date))}<small>${x.count} transaksi</small></div><b>${rp(x.total)}</b>`;
          if (mode !== "harian") return `<div class="grow">${head}</div>`;
          const tx = x.list
            .map(
              (o, j) =>
                `<div class="tx"><span class="no">#${String(j + 1).padStart(4, "0")}</span><span class="it">${esc(o.items.map((l) => l.qty + "× " + l.name).join(", "))}<br>${new Date(o.at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</span><b>${rp(o.total)}</b></div>`,
            )
            .reverse()
            .join("");
          return `<details class="g" ${i === 0 ? "open" : ""}><summary>${head}</summary>${tx}</details>`;
        })
        .join("")
    : '<div class="empty">Belum ada transaksi. Selesaikan pembayaran pertama atau isi data contoh.</div>';
}
function seedDemo() {
  const m = MenuService.all();
  if (!m.length) {
    alert("Tambah menu terlebih dahulu.");
    return;
  }
  const out = [],
    now = new Date(),
    rnd = (n) => Math.floor(Math.random() * n);
  for (let d = 59; d >= 0; d--) {
    const day = D(now, -d),
      wk = [0, 6].includes(day.getDay()),
      cnt = Math.round((wk ? 9 : 5) + Math.random() * 6 + (60 - d) / 12);
    const hmax = d === 0 ? Math.max(8, now.getHours()) : 21;
    for (let i = 0; i < cnt; i++) {
      const t = new Date(
        day.getFullYear(),
        day.getMonth(),
        day.getDate(),
        8 + rnd(hmax - 7),
        rnd(60),
      );
      const pick = [...m].sort(() => Math.random() - 0.5).slice(0, 1 + rnd(3));
      const items = pick.map((p) => {
        const qty = 1 + rnd(3);
        return {
          id: p.id,
          name: p.name,
          price: p.price,
          qty,
          sub: p.price * qty,
        };
      });
      const total = items.reduce((a, l) => a + l.sub, 0),
        cash = Math.ceil(total / 50000) * 50000;
      out.push({
        at: t.toISOString(),
        items,
        total,
        cash,
        change: cash - total,
      });
    }
  }
  Store.set(
    "orders",
    [...Orders.all(), ...out].sort((a, b) => (a.at < b.at ? -1 : 1)),
  );
  renderHistory();
}
let rt;
addEventListener("resize", () => {
  clearTimeout(rt);
  rt = setTimeout(() => {
    if (!$("#v-riwayat").classList.contains("hide")) renderHistory(false);
  }, 150);
});

Object.assign(actions, {
  pick: () => $("#fFile").click(),
  unpic: () => {
    ui.photo = "";
    prevPic();
  },
});
$("#fFile").addEventListener("change", (e) => {
  const f = e.target.files[0];
  if (!f) return;
  const fr = new FileReader();
  fr.onload = () => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = 400;
      c.height = 300;
      const g = c.getContext("2d"),
        k = Math.max(400 / img.width, 300 / img.height),
        w = img.width * k,
        h = img.height * k;
      g.drawImage(img, (400 - w) / 2, (300 - h) / 2, w, h);
      ui.photo = c.toDataURL("image/jpeg", 0.8);
      prevPic();
    };
    img.onerror = () => alert("File gambar tidak bisa dibaca.");
    img.src = fr.result;
  };
  fr.readAsDataURL(f);
  e.target.value = "";
});
$("#fName").addEventListener("input", prevPic);
$("#fEmo").addEventListener("input", prevPic);

const REG = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' rx='14' fill='#0284c7'/><rect x='20' y='9' width='24' height='13' rx='3' fill='#e0f2fe'/><rect x='30' y='22' width='4' height='5' fill='#e0f2fe'/><path d='M17 27h30l6 14H11z' fill='#fff'/><rect x='9' y='41' width='46' height='15' rx='3' fill='#bae6fd'/><rect x='25' y='47' width='14' height='3' rx='1.5' fill='#0284c7'/><g fill='#0284c7'><circle cx='24' cy='32' r='2'/><circle cx='32' cy='32' r='2'/><circle cx='40' cy='32' r='2'/><circle cx='21' cy='37' r='2'/><circle cx='29' cy='37' r='2'/><circle cx='37' cy='37' r='2'/><circle cx='45' cy='37' r='2'/></g></svg>`;
$(".logo").innerHTML = REG;
{
  const fav = document.createElement("link");
  fav.rel = "icon";
  fav.type = "image/svg+xml";
  fav.href = "data:image/svg+xml," + encodeURIComponent(REG);
  document.head.appendChild(fav);
}

renderAll();
observeReveals();
