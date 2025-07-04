import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import { setupVite, serveStatic, log } from "./vite";
import { createServer } from "http";
import { networkInterfaces } from "os";
import apiRoutes from './express-routes';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = createServer(app);

  // Setup Vite dev server in development
  await setupVite(app, server);

  // Mount API routes after Vite setup
  app.use('/api', apiRoutes);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    console.error('Error:', err);
  });

  const port = Number(process.env.PORT) || 3000;
  const host = process.env.NODE_ENV === 'development' ? '0.0.0.0' : 'localhost';
  
  server.listen(port, host, () => {
    console.log(`Server running on ${host}:${port}`);
    console.log(`🚀 Frontend available at: http://localhost:${port}`);
    
    if (process.env.NODE_ENV === 'development') {
      // Get local IP for mobile testing
      const nets = networkInterfaces();
      
      for (const name of Object.keys(nets)) {
        for (const net of nets[name] || []) {
          if (net.family === 'IPv4' && !net.internal) {
            console.log(`📱 Mobile access: http://${net.address}:${port}`);
          }
        }
      }
    }
  });
})().catch(console.error);
