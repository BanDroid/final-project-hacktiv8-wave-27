import vike from "@vikejs/hono";
import { Hono } from "hono";
import { api } from "./api";

function getApp() {
  const app = new Hono();
  app.route("/api", api);

  vike(app, []);

  return app;
}

export const app = getApp();
