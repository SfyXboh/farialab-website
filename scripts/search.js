const PAGES_TO_SEARCH = [
  {
    title: "Home",
    url: "../index.html"
  },
  {
    title: "People",
    url: "people.html"
  },
  {
    title: "Publications & Resources",
    url: "publications.html"
  }
];

function getSearchQuery() {
  const params = new URLSearchParams(window.location.search);
  return params.get("q") || "";
}

function normalizeText(text) {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function highlightQuery(text, query) {
  if (!query) return text;

  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escapedQuery})`, "gi");

  return text.replace(regex, "<mark>$1</mark>");
}

function createSnippet(content, query) {
  const cleanContent = content.replace(/\s+/g, " ").trim();
  const lowerContent = cleanContent.toLowerCase();
  const lowerQuery = query.toLowerCase();

  const matchIndex = lowerContent.indexOf(lowerQuery);

  if (matchIndex === -1) {
    return cleanContent.slice(0, 220) + "...";
  }

  const start = Math.max(0, matchIndex - 80);
  const end = Math.min(cleanContent.length, matchIndex + query.length + 140);

  let snippet = cleanContent.slice(start, end);

  if (start > 0) snippet = "..." + snippet;
  if (end < cleanContent.length) snippet = snippet + "...";

  return highlightQuery(snippet, query);
}

async function fetchPageContent(page) {
  const response = await fetch(page.url);
  const html = await response.text();

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const elements = doc.querySelectorAll("h1, h2, h3, h4, h5, h6, p");

  const content = Array.from(elements)
    .map(element => element.textContent)
    .join(" ");

  const pageTitle =
    doc.querySelector("h1")?.textContent.trim() ||
    doc.querySelector("title")?.textContent.trim() ||
    page.title;

  return {
    title: pageTitle,
    url: page.url,
    content
  };
}

async function searchPages(query) {
  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery) {
    return [];
  }

  const pages = await Promise.all(
    PAGES_TO_SEARCH.map(page => fetchPageContent(page))
  );

  return pages
    .map(page => {
      const searchableText = normalizeText(`${page.title} ${page.content}`);

      if (!searchableText.includes(normalizedQuery)) {
        return null;
      }

      let score = 0;

      if (normalizeText(page.title).includes(normalizedQuery)) {
        score += 10;
      }

      if (normalizeText(page.content).includes(normalizedQuery)) {
        score += 1;
      }

      return {
        ...page,
        score
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score);
}

async function renderResults() {
  const query = getSearchQuery();
  const resultsContainer = document.getElementById("search-results");
  const searchInput = document.getElementById("search-input");

  if (searchInput) {
    searchInput.value = query;
  }

  if (!query.trim()) {
    resultsContainer.innerHTML = "<p>Please enter a search term.</p>";
    return;
  }

  resultsContainer.innerHTML = "<p>Searching...</p>";

  const results = await searchPages(query);

  if (results.length === 0) {
    resultsContainer.innerHTML = `
      <p>No results found for <strong>${query}</strong>.</p>
    `;
    return;
  }

  resultsContainer.innerHTML = `
    <p class="search-summary">
      Found ${results.length} result${results.length === 1 ? "" : "s"} for
      <strong>${query}</strong>.
    </p>

    ${results.map(result => `
      <article class="search-result">
        <h2>
          <a href="${result.url}">${highlightQuery(result.title, query)}</a>
        </h2>

        <p class="result-snippet">
          ${createSnippet(result.content, query)}
        </p>
      </article>
    `).join("")}
  `;
}

renderResults();