import { httpRouter } from "convex/server";
import { authClient, createAuth } from "./auth";

const http = httpRouter();

// Frontend URL for CORS - defaults to localhost for dev
const siteUrl = process.env.SITE_URL ?? "http://localhost:5173";

// Build allowed origins for CORS
const allowedOrigins = [
  siteUrl,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
];

// Register Better Auth routes with CORS enabled
authClient.registerRoutes(http, createAuth, {
  cors: {
    allowedOrigins,
  },
});

export default http;
