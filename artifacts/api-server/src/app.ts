import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import path from "path";
import fs from "fs";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

// In production, serve the built frontend static files
if (process.env.NODE_ENV === "production") {
  // The frontend is built to artifacts/tiem-chu-du/dist/public
  // Relative to the api-server's working directory (workspace root when using Railway)
  const candidates = [
    path.resolve(process.cwd(), "artifacts/tiem-chu-du/dist/public"),
    path.resolve(import.meta.dirname, "../../tiem-chu-du/dist/public"),
  ];

  const staticDir = candidates.find((p) => fs.existsSync(p));

  if (staticDir) {
    logger.info({ staticDir }, "Serving frontend static files");
    app.use(express.static(staticDir));
    // SPA fallback — any non-API route serves index.html
    app.get("*", (_req, res) => {
      res.sendFile(path.join(staticDir, "index.html"));
    });
  } else {
    logger.warn("Frontend static files not found — skipping static serving");
  }
}

export default app;
