/* Gera HTML estático (com SEO) para a página inicial e para cada review publicada.
 * Corre depois do "craco build". Variáveis:
 *   REACT_APP_BACKEND_URL  URL do backend (Render), ex.: https://myg-reviews-api.onrender.com
 *   SITE_URL               Domínio público do site, ex.: https://www.mygreviews.pt
 * Se o backend não responder, o build continua (fica só a SPA normal).
 */
const fs = require("fs");
const path = require("path");

const BUILD = path.join(__dirname, "..", "build");
const API = (process.env.REACT_APP_BACKEND_URL || "").replace(/\/$/, "");
const SITE = (process.env.SITE_URL || process.env.REACT_APP_SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` || "").replace(/\/$/, "");
const SITE_NAME = "Myg Reviews";
const DISCLOSURE_GIFT = "Recebi este produto gratuitamente para teste. Ninguém reviu ou aprovou este texto antes da publicação.";
const DISCLOSURE_AFFILIATE = "Como Associado da Amazon, recebo uma comissão pelas compras qualificadas feitas através dos links deste site, sem custo adicional para ti.";

const esc = (s = "") => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const inline = (s = "") => esc(s).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
const abs = (src = "") => (/^https?:\/\//.test(src) ? src : src.startsWith("/api/") ? `${API}${src}` : `${SITE}${src}`);
const score = (v) => (v === null || v === undefined ? null : Number(v));

function bodyHtml(text = "") {
  const out = []; let para = []; let list = null;
  const fp = () => { if (para.length) { out.push(`<p>${inline(para.join(" "))}</p>`); para = []; } };
  const fl = () => { if (list) { out.push(`<ul>${list.map((i) => `<li>${inline(i)}</li>`).join("")}</ul>`); list = null; } };
  for (const raw of text.split("\n")) {
    const l = raw.trim();
    if (!l) { fp(); fl(); continue; }
    if (l.startsWith("### ")) { fp(); fl(); out.push(`<h3>${inline(l.slice(4))}</h3>`); continue; }
    if (l.startsWith("## ")) { fp(); fl(); out.push(`<h2>${inline(l.slice(3))}</h2>`); continue; }
    if (l.startsWith("- ")) { fp(); (list = list || []).push(l.slice(2)); continue; }
    fl(); para.push(l);
  }
  fp(); fl();
  return out.join("\n");
}

function jsonLd(r, url) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: r.name,
    image: (r.photos || []).map((p) => abs(p.src)),
    description: r.summary || undefined,
    review: {
      "@type": "Review",
      name: `Review: ${r.name}`,
      url,
      author: { "@type": "Person", name: process.env.REVIEW_AUTHOR || "Miguel Peixoto" },
      datePublished: (r.created_at || "").slice(0, 10),
      dateModified: (r.updated_at || "").slice(0, 10),
      reviewBody: r.summary || undefined,
      positiveNotes: r.pros?.length ? { "@type": "ItemList", itemListElement: r.pros.map((name, i) => ({ "@type": "ListItem", position: i + 1, name })) } : undefined,
      negativeNotes: r.cons?.length ? { "@type": "ItemList", itemListElement: r.cons.map((name, i) => ({ "@type": "ListItem", position: i + 1, name })) } : undefined,
    },
  };
  const brand = (r.specs || []).find((s) => /marca/i.test(s.label));
  if (brand) data.brand = { "@type": "Brand", name: brand.value.split(" ")[0] };
  if (score(r.score) !== null) data.review.reviewRating = { "@type": "Rating", ratingValue: score(r.score), bestRating: 10, worstRating: 0 };
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function headFor({ title, description, url, image, extra = "" }) {
  return [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    url ? `<link rel="canonical" href="${esc(url)}" />` : "",
    `<meta property="og:type" content="article" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    url ? `<meta property="og:url" content="${esc(url)}" />` : "",
    image ? `<meta property="og:image" content="${esc(image)}" />` : "",
    `<meta name="twitter:card" content="summary_large_image" />`,
    extra,
  ].filter(Boolean).join("\n        ");
}

const S = "font-family:Onest,system-ui,sans-serif;max-width:760px;margin:0 auto;padding:120px 20px 60px;line-height:1.7;color:#111";

function reviewStatic(r) {
  const s = score(r.score);
  return `<div style="${S}">
<p><a href="/">Reviews</a> / ${esc(r.category)}</p>
<h1>${esc(r.name)}</h1>
${r.summary ? `<p>${esc(r.summary)}</p>` : ""}
${r.vine ? "<p>Produto oferecido para teste. Contém links de afiliado.</p>" : "<p>Contém links de afiliado.</p>"}
${s !== null ? `<p>Nota: ${s.toFixed(1)}/10</p>` : ""}
${r.photos?.[0] ? `<img src="${esc(r.photos[0].src.startsWith("/api/") ? abs(r.photos[0].src) : r.photos[0].src)}" alt="${esc(r.name)}" style="max-width:100%;height:auto" />` : ""}
${r.pros?.length ? `<h2>Gostei</h2><ul>${r.pros.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>` : ""}
${r.cons?.length ? `<h2>Menos bom</h2><ul>${r.cons.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>` : ""}
${bodyHtml(r.body)}
${r.specs?.length ? `<h2>Especificações</h2><dl>${r.specs.map((x) => `<dt>${esc(x.label)}</dt><dd>${esc(x.value)}</dd>`).join("")}</dl>` : ""}
${r.price_url ? `<p><a href="${esc(r.price_url)}" rel="sponsored nofollow noopener">Ver preço na Amazon</a></p>` : ""}
<p>${r.vine ? esc(DISCLOSURE_GIFT) + " " : ""}${esc(DISCLOSURE_AFFILIATE)}</p>
</div>`;
}

function homeStatic(reviews) {
  return `<div style="${S}">
<h1>${SITE_NAME}: reviews honestas de produtos testados em casa</h1>
<ul>${reviews.map((r) => `<li><a href="/reviews/${esc(r.slug)}">${esc(r.name)}</a>${r.summary ? `: ${esc(r.summary)}` : ""}</li>`).join("\n")}</ul>
</div>`;
}

function inject(template, head, rootHtml) {
  let html = template.replace(/<title>[\s\S]*?<\/title>/, "").replace(/<meta name="description"[^>]*>/, "");
  html = html.replace("</head>", `        ${head}\n    </head>`);
  return html.replace('<div id="root"></div>', `<div id="root">${rootHtml}</div>`);
}

(async () => {
  const template = fs.readFileSync(path.join(BUILD, "index.html"), "utf8");
  if (!API) { console.warn("[prerender] REACT_APP_BACKEND_URL não definido: a saltar."); return; }
  if (!SITE) console.warn("[prerender] SITE_URL não definido: canonical e imagens ficam sem domínio.");
  let reviews = [];
  try {
    const res = await fetch(`${API}/api/reviews`, { signal: AbortSignal.timeout(90000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    reviews = await res.json();
  } catch (e) {
    console.warn(`[prerender] Não consegui obter as reviews (${e.message}). Build segue sem páginas estáticas.`);
    return;
  }

  fs.mkdirSync(path.join(BUILD, "reviews"), { recursive: true });
  for (const r of reviews) {
    if (!r.slug) continue;
    const url = SITE ? `${SITE}/reviews/${r.slug}` : "";
    const head = headFor({
      title: `${r.name}: review | ${SITE_NAME}`,
      description: r.summary || `Review do ${r.name}: prós, contras e se vale o preço.`,
      url,
      image: r.photos?.[0] ? abs(r.photos[0].src) : "",
      extra: `<script type="application/ld+json">${jsonLd(r, url)}</script>`,
    });
    fs.writeFileSync(path.join(BUILD, "reviews", `${r.slug}.html`), inject(template, head, reviewStatic(r)));
  }

  const homeHead = headFor({
    title: `${SITE_NAME} | Reviews honestas de produtos testados em casa`,
    description: "Reviews honestas de produtos testados em casa. Nota, prós, contras e o melhor preço, com a origem de cada produto sempre indicada.",
    url: SITE ? `${SITE}/` : "",
    image: reviews[0]?.photos?.[0] ? abs(reviews[0].photos[0].src) : "",
    extra: SITE ? `<script type="application/ld+json">${JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE_NAME,
      alternateName: ["MygReviews", "Myg Reviews: reviews de produtos"],
      url: `${SITE}/`,
      inLanguage: "pt-PT",
    }).replace(/</g, "\\u003c")}</script>` : "",
  });
  fs.writeFileSync(path.join(BUILD, "index.html"), inject(template, homeHead, homeStatic(reviews)));
  // Fallback limpo para as rotas da SPA (/admin, etc.)
  fs.writeFileSync(path.join(BUILD, "spa.html"), template);

  if (SITE) {
    const urls = [`${SITE}/`, ...reviews.filter((r) => r.slug).map((r) => `${SITE}/reviews/${r.slug}`)];
    const lastmod = (r) => (r?.updated_at || "").slice(0, 10);
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u, i) => `  <url><loc>${u}</loc>${i && lastmod(reviews[i - 1]) ? `<lastmod>${lastmod(reviews[i - 1])}</lastmod>` : ""}</url>`).join("\n")}\n</urlset>\n`;
    fs.writeFileSync(path.join(BUILD, "sitemap.xml"), sitemap);
    fs.writeFileSync(path.join(BUILD, "robots.txt"), `User-agent: *\nDisallow: /admin\nSitemap: ${SITE}/sitemap.xml\n`);
  }
  console.log(`[prerender] ${reviews.length} review(s) pré-renderizada(s).`);
})();
