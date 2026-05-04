import markdownItAttrs from 'markdown-it-attrs';
import { createHighlighter } from 'shiki';

const SUPPORTED_LANGS = ['javascript', 'typescript', 'python', 'csharp', 'java', 'bash', 'text'];

const highlighter = await createHighlighter({
  themes: ['github-dark-default'],
  langs: SUPPORTED_LANGS
});

export default function (eleventyConfig) {
  eleventyConfig.amendLibrary('md', md => {
    md.use(markdownItAttrs);

    md.renderer.rules.fence = (tokens, idx) => {
      const token = tokens[idx];
      const lang = (token.info.trim().split(/\s+/)[0] || 'text').toLowerCase();
      const safeLang = SUPPORTED_LANGS.includes(lang) ? lang : 'text';
      const html = highlighter.codeToHtml(token.content, {
        lang: safeLang,
        theme: 'github-dark-default'
      });

      const attrs = Object.fromEntries(token.attrs ?? []);
      const cfgOptOut = attrs.cfg === 'false';
      const isPrimary = attrs['data-primary'] !== undefined;

      const dataAttrs = [];
      if (!cfgOptOut) dataAttrs.push('data-cfg-template="true"');
      if (isPrimary) dataAttrs.push('data-primary="true"');
      dataAttrs.push(`data-lang="${safeLang}"`);

      return html.replace('<pre ', `<pre ${dataAttrs.join(' ')} `);
    };
  });

  // ---- Shortcodes ----
  eleventyConfig.addPairedShortcode('pitfall', function (content, title) {
    if (!title) throw new Error(`pitfall shortcode requires a title at ${this.page.inputPath}`);
    return `<aside class="callout callout--pitfall"><strong>⚠ ${title}</strong>\n\n${content}</aside>`;
  });

  eleventyConfig.addPairedShortcode('caveat', function (content, title) {
    if (!title) throw new Error(`caveat shortcode requires a title at ${this.page.inputPath}`);
    return `<aside class="callout callout--caveat"><strong>${title}</strong>\n\n${content}</aside>`;
  });

  eleventyConfig.addShortcode('verified', function () {
    const ctx = this.ctx ?? {};
    const v = ctx.verifiedOn;
    const p = ctx.package;
    const ver = ctx.version;
    if (!v) return '';
    if (!p || !ver) {
      return `<span class="badge badge--verified" data-verified-on="${v}">✓ Last verified ${v}</span>`;
    }
    return `<span class="badge badge--verified" data-verified-on="${v}">✓ Verified on ${v} against ${p}@${ver}</span>`;
  });

  eleventyConfig.addShortcode('staleness', function () {
    const v = this.ctx?.verifiedOn;
    if (!v) return '';
    const ageDays = (Date.now() - Date.parse(v)) / 86400000;
    if (ageDays <= 365) return '';
    return `<aside class="callout callout--stale"><strong>May be stale.</strong> This recipe was last verified ${Math.floor(ageDays)} days ago.</aside>`;
  });

  // ---- Tab shortcodes ----
  eleventyConfig.addPairedShortcode('tabs', function (content, groupId) {
    return `<div class="tab-group" data-tab-group="${groupId || 'main'}">\n${content}\n</div>`;
  });

  eleventyConfig.addPairedShortcode('tab', function (content, lang, label) {
    return `<div class="tab-panel" data-lang="${lang}" data-label="${label}" role="tabpanel" hidden>\n${content}\n</div>`;
  });

  // ---- Global data ----
  eleventyConfig.addGlobalData('topicOrder', [
    { slug: 'quickstart',                label: 'Quickstart' },
    { slug: 'traces',                    label: 'Traces' },
    { slug: 'metrics',                   label: 'Metrics' },
    { slug: 'logs',                      label: 'Logs' },
    { slug: 'auto',                      label: 'Auto-instrumentation' },
    { slug: 'resource-attributes',       label: 'Resource Attributes' },
    { slug: 'sampling',                  label: 'Sampling' },
    { slug: 'semantic-conventions-http', label: 'Semantic Conventions (HTTP)' },
    { slug: 'batching',                  label: 'Batching' },
    { slug: 'troubleshooting',           label: 'Troubleshooting' },
  ]);

  // ---- Passthrough ----
  eleventyConfig.addPassthroughCopy('src/assets');
  eleventyConfig.addPassthroughCopy({ '../images': 'images' });
  eleventyConfig.addPassthroughCopy({ '../samples': 'samples' });

  return {
    dir: { input: 'src', output: '_site', includes: '_includes' },
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk'
  };
}
