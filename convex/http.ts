import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { createAuth } from "./auth";

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

// Check if origin is allowed
function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false;
  // Check exact matches
  if (allowedOrigins.includes(origin)) return true;
  // Allow any vercel.app subdomain
  if (origin.endsWith(".vercel.app")) return true;
  // Allow localhost on any port
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return true;
  return false;
}

// Add CORS headers to response
function addCorsHeaders(response: Response, origin: string | null): Response {
  const headers = new Headers(response.headers);
  if (origin && isOriginAllowed(origin)) {
    headers.set("Access-Control-Allow-Origin", origin);
  }
  headers.set("Access-Control-Allow-Credentials", "true");
  headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, Better-Auth-Cookie");
  headers.set("Access-Control-Expose-Headers", "Set-Better-Auth-Cookie");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

// Handle OPTIONS preflight requests
const handleOptions = httpAction(async (_, request) => {
  const origin = request.headers.get("Origin");
  return addCorsHeaders(new Response(null, { status: 204 }), origin);
});

// Handle auth requests with CORS
const handleAuth = httpAction(async (ctx, request) => {
  const origin = request.headers.get("Origin");
  const auth = createAuth(ctx);
  const response = await auth.handler(request);
  return addCorsHeaders(response, origin);
});

// Register OPTIONS handler for preflight
http.route({
  pathPrefix: "/api/auth/",
  method: "OPTIONS",
  handler: handleOptions,
});

// Register auth handlers
http.route({
  pathPrefix: "/api/auth/",
  method: "GET",
  handler: handleAuth,
});

http.route({
  pathPrefix: "/api/auth/",
  method: "POST",
  handler: handleAuth,
});

// Redirect root well-known to api well-known
http.route({
  path: "/.well-known/openid-configuration",
  method: "GET",
  handler: httpAction(async () => {
    const url = `${process.env.CONVEX_SITE_URL}/api/auth/convex/.well-known/openid-configuration`;
    return Response.redirect(url);
  }),
});

export default http;
