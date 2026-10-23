import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve("dist");
const routes = ["/", "/about", "/contact", "/404.html"];
const pages = new Map();
const fileFor = (path) =>
  path === "/"
    ? "index.html"
    : path.endsWith(".html")
      ? path.slice(1)
      : path.replace(/^\//, "").replace(/\/$/, "") + "/index.html";
const attribute = (tag, name) =>
  tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
for (const route of routes) {
  const html = await readFile(resolve(root, fileFor(route)), "utf8");
  pages.set(route, html);
  assert.equal(
    (html.match(/<h1\b/g) ?? []).length,
    1,
    `${route}: one main heading`,
  );
  assert.match(html, /<html lang="es-AR"/);
  assert.match(html, /<main id="main-content"/);
  assert.match(html, /rel="canonical" href="https:\/\/onbjorn.com/);
  assert.match(html, /name="description" content="[^"]+"/);
  assert.match(html, /property="og:image" content="https:\/\/onbjorn.com/);
  assert.doesNotMatch(
    html,
    /CoffinWeb|Nails Ailen|respondemos.{0,15}24|bootstrap\.css/iu,
  );
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, `${route}: unique element IDs`);
  for (const match of html.matchAll(/<img\b[^>]*>/g)) {
    assert.ok(
      attribute(match[0], "alt") !== undefined,
      `${route}: image has alt`,
    );
    assert.ok(
      attribute(match[0], "width") && attribute(match[0], "height"),
      `${route}: reserved image dimensions`,
    );
  }
  for (const match of html.matchAll(/<a\b[^>]*>/g)) {
    const href = attribute(match[0], "href");
    if (href?.includes("wa.me"))
      assert.match(href, /^https:\/\/wa.me\/5491168204445\?text=Hola/);
    if (attribute(match[0], "target") === "_blank")
      assert.match(attribute(match[0], "rel") ?? "", /noopener/);
  }
  for (const match of html.matchAll(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
  ))
    JSON.parse(match[1]);
}
for (const [route, html] of pages) {
  for (const match of html.matchAll(/<(?:a|img|script|link)\b[^>]*>/g)) {
    const tag = match[0];
    const href = attribute(tag, "src") ?? attribute(tag, "href");
    if (!href || /^(https?:|mailto:|tel:|data:)/.test(href)) continue;
    const url = new URL(href, "https://onbjorn.com" + route);
    const pageRoute = url.pathname.replace(/\/$/, "") || "/";
    if (pages.has(pageRoute)) {
      if (url.hash)
        assert.ok(
          pages.get(pageRoute).includes(`id="${url.hash.slice(1)}"`),
          `${route}: target exists for ${href}`,
        );
    } else await access(resolve(root, url.pathname.slice(1)));
  }
}
const home = pages.get("/");
assert.equal(
  (home.match(/data-project-gallery/g) ?? []).length,
  3,
  "Three project galleries",
);
assert.equal(
  (home.match(/data-gallery-view=/g) ?? []).length,
  9,
  "Desktop, detail and mobile views for every project",
);
assert.equal(
  (pages.get("/about").match(/data-project-gallery/g) ?? []).length,
  2,
  "Shared experience galleries on about",
);
for (const font of [
  "manrope-latin-variable.woff2",
  "space-grotesk-latin-variable.woff2",
]) {
  await access(resolve(root, "fonts", font));
  assert.ok(home.includes("/fonts/" + font), "Local typefaces are preloaded");
}
assert.equal((home.match(/class="service"/g) ?? []).length, 5);
const descriptions = [...home.matchAll(/<p class="service-description">([\s\S]*?)<\/p>/g)];
assert.equal(descriptions.length, 5, 'Every service has its explanatory paragraph');
for (const description of descriptions) assert.ok(description[1].trim().length > 40, 'Service explanations are present');
assert.match(home, /href="https:\/\/cuos.com.ar\/"/);
assert.equal(
  (home.match(/A TRAVÉS DE CUOS · DESARROLLADOR PRINCIPAL/g) ?? []).length,
  2,
);
assert.match(home, /gblingenieria.com.ar/);
const schemas = [
  ...home.matchAll(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
  ),
].map((match) => JSON.parse(match[1]));
const faq = schemas.find((schema) => schema["@type"] === "FAQPage");
assert.equal(faq.mainEntity.length, 6);
for (const question of faq.mainEntity) {
  assert.ok(home.includes(question.name), "FAQ question is visible content");
  assert.ok(
    home.includes(question.acceptedAnswer.text),
    "FAQ answer matches visible content",
  );
}
assert.match(
  pages.get("/404.html"),
  /name="robots" content="noindex, nofollow"/,
);
const sitemap = await readFile(resolve(root, "sitemap-0.xml"), "utf8");
for (const path of ["/", "/about/", "/contact/"])
  assert.ok(sitemap.includes("https://onbjorn.com" + path));
assert.doesNotMatch(sitemap, /404|\/inicio/);
assert.match(
  await readFile(resolve(root, "robots.txt"), "utf8"),
  /Sitemap: https:\/\/onbjorn.com\/sitemap-index.xml/,
);
assert.match(
  await readFile(resolve(root, "inicio/index.html"), "utf8"),
  /http-equiv="refresh"/,
);
console.log(
  "Validated four pages, local assets and anchors, WhatsApp, CUOS attribution, five services, six FAQ answers, metadata, sitemap and legacy redirect.",
);
