const path = require("path");
const dir = path.resolve(__dirname);

// Pastikan proses selalu berjalan dalam direktori project
process.chdir(dir);

// Muat environment variables (.env / .env.production) sebelum apapun dijalankan
try {
  const { loadEnvConfig } = require("@next/env");
  loadEnvConfig(dir);
} catch (e) {
  console.warn("[server.js] loadEnvConfig failed:", e.message);
}

const next = require("next");
const http = require("http");
const { parse } = require("url");

const port = parseInt(process.env.PORT, 10) || 3000;
const hostname = process.env.HOSTNAME || "0.0.0.0";

const app = next({
  dev: false,
  dir,
  hostname,
  port,
});

const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    const server = http.createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error("[Next.js Server Error]:", req.url, err);
        if (!res.headersSent) {
          res.statusCode = 500;
          res.end("Internal Server Error");
        }
      }
    });

    server.listen(port, () => {
      console.log(`ZYBA Next.js running on http://${hostname}:${port} in ${dir}`);
    });

    // ─── Graceful Shutdown ──────────────────────────────────────────────────
    // Docker/systemd kirim SIGTERM saat container stop — kita tutup server
    // dan pool DB dengan bersih supaya tidak ada koneksi bocor.
    async function gracefulShutdown(signal) {
      console.log(`[server.js] Received ${signal}, shutting down gracefully...`);

      server.close(async () => {
        console.log("[server.js] HTTP server closed.");

        try {
          // Disconnect semua Prisma clients
          const { accountDb } = require("./src/backend/db/accountClient");
          const { companionDb } = require("./src/backend/db/companionClient");
          const { communityDb } = require("./src/backend/db/communityClient");
          await Promise.allSettled([
            accountDb.$disconnect(),
            companionDb.$disconnect(),
            communityDb.$disconnect(),
          ]);
          console.log("[server.js] Database connections closed.");
        } catch (e) {
          console.warn("[server.js] DB disconnect error:", e.message);
        }

        process.exit(0);
      });

      // Force-kill jika tidak selesai dalam 15 detik
      setTimeout(() => {
        console.error("[server.js] Graceful shutdown timeout, forcing exit.");
        process.exit(1);
      }, 15000).unref();
    }

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT",  () => gracefulShutdown("SIGINT"));
  })
  .catch((err) => {
    console.error("Failed to start Next.js:", err);
    process.exit(1);
  });