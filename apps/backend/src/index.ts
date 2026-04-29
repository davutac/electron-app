import { Elysia } from "elysia";
import { CloudflareAdapter } from "elysia/adapter/cloudflare-worker";

const app = new Elysia({
  adapter: CloudflareAdapter,
})
  .get("/", () => ({
    message: "Hello from Elysia on Cloudflare Workers",
  }))
  .get("/health", () => ({
    status: "ok",
  }))
  .compile();

export type App = typeof app;

export default app;
