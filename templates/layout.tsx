import { html } from "hono/html";

interface SiteData {
  title: string;
  children?: any;
}

export const Layout = (props: SiteData) => html`<!DOCTYPE html>
  <html>
    <head>
      <title>${props.title}</title>
      <script src="https://unpkg.com/htmx.org@1.9.5"></script>
      <script src="https://unpkg.com/htmx.org/dist/ext/ws.js"></script>
      <link
        rel="stylesheet"
        media="(prefers-color-scheme:light)"
        href="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.8.0/cdn/themes/light.css"
      />
      <link
        rel="stylesheet"
        media="(prefers-color-scheme:dark)"
        href="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.8.0/cdn/themes/dark.css"
        onload ="document.documentElement.classList.add('sl-theme-dark');"
      />
      <link rel="stylesheet" href="/public/main.css" />
      <script type="module" src="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.8.0/cdn/shoelace-autoloader.js"></script>
      </head>
    <body>
      ${props.children}
    </body>
  </html>
`;