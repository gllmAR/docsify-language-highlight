# docsify-language-highlight

A [Docsify 5](https://docsify.js.org) plugin that adds a **language label badge** to every code block — automatically, with no configuration needed.

---

## Quick start — single line import

Add one `<script>` tag **after** docsify core:

```html
<script src="https://gllmar.github.io/docsify-language-highlight/docsify-language-highlight.js"></script>
```

That's it. All fenced code blocks with a language annotation will display a label in the top-right corner.

---

## How it works

Docsify 5 sets a `data-lang` attribute on every rendered `<pre>` element. The plugin reads that attribute, maps it to a friendly display name (e.g. `js` → `JavaScript`), injects a `<span class="docsify-language-label">` into the block, and positions it with injected CSS. No external stylesheet is required.

---

## Options

Configure via `window.$docsify.languageHighlight` (all fields optional):

```js
window.$docsify = {
  languageHighlight: {
    position : 'top-right',  // 'top-right' (default) | 'top-left'
    transform: 'uppercase',  // applied to unrecognised languages: 'uppercase' (default) | 'lowercase' | 'capitalize' | 'none'
    displayName: null,       // function(lang) => string — full override of all labels
  },
};
```

### `displayName` example

```js
window.$docsify = {
  languageHighlight: {
    displayName: function (lang) {
      var map = { js: 'ES2024', ts: 'TS 5', py: 'Python 3' };
      return map[lang] || lang.toUpperCase();
    },
  },
};
```

---

## CSS customisation

The label uses CSS custom properties that inherit from your Docsify theme automatically. Override the badge style in your own `<style>` block:

```css
.docsify-language-label {
  font-size: 0.7em;
  color: #fff;
  background: rgba(108, 99, 255, 0.75);
  padding: 1px 10px 2px;
  border-bottom-left-radius: 6px;
}
```

---

## Code block examples

```html
<p>Markup block — label shows <strong>HTML</strong></p>
```

```css
/* CSS block — label shows CSS */
body { margin: 0; }
```

```js
// JavaScript block — label shows JavaScript
const greet = name => `Hello, ${name}!`;
```

```python
# Python block — label shows Python
def greet(name):
    return f"Hello, {name}!"
```

```bash
# Bash block — label shows Bash
echo "Hello, world!"
```

```typescript
// TypeScript block — label shows TypeScript
const greet = (name: string): string => `Hello, ${name}!`;
```

```yaml
# YAML block — label shows YAML
name: docsify-language-highlight
version: 1.0.0
```

```rust
// Rust block — label shows Rust
fn main() {
    println!("Hello, world!");
}
```

```dockerfile
# Dockerfile block — label shows Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install
CMD ["node", "server.js"]
```

---

## Full page example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>My Docs</title>

  <!-- Docsify 5 theme -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/docsify@^5.0.0-rc/dist/themes/core.min.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/docsify@^5.0.0-rc/dist/themes/addons/core-dark.min.css"
        media="(prefers-color-scheme: dark)">

  <!-- Optional: Prism themes for richer syntax colour (after docsify theme) -->
  <link rel="stylesheet" media="(prefers-color-scheme: dark)"
        href="//cdn.jsdelivr.net/npm/prism-themes@1/themes/prism-one-dark.min.css">
  <link rel="stylesheet" media="(prefers-color-scheme: light)"
        href="//cdn.jsdelivr.net/npm/prism-themes@1/themes/prism-one-light.min.css">
</head>
<body>
  <div id="app"></div>

  <script>
    window.$docsify = {
      name: 'My Docs',
      // languageHighlight options are optional
    };
  </script>

  <!-- Docsify 5 core -->
  <script src="https://cdn.jsdelivr.net/npm/docsify@^5.0.0-rc/dist/docsify.min.js"></script>

  <!-- Optional: extra Prism grammars (after docsify) -->
  <script src="//cdn.jsdelivr.net/npm/prismjs@1/components/prism-bash.min.js"></script>
  <script src="//cdn.jsdelivr.net/npm/prismjs@1/components/prism-python.min.js"></script>
  <script src="//cdn.jsdelivr.net/npm/prismjs@1/components/prism-typescript.min.js"></script>

  <!-- docsify-language-highlight — single line import -->
  <script src="https://gllmar.github.io/docsify-language-highlight/docsify-language-highlight.js"></script>
</body>
</html>
```

---

## Supported languages (friendly names)

| Input | Label |
|---|---|
| `js` / `javascript` | JavaScript |
| `ts` / `typescript` | TypeScript |
| `jsx` | JSX |
| `tsx` | TSX |
| `py` / `python` | Python |
| `rs` / `rust` | Rust |
| `go` | Go |
| `java` | Java |
| `cs` / `csharp` | C# |
| `cpp` / `c++` | C++ |
| `php` | PHP |
| `rb` / `ruby` | Ruby |
| `swift` | Swift |
| `kt` / `kotlin` | Kotlin |
| `sh` | Shell |
| `bash` | Bash |
| `html` | HTML |
| `css` | CSS |
| `scss` | SCSS |
| `json` | JSON |
| `yaml` / `yml` | YAML |
| `sql` | SQL |
| `md` / `markdown` | Markdown |
| `dockerfile` / `docker` | Dockerfile |
| `graphql` / `gql` | GraphQL |
| *anything else* | uppercased as-is |

---

## License

MIT

