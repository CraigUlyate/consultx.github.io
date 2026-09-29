import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';

// Validate the production export, not just the JSX that generates it.
const out = path.resolve('out');
function html(route) { return fs.readFileSync(path.join(out, route, 'index.html'), 'utf8'); }
for (const route of ['', 'about', 'contact', 'faqs', 'services', 'products', 'blog']) {
  const document = html(route);
  assert.match(document, /<head>[\s\S]*?<script id="consultx-gtm"/);
  // React can prepend its empty hidden suspense marker before application body content.
  assert.match(document, /<body[^>]*>(?:<div hidden="">(?:<!--[\s\S]*?-->)*<\/div>)?<noscript><iframe[^>]*title="Google Tag Manager"/);
  assert.equal((document.match(/<script id="consultx-gtm"/g) || []).length, 1);
  assert.match(document, /Infinity Business Park, Block B/);
  assert.match(document, /4 Pieter Wenning Rd, Fourways/);
  assert.match(document, /Sandton, Johannesburg, 2191/);
  assert.match(document, /href="\/faqs\/"/);
}
for (const route of ['portal', 'portal/services/onboard', 'advisor']) {
  assert.doesNotMatch(html(route), /<script id="consultx-gtm"|<iframe[^>]*googletagmanager/);
}
const faq = html('faqs');
assert.equal((faq.match(/<details\b/g) || []).length, 12);
assert.match(faq, /rel="canonical" href="https:\/\/consultx.co.za\/faqs\/"/);
assert.match(html('contact'), /href="https:\/\/goo.gl\/maps\/NL44vz4LHCGbMqb78"/);
const sitemap = fs.readFileSync(path.join(out, 'sitemap.xml'), 'utf8');
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
assert(urls.includes('https://consultx.co.za/faqs/'));
for (const url of urls) assert(fs.existsSync(path.join(out, new URL(url).pathname, 'index.html')), `Missing sitemap page: ${url}`);

// Exercise real event code with a controlled browser environment.
const source = fs.readFileSync('src/lib/marketing-analytics.ts', 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const sandbox = { exports: {}, window: { location: { pathname: '/contact/', origin: 'https://consultx.co.za', search: '?email=private@example.com', hash: '#private' } } };
vm.runInNewContext(compiled, sandbox);
sandbox.exports.trackMarketingEvent('consultx_enquiry_success');
assert.equal(sandbox.window.dataLayer.length, 1);
assert.equal(sandbox.window.dataLayer[0].page_location, 'https://consultx.co.za/contact/');
assert(!JSON.stringify(sandbox.window.dataLayer).includes('private'));
sandbox.exports.trackMarketingEvent('consultx_contact_click', 'phone');
assert.equal(sandbox.window.dataLayer[1].contact_method, 'phone');
for (const pathname of ['/portal/', '/portal/services/onboard/', '/advisor/']) {
  sandbox.window.location.pathname = pathname;
  sandbox.exports.trackMarketingEvent('consultx_page_view');
}
assert.equal(sandbox.window.dataLayer.length, 2);
const server = { exports: {} };
vm.runInNewContext(compiled, server);
assert.doesNotThrow(() => server.exports.trackMarketingEvent('consultx_page_view'));

// Run the actual submit handler with mocked HTTP outcomes; never send a real enquiry.
const formCode = ts.transpileModule(fs.readFileSync('src/components/contact/ContactForm.tsx', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
}).outputText;
for (const outcome of ['success', 'rejected', 'network-error']) {
  const events = [];
  let resets = 0;
  const jsx = (type, props) => ({ type, props });
  const formSandbox = {
    exports: {},
    require(name) {
      if (name === 'react') return { useState: value => [value, () => {}] };
      if (name === 'react/jsx-runtime') return { jsx, jsxs: jsx };
      if (name === '@/lib/marketing-analytics') return { trackMarketingEvent: event => events.push(event) };
      throw new Error(`Unexpected import: ${name}`);
    },
    FormData: class {},
    fetch: async () => {
      if (outcome === 'network-error') throw new Error('Simulated offline');
      return { ok: outcome === 'success', json: async () => ({ ok: outcome === 'success' }) };
    },
  };
  vm.runInNewContext(formCode, formSandbox);
  const form = formSandbox.exports.ContactForm();
  await form.props.onSubmit({ preventDefault() {}, currentTarget: { reset() { resets++; } } });
  assert.deepEqual(events, outcome === 'success' ? ['consultx_enquiry_success'] : []);
  assert.equal(resets, outcome === 'success' ? 1 : 0);
}
console.log(`SEO verification passed: GTM placement and exclusions, address, 12 FAQs, ${urls.length} sitemap destinations, analytics payload guards, and enquiry success/failure handling.`);
