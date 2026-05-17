#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const baseUrl = (process.env.SEO_BASE_URL || 'https://edercreawebs.com').replace(/\/+$/, '');
const expectedCanonical = `${baseUrl}/`;
const expectedHreflangs = ['es-MX', 'es', 'x-default'];

const checks = [];

function pushCheck(ok, name, details = '') {
  checks.push({ ok, name, details });
}

function printSummary() {
  for (const c of checks) {
    const icon = c.ok ? 'OK' : 'FAIL';
    const suffix = c.details ? ` - ${c.details}` : '';
    console.log(`${icon}: ${c.name}${suffix}`);
  }

  const failed = checks.filter((c) => !c.ok).length;
  const passed = checks.length - failed;
  console.log(`\nResumen SEO check: ${passed} OK, ${failed} FAIL`);

  if (failed > 0) process.exit(1);
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'seo-check/1.0 (+https://edercreawebs.com)'
    }
  });
  const text = await response.text();
  return { response, text };
}

function extractCanonical(html) {
  const m = html.match(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i);
  return m ? m[1].trim() : '';
}

function extractRobotsMeta(html) {
  const m = html.match(/<meta[^>]+name=["']robots["'][^>]*content=["']([^"']+)["'][^>]*>/i);
  return m ? m[1].trim() : '';
}

function extractHreflangs(html) {
  const map = new Map();
  const re = /<link[^>]+rel=["']alternate["'][^>]*hreflang=["']([^"']+)["'][^>]*href=["']([^"']+)["'][^>]*>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    map.set(m[1].trim(), m[2].trim());
  }
  return map;
}

function extractLocs(xml) {
  const locs = [];
  const re = /<loc>\s*([^<]+)\s*<\/loc>/gi;
  let m;
  while ((m = re.exec(xml)) !== null) {
    locs.push(m[1].trim());
  }
  return locs;
}

async function run() {
  const localRobotsPath = path.join(process.cwd(), 'public_html', 'robots.txt');
  const localSitemapPath = path.join(process.cwd(), 'public_html', 'sitemap.xml');

  pushCheck(fs.existsSync(localRobotsPath), 'Archivo local robots.txt existe', localRobotsPath);
  pushCheck(fs.existsSync(localSitemapPath), 'Archivo local sitemap.xml existe', localSitemapPath);

  const robotsUrl = `${baseUrl}/robots.txt`;
  const sitemapUrl = `${baseUrl}/sitemap.xml`;

  let robotsText = '';
  try {
    const { response, text } = await fetchText(robotsUrl);
    robotsText = text;
    pushCheck(response.ok, 'robots.txt responde HTTP 200', `${response.status} ${robotsUrl}`);
    pushCheck(/Sitemap:\s*https?:\/\//i.test(text), 'robots.txt declara Sitemap');
    pushCheck(text.includes(sitemapUrl), 'robots.txt apunta al sitemap canónico', sitemapUrl);
  } catch (error) {
    pushCheck(false, 'robots.txt accesible públicamente', String(error));
  }

  let sitemapXml = '';
  try {
    const { response, text } = await fetchText(sitemapUrl);
    sitemapXml = text;
    pushCheck(response.ok, 'sitemap.xml responde HTTP 200', `${response.status} ${sitemapUrl}`);
    pushCheck(/<urlset[\s>]/i.test(text), 'sitemap.xml tiene estructura <urlset>');
  } catch (error) {
    pushCheck(false, 'sitemap.xml accesible públicamente', String(error));
  }

  if (sitemapXml) {
    const locs = extractLocs(sitemapXml);
    pushCheck(locs.length > 0, 'sitemap.xml contiene URLs', `${locs.length} urls`);
    pushCheck(locs.includes(expectedCanonical), 'sitemap.xml incluye URL home canónica', expectedCanonical);
  }

  try {
    const { response, text } = await fetchText(expectedCanonical);
    pushCheck(response.ok, 'Home pública responde HTTP 200', `${response.status} ${expectedCanonical}`);

    const canonical = extractCanonical(text);
    pushCheck(Boolean(canonical), 'Home incluye <link rel="canonical">');
    pushCheck(canonical === expectedCanonical, 'Canonical home coincide con URL esperada', canonical || 'vacío');

    const robotsMeta = extractRobotsMeta(text);
    pushCheck(Boolean(robotsMeta), 'Home incluye meta robots');
    pushCheck(/index/i.test(robotsMeta) && /follow/i.test(robotsMeta), 'Meta robots home permite index,follow', robotsMeta || 'vacío');

    const hreflangs = extractHreflangs(text);
    for (const lang of expectedHreflangs) {
      pushCheck(hreflangs.has(lang), `Home incluye hreflang ${lang}`);
      if (hreflangs.has(lang)) {
        pushCheck(hreflangs.get(lang) === expectedCanonical, `hreflang ${lang} apunta al canonical`, hreflangs.get(lang));
      }
    }
  } catch (error) {
    pushCheck(false, 'Home pública accesible', String(error));
  }

  if (robotsText && sitemapXml) {
    pushCheck(sitemapXml.includes('<loc>'), 'sitemap.xml tiene entradas <loc> válidas');
  }

  printSummary();
}

run().catch((error) => {
  console.error('FAIL: Error inesperado en seo:check', error);
  process.exit(1);
});
