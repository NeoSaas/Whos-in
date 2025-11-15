import { createRequestListener } from "@react-router/node";

// Vercel supports top-level await in API routes
export default createRequestListener({
  build: await import("../build/server/index.js"),
  mode: process.env.NODE_ENV,
});