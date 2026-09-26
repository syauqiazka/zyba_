const next = require("next");
const http = require("http");

const port = parseInt(process.env.PORT, 10) || 3000;
const hostname = process.env.HOSTNAME || "0.0.0.0";

const app = next({
  dev: false,
  hostname,
  port,
});

const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    const server = http.createServer((req, res) => {
      handle(req, res);
    });

    server.listen(port, () => {
      console.log(`ZYBA Next.js running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start Next.js:", err);
    process.exit(1);
  });