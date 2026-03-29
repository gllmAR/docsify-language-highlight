/**
 * docsify-language-highlight
 * Adds a language label badge to code blocks in Docsify 5.
 * Auto-injects Prism themes (light/dark) and a comprehensive set of Prism
 * language grammars — no additional <link> or <script> tags needed.
 *
 * Usage (single line, after docsify.min.js):
 *   <script src="https://gllmar.github.io/docsify-language-highlight/docsify-language-highlight.js"></script>
 *
 * Options (window.$docsify.languageHighlight):
 *   position        : 'top-right' | 'top-left'          (default: 'top-right')
 *   transform       : 'uppercase' | 'lowercase' | 'capitalize' | 'none'
 *                                                        (default: 'uppercase', only for unknown langs)
 *   displayName     : function(lang) => string           (full label override)
 *   prismThemes     : true | false                       (default: true)
 *   prismThemeDark  : URL string                         (default: prism-one-dark)
 *   prismThemeLight : URL string                         (default: prism-one-light)
 *   prismLanguages  : true | false | string[]            (default: true = built-in list)
 *   extraLanguages  : string[]                           (appended to the default list)
 */
(function () {
  'use strict';

  var PRISM_CDN    = '//cdn.jsdelivr.net/npm/prismjs@1/components/prism-';
  var THEMES_CDN   = '//cdn.jsdelivr.net/npm/prism-themes@1/themes/';

  /* ─── Default Prism language list ────────────────────────────────── */
  /* Prism built-ins (markup/html, css, clike, javascript) are excluded. */
  var DEFAULT_LANGUAGES = [
    // Shell / CLI
    'bash', 'shell-session', 'powershell', 'batch', 'fish',
    // Web / Frontend
    'typescript', 'jsx', 'tsx', 'vue', 'svelte',
    'scss', 'sass', 'less', 'css-extras',
    'json', 'json5', 'graphql',
    'yaml', 'toml', 'ini',
    // Systems
    'c', 'cpp', 'rust', 'go', 'wasm',
    'asm6502', 'nasm',
    // JVM
    'java', 'kotlin', 'scala', 'groovy',
    // Scripting
    'python', 'ruby', 'php', 'perl', 'lua', 'r',
    // Mobile / Desktop
    'swift', 'dart', 'objectivec',
    // Functional
    'haskell', 'elixir', 'erlang', 'clojure', 'ocaml', 'fsharp', 'scheme',
    // .NET
    'csharp', 'vbnet',
    // Data / Query
    'sql', 'sparql', 'cypher', 'promql',
    // Config / Infra
    'docker', 'nginx', 'apacheconf', 'hcl', 'nix',
    'makefile', 'cmake', 'editorconfig',
    // Markup / Docs
    'markdown', 'latex', 'asciidoc',
    // Source control / diff
    'git', 'diff',
    // Misc
    'regex', 'vim', 'http', 'uri',
    'coffeescript', 'matlab', 'julia', 'gdscript',
    'protobuf', 'terraform',
  ];

  /* ─── Friendly display names ─────────────────────────────────────── */
  var LANGUAGE_NAMES = {
    js: 'JavaScript', javascript: 'JavaScript',
    ts: 'TypeScript', typescript: 'TypeScript',
    jsx: 'JSX', tsx: 'TSX',
    vue: 'Vue', svelte: 'Svelte',
    py: 'Python', python: 'Python',
    rb: 'Ruby', ruby: 'Ruby',
    rs: 'Rust', rust: 'Rust',
    go: 'Go',
    java: 'Java',
    kt: 'Kotlin', kotlin: 'Kotlin',
    swift: 'Swift',
    c: 'C',
    cpp: 'C++', 'c++': 'C++',
    cs: 'C#', csharp: 'C#',
    php: 'PHP',
    html: 'HTML', xml: 'XML', svg: 'SVG',
    css: 'CSS', scss: 'SCSS', sass: 'Sass', less: 'Less',
    json: 'JSON', json5: 'JSON5',
    yaml: 'YAML', yml: 'YAML',
    toml: 'TOML', ini: 'INI',
    md: 'Markdown', markdown: 'Markdown',
    sql: 'SQL',
    sh: 'Shell', bash: 'Bash', zsh: 'ZSH', fish: 'Fish',
    'shell-session': 'Shell',
    powershell: 'PowerShell', ps1: 'PowerShell',
    dockerfile: 'Dockerfile', docker: 'Docker',
    nginx: 'Nginx', apacheconf: 'Apache', apache: 'Apache',
    git: 'Git', diff: 'Diff',
    graphql: 'GraphQL', gql: 'GraphQL',
    regex: 'RegExp', regexp: 'RegExp',
    wasm: 'WASM', wat: 'WAT',
    hcl: 'HCL', terraform: 'Terraform',
    nix: 'Nix',
    lua: 'Lua', r: 'R', julia: 'Julia', matlab: 'MATLAB',
    dart: 'Dart', scala: 'Scala', groovy: 'Groovy',
    elixir: 'Elixir', erlang: 'Erlang', haskell: 'Haskell',
    clojure: 'Clojure', ocaml: 'OCaml', fsharp: 'F#', scheme: 'Scheme',
    vbnet: 'VB.NET', coffeescript: 'CoffeeScript',
    latex: 'LaTeX', protobuf: 'Protobuf',
    objectivec: 'Obj-C', gdscript: 'GDScript',
    vim: 'Vim', http: 'HTTP', uri: 'URI',
    makefile: 'Makefile', cmake: 'CMake',
    sparql: 'SPARQL', cypher: 'Cypher', promql: 'PromQL',
    'css-extras': 'CSS', asciidoc: 'AsciiDoc',
    'jsx': 'JSX', 'tsx': 'TSX',
  };

  /* ─── Inject Prism themes (CSS) ──────────────────────────────────── */
  function injectPrismThemes(opts) {
    if (opts.prismThemes === false) return;
    if (document.getElementById('dlh-prism-dark')) return;

    var dark = document.createElement('link');
    dark.id   = 'dlh-prism-dark';
    dark.rel  = 'stylesheet';
    dark.media = '(prefers-color-scheme: dark)';
    dark.href  = opts.prismThemeDark  || (THEMES_CDN + 'prism-one-dark.min.css');
    document.head.appendChild(dark);

    var light = document.createElement('link');
    light.id   = 'dlh-prism-light';
    light.rel  = 'stylesheet';
    light.media = '(prefers-color-scheme: light)';
    light.href  = opts.prismThemeLight || (THEMES_CDN + 'prism-one-light.min.css');
    document.head.appendChild(light);
  }

  /* ─── Inject Prism language grammars (JS) ────────────────────────── */
  function injectPrismLanguages(opts) {
    if (opts.prismLanguages === false) return;

    var langs = Array.isArray(opts.prismLanguages)
      ? opts.prismLanguages
      : DEFAULT_LANGUAGES.slice();

    if (Array.isArray(opts.extraLanguages)) {
      langs = langs.concat(opts.extraLanguages);
    }

    langs.forEach(function (lang) {
      var id = 'dlh-prism-lang-' + lang;
      if (document.getElementById(id)) return;
      var s  = document.createElement('script');
      s.id   = id;
      s.src  = PRISM_CDN + lang + '.min.js';
      document.body.appendChild(s);
    });
  }

  /* ─── Badge CSS ──────────────────────────────────────────────────── */
  function injectBadgeStyles() {
    if (document.getElementById('dlh-styles')) return;
    var style = document.createElement('style');
    style.id = 'dlh-styles';
    style.textContent = [
      '.markdown-section pre { position: relative; }',
      '.docsify-language-label {',
      '  position: absolute; top: 0; right: 0;',
      '  padding: 1px 10px 2px;',
      '  font-size: 0.72em;',
      '  font-family: var(--font-family-mono, monospace);',
      '  color: var(--mono-tint2, #999);',
      '  background: transparent;',
      '  border-bottom-left-radius: var(--border-radius, 4px);',
      '  border-top-right-radius:   var(--border-radius, 4px);',
      '  letter-spacing: 0.06em;',
      '  user-select: none; pointer-events: none; line-height: 2; z-index: 1;',
      '}',
      '.docsify-language-label[data-position="top-left"] {',
      '  right: unset; left: 0;',
      '  border-bottom-left-radius:  0;',
      '  border-top-right-radius:    0;',
      '  border-bottom-right-radius: var(--border-radius, 4px);',
      '  border-top-left-radius:     var(--border-radius, 4px);',
      '}',
    ].join('\n');
    document.head.appendChild(style);
  }

  /* ─── Resolve display text ───────────────────────────────────────── */
  function resolveLabel(lang, opts) {
    if (typeof opts.displayName === 'function') return opts.displayName(lang);
    var friendly = LANGUAGE_NAMES[lang.toLowerCase()];
    var text     = friendly || lang;
    if (!friendly) {
      var t = opts.transform || 'uppercase';
      if (t === 'uppercase')  return text.toUpperCase();
      if (t === 'lowercase')  return text.toLowerCase();
      if (t === 'capitalize') return text.charAt(0).toUpperCase() + text.slice(1);
    }
    return text;
  }

  /* ─── Plugin install ─────────────────────────────────────────────── */
  function install(hook) {
    /* Resolve options once at install time (config is already set). */
    var opts = Object.assign(
      { position: 'top-right', transform: 'uppercase' },
      (window.$docsify && window.$docsify.languageHighlight) || {}
    );

    /* Inject everything immediately at install time. */
    injectBadgeStyles();
    injectPrismThemes(opts);
    injectPrismLanguages(opts);

    hook.doneEach(function () {
      /*
       * Use :not([data-dlh]) so the selector itself is the deduplication guard.
       * This is more reliable than querying for a child element because Prism
       * can re-render the <code> contents (wiping children) while leaving the
       * <pre> element in place, which would fool a child-based guard.
       */
      document.querySelectorAll('.markdown-section pre:not([data-dlh])').forEach(function (pre) {
        var lang = pre.getAttribute('data-lang');
        if (!lang) {
          var code = pre.querySelector('code');
          if (code) {
            var m = (code.className || '').match(/language-(\S+)/);
            lang = m ? m[1] : null;
          }
        }

        /* Mark processed regardless, so we never visit this <pre> again. */
        pre.setAttribute('data-dlh', lang || 'none');

        if (!lang || lang === 'text' || lang === 'plain') return;

        var label = document.createElement('span');
        label.className = 'docsify-language-label';
        label.setAttribute('data-lang', lang);
        label.setAttribute('data-position', opts.position);
        label.textContent = resolveLabel(lang, opts);
        pre.appendChild(label);
      });
    });
  }

  /* ─── Self-register ──────────────────────────────────────────────── */
  window.$docsify = window.$docsify || {};
  window.$docsify.plugins = [install].concat(window.$docsify.plugins || []);
})();
