// Datos de demostración. En producción, reemplaza esta información por datos de una API/base de datos.
const companies = [
  {
    id: "empresa-1", name: "Manpower", city: "Cali", rating: 2.4,
    nit: "?", address: "Cali",
    logo: "E1",
    reviews: [
      { name: "Anonimo", rating: 2, date: "2026-10-15", text: "Te prometen trabajo, todo vía telefónica, correo electrónico y te piden renunciar a tu trabajo sin haberte hecho firmar ningún contrato." }
      
    ]
  },
  {
    id: "empresa-2", name: "Konecta", city: "Bogotá", rating: 2.0,
    nit: "?", address: "Bogotá",
    logo: "E2",
    reviews: [
      { name: "Anonimo", rating: 2, date: "2026-10-18", text: "Sueldos muy por debajo del mercado. Negociable según experiencia y desempeño. Nunca hay un reajuste general. Te hacen firmar un contrato donde no podes trabajar por ninguno de sus clientes hasta después de 6 meses de salir de ahí, eso es ilegal." }
    ]
  },
  {
    id: "empresa-3", name: "Reserco International Services It S.A.S", city: "Bogotá", rating: 2,
    nit: "900759950", address: "Cra. 68a #19-38, Bogotá",
    logo: "E3",
    reviews: [
      { name: "Anonimo", rating: 2.5, date: "2026-10-22", text: "La empresa tiene problemas financieros, no pagan a tiempo el sueldo a sus empleados pero si le pagan a los jefes. Al finalizar contrato no te pagan liquidacion, te envian el comprobante de pago a tu correo pero el dinero nunca llega a tu cuenta." }
    ]
  },
   {
    id: "empresa-4", name: "Infocenter", city: "Medellín", rating: 4.2,
    nit: "?", address: "Medellín",
    logo: "E3",
    reviews: [
      { name: "Anonimo", rating: 2.1, date: "2026-10-22", text: "Buena experiencia, personal amable y proceso sencillo." }
    ]
  },
   {
    id: "empresa-5", name: "Micropoint SAS", city: "Bogotá", rating: 4.2,
    nit: "?", address: "Bogotá",
    logo: "E3",
    reviews: [
      { name: "Anonimo", rating: 2, date: "2026-10-22", text: "No te asignan herramientas de trabajo y debes compartirla con otro técnico. Gerente es grosero y grita a sus empleados por telefono." }
    ]
  }
];

const STORAGE_KEY = "dataempresas-reviews";

function getSavedReviews() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); }
  catch { return {}; }
}

function getReviews(company) {
  const saved = getSavedReviews()[company.id] || [];
  return [...company.reviews, ...saved];
}

function averageRating(company) {
  const reviews = getReviews(company);
  if (!reviews.length) return company.rating;
  return reviews.reduce((sum, review) => sum + Number(review.rating), 0) / reviews.length;
}

function starString(value) {
  const rounded = Math.round(Number(value) || 0);
  return "★ ".repeat(rounded) + "☆ ".repeat(5 - rounded);
}

function formatDate(dateString) {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
}

function renderSharedLayout() {
  const header = document.getElementById("site-header");
  const footer = document.getElementById("site-footer");
  const currentPage = location.pathname.split("/").pop() || "index.html";
  if (header) {
    header.innerHTML = `
      <header class="site-header">
        <nav class="navbar" aria-label="Navegación principal">
          <a class="brand" href="index.html">Blacklist Empresas Colombia</a>
          <div class="nav-links">
            <a href="index.html" ${currentPage === "index.html" ? 'aria-current="page"' : ""}>Buscar empresa</a>
            <a href="empresas.html" ${currentPage === "empresas.html" ? 'aria-current="page"' : ""}>Ver lista</a>
          </div>
        </nav>
      </header>`;
  }
  if (footer) {
    footer.innerHTML = `<footer class="site-footer"><p>© 2026 Blacklist. Todos los derechos reservados.</p></footer>`;
  }
}

function renderCompanyList() {
  const tbody = document.getElementById("company-list");
  if (!tbody) return;
  tbody.innerHTML = companies.map((company, index) => {
    const rating = averageRating(company);
    return `<tr>
      <td>${index + 1}.</td>
      <td><a href="empresa.html?id=${encodeURIComponent(company.id)}">${company.name}</a></td>
      <td>${company.city}</td>
      <td><span class="rating-number">${rating.toFixed(1)}</span><span class="stars" aria-label="${rating.toFixed(1)} de 5">${starString(rating)}</span></td>
    </tr>`;
  }).join("");
}

function renderSearch() {
  const form = document.getElementById("search-form");
  const input = document.getElementById("search-input");
  const results = document.getElementById("search-results");
  if (!form || !input || !results) return;

  const showResults = (query) => {
    const normalized = query.trim().toLocaleLowerCase("es");
    if (!normalized) { results.innerHTML = ""; return; }
    const matches = companies.filter(company => company.name.toLocaleLowerCase("es").includes(normalized));
    results.innerHTML = matches.length
      ? matches.map(company => `<a class="result-item" href="empresa.html?id=${encodeURIComponent(company.id)}"><strong>${company.name}</strong> · ${company.city} <span class="stars">${starString(averageRating(company))}</span></a>`).join("")
      : `<p class="empty-state">No encontramos empresas con ese nombre.</p>`;
  };

  input.addEventListener("input", () => showResults(input.value));
  form.addEventListener("submit", event => {
    event.preventDefault();
    showResults(input.value);
  });
}

function renderCompanyDetail() {
  const detail = document.getElementById("company-detail");
  if (!detail) return;
  const params = new URLSearchParams(location.search);
  const company = companies.find(item => item.id === params.get("id"));
  if (!company) {
    detail.innerHTML = `<div class="empty-state">No encontramos esta empresa. <a href="empresas.html">Volver a la lista</a>.</div>`;
    document.getElementById("add-review-button").hidden = true;
    return;
  }

  document.title = `Blacklist | ${company.name}`;
  detail.innerHTML = `
    <div class="company-logo" aria-label="Logo de ${company.name}">${company.logo}</div>
    <div>
      <p class="eyebrow">Información de la empresa</p>
      <h1>${company.name}</h1>
      <div><span class="rating-number">${averageRating(company).toFixed(1)}</span><span class="stars">${starString(averageRating(company))}</span></div>
      <div class="company-meta">
        <p><strong>Ciudad:</strong> ${company.city}</p>
        <p><strong>NIT:</strong> ${company.nit}</p>
        <p><strong>Dirección:</strong> ${company.address}</p>
      </div>
    </div>`;

  renderReviews(company);
  const addButton = document.getElementById("add-review-button");
  const formSection = document.getElementById("review-form-section");
  const cancelButton = document.getElementById("cancel-review-button");
  const dateInput = document.getElementById("review-date");
  dateInput.value = new Date().toLocaleDateString("en-CA");

  addButton.addEventListener("click", () => {
    formSection.hidden = false;
    dateInput.value = new Date().toLocaleDateString("en-CA");
    formSection.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  cancelButton.addEventListener("click", () => {
    formSection.hidden = true;
    document.getElementById("review-form").reset();
    dateInput.value = new Date().toLocaleDateString("en-CA");
  });

  document.getElementById("review-form").addEventListener("submit", event => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const rating = data.get("rating");
    const review = {
      name: String(data.get("name")).trim(),
      date: dateInput.value,
      rating: Number(rating),
      text: String(data.get("text")).trim()
    };
    if (!review.name || !review.rating || review.text.length < 10) return;

    const saved = getSavedReviews();
    saved[company.id] = [...(saved[company.id] || []), review];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    form.reset();
    dateInput.value = new Date().toLocaleDateString("en-CA");
    formSection.hidden = true;
    renderReviews(company);
    renderCompanyList();
    const message = document.getElementById("form-message");
    message.textContent = "¡Gracias! Tu opinión se ha publicado en este navegador.";
    setTimeout(() => { message.textContent = ""; }, 4000);
  });
}

function renderReviews(company) {
  const list = document.getElementById("reviews-list");
  if (!list) return;
  const reviews = getReviews(company).slice().sort((a, b) => b.date.localeCompare(a.date));
  list.innerHTML = reviews.length ? reviews.map(review => `
    <article class="review-card">
      <div class="review-top">
        <div><h3>${escapeHTML(review.name)}</h3><span class="stars" aria-label="${review.rating} de 5">${starString(review.rating)}</span></div>
        <time class="review-date" datetime="${review.date}">${formatDate(review.date)}</time>
      </div>
      <p>${escapeHTML(review.text)}</p>
    </article>`).join("") : `<div class="empty-state">Esta empresa todavía no tiene opiniones. ¡Sé la primera persona en compartir tu experiencia!</div>`;
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}

document.addEventListener("DOMContentLoaded", () => {
  renderSharedLayout();
  renderCompanyList();
  renderSearch();
  renderCompanyDetail();
});
