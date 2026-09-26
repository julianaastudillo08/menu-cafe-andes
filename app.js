const MENU = [
  { id: "1", name: "Latte Andes", cat: "bebidas", desc: "Espresso, leche vaporizada y toque de canela.", price: 9500 },
  { id: "2", name: "Cold Brew", cat: "bebidas", desc: "Infusión fría 16h, notas chocolate.", price: 11000 },
  { id: "3", name: "Chocolate caliente", cat: "bebidas", desc: "Cacao de Huila, crema suave.", price: 9000 },
  { id: "4", name: "Brownie nogal", cat: "dulces", desc: "Húmedo, con nuez tostada.", price: 8500 },
  { id: "5", name: "Banana bread", cat: "dulces", desc: "Porción del día, mantequilla opcional.", price: 7500 },
  { id: "6", name: "Tostada aguacate", cat: "salados", desc: "Pan masa madre, limón y semillas.", price: 14000 },
  { id: "7", name: "Bowl avena", cat: "salados", desc: "Fruta de temporada y miel.", price: 12000 },
  { id: "8", name: "Empanada maíz", cat: "salados", desc: "Rellena de queso y cubios.", price: 6000 },
];

const KEY = "menu-cafe-favs-v1";
let cat = "todos";
let active = null;
const favs = new Set(JSON.parse(localStorage.getItem(KEY) || "[]"));

const money = (n) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

function renderCats() {
  const cats = ["todos", ...new Set(MENU.map((m) => m.cat))];
  const box = document.getElementById("cats");
  box.innerHTML = "";
  cats.forEach((c) => {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = c;
    b.className = cat === c ? "active" : "";
    b.addEventListener("click", () => {
      cat = c;
      render();
    });
    box.appendChild(b);
  });
}

function filtered() {
  const q = document.getElementById("search").value.trim().toLowerCase();
  return MENU.filter((m) => {
    const okCat = cat === "todos" || m.cat === cat;
    const okQ = !q || `${m.name} ${m.desc}`.toLowerCase().includes(q);
    return okCat && okQ;
  });
}

function renderGrid() {
  const grid = document.getElementById("grid");
  grid.innerHTML = "";
  filtered().forEach((m) => {
    const art = document.createElement("article");
    art.className = "card";
    art.innerHTML = `<h3>${m.name}</h3><p>${m.desc}</p><div class="row"><strong>${money(m.price)}</strong><span class="tag">${m.cat}${favs.has(m.id) ? " · ♥" : ""}</span></div>`;
    art.addEventListener("click", () => open(m));
    grid.appendChild(art);
  });
}

function open(m) {
  active = m;
  const drawer = document.getElementById("drawer");
  drawer.hidden = false;
  document.getElementById("dTitle").textContent = m.name;
  document.getElementById("dDesc").textContent = m.desc;
  document.getElementById("dPrice").textContent = money(m.price);
  document.getElementById("favBtn").textContent = favs.has(m.id) ? "Quitar de favoritos" : "Añadir a favoritos";
}

function render() {
  renderCats();
  renderGrid();
}

document.getElementById("search").addEventListener("input", renderGrid);
document.getElementById("close").addEventListener("click", () => {
  document.getElementById("drawer").hidden = true;
});
document.getElementById("favBtn").addEventListener("click", () => {
  if (!active) return;
  if (favs.has(active.id)) favs.delete(active.id);
  else favs.add(active.id);
  localStorage.setItem(KEY, JSON.stringify([...favs]));
  open(active);
  renderGrid();
});

render();
