const next = require("next");

const app = next({
  dev: false,
  hostname: "127.0.0.1",
  port: 3000,
});

const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    const http = require("http");

    const server = http.createServer((req, res) => {
      handle(req, res);
    });

    server.listen(3000, "127.0.0.1", () => {
      console.log(
        "ZYBA Next.js running on http://127.0.0.1:3000"
      );
    });
  })
  .catch((err) => {
    console.error("Failed to start Next.js:", err);
    process.exit(1);
  });