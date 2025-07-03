const API_KEY ='cd6c7a3cc0fb4d599ac8c133ca52096f' ;
const container = document.getElementById("newsContainer");
const loading = document.getElementById("loading");
const toggle = document.getElementById("themeToggle");

toggle.addEventListener("change", () => {
  document.body.classList.toggle("dark", toggle.checked);
});

// Show random top news on load
window.onload = function () {
  document.body.classList.toggle("dark", localStorage.getItem("theme") === "dark");
  toggle.checked = document.body.classList.contains("dark");

  toggle.addEventListener("change", () => {
    const isDark = toggle.checked;
    document.body.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });

  loadTopNews(); // Show random headlines
};

async function loadTopNews() {
  container.innerHTML = "";
  loading.classList.remove("hidden");
  const url = `https://newsapi.org/v2/top-headlines?country=in&pageSize=8&apiKey=${API_KEY}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    loading.classList.add("hidden");
    if (data.status === "ok") displayNews(data.articles);
    else container.innerHTML = "<p>Failed to load news.</p>";
  } catch (err) {
    loading.classList.add("hidden");
    container.innerHTML = `<p>Error: ${err.message}</p>`;
  }
}

async function searchNews() {
  const query = document.getElementById("searchInput").value.trim();
  if (!query) return alert("Enter a keyword!");

  container.innerHTML = "";
  loading.classList.remove("hidden");

  const url = `https://newsapi.org/v2/everything?q=${query}&language=en&pageSize=10&apiKey=${API_KEY}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    loading.classList.add("hidden");

    if (data.status !== "ok" || data.articles.length === 0) {
      container.innerHTML = "<p>No news found. Try another keyword.</p>";
      return;
    }

    displayNews(data.articles);
  } catch (error) {
    loading.classList.add("hidden");
    container.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

function displayNews(articles) {
  container.innerHTML = "";
  articles.forEach(article => {
    const card = document.createElement("div");
    card.className = "news-card";
    card.innerHTML = `
      ${article.urlToImage ? `<img src="${article.urlToImage}" alt="news image"/>` : ""}
      <h3>${article.title}</h3>
      <p>${article.description || "No description available."}</p>
      <a href="${article.url}" target="_blank">Read More</a>
    `;
    container.appendChild(card);
  });
}