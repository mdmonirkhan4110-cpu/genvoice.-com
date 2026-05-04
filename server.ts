import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;
  
  // Force development mode with Vite middleware for now
  // This is more reliable for the AI Studio preview environment
  console.log("Starting server in DEVELOPMENT mode with Vite middleware...");
  
  const vite = await createViteServer({
    server: { 
      middlewareMode: true,
      host: '0.0.0.0',
      port: 3000
    },
    appType: "spa",
  });
  
  app.use(vite.middlewares);

  // API Health check
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      mode: "development",
      time: new Date().toISOString()
    });
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
