import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import fs from "node:fs";
import path from "node:path";

// Vite 插件：让 dev server 支持 public/ 下目录的 index.html
function servePublicIndexHtml() {
  return {
    name: "serve-public-index-html",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.endsWith("/") && req.url !== "/") {
          const filePath = path.join(process.cwd(), "public", req.url, "index.html");
          if (fs.existsSync(filePath)) {
            res.setHeader("Content-Type", "text/html");
            fs.createReadStream(filePath).pipe(res);
            return;
          }
        }
        next();
      });
    },
  };
}

export default defineConfig({
  integrations: [react(), tailwind()],
  output: "static",
  trailingSlash: "always",
  vite: {
    plugins: [servePublicIndexHtml()],
  },
});
