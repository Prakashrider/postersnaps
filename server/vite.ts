import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  console.log("✅ setupVite() is running...");

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: {
      middlewareMode: true,
      hmr: { server },
    },
    appType: "custom",
    customLogger: {
      ...viteLogger,
      info: (msg) => {
        if (msg.includes('ready')) {
          console.log(`✅ Vite dev server ready`);
        }
        viteLogger.info(msg);
      },
      error: (msg, options) => {
        console.error('❌ Vite error:', msg);
        viteLogger.error(msg, options);
      },
    },
  });

  console.log("✅ Vite server created, adding middleware...");
  app.use(vite.middlewares);
  
  app.use("*", async (req, res, next) => {
    // Skip API routes
    if (req.originalUrl.startsWith('/api')) {
      return next();
    }

    const url = req.originalUrl;
    console.log(`🔍 Serving page for URL: ${url}`);

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html",
      );

      console.log(`📄 Reading template from: ${clientTemplate}`);
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      console.log(`🔄 Transforming HTML for URL: ${url}`);
      const page = await vite.transformIndexHtml(url, template);
      console.log(`✅ Serving transformed page`);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      console.error('❌ Error serving page:', e);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(import.meta.dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
