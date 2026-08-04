import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://www.velcorix.com",

  // 'file' keeps the existing URLs — /about.html rather than /about/. The site
  // is already indexed under .html and every canonical points there, so
  // changing it would invalidate what Google has.
  build: { format: "file" },
});
