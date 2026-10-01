// Stand-in for the backend API during the e2e run (never used outside the tests).
// `next start` gets API_ORIGIN pointing here, so a request to /api/v1/* of the site goes through
// the real proxy (src/proxy.ts) and arrives with the signed headers. Most tests intercept the API
// in the browser (page.route) and never reach this server; the ones that do read back what
// arrived at /__last?email=… to check the whole chain: rewrite, signature, body and headers.
import { createHmac, timingSafeEqual } from "node:crypto";
import { createServer } from "node:http";

const PORT = Number(process.env.E2E_API_PORT ?? 3122);
const SECRET = process.env.PROXY_SHARED_SECRET ?? "";
/** Position answered to every sign-up. */
const POSITION = 7;
/** Below 25, so the pages show no "Ya somos N" unless a test intercepts the stats. */
const STATS = { consumers: 12, wineries: 3 };

/** Last sign-up received for each email. */
const last = new Map();

const envelope = (statusCode, path, data) => ({ success: true, statusCode, timestamp: new Date().toISOString(), path, data });
const failure = (statusCode, path, code, message) => ({
  success: false,
  statusCode,
  timestamp: new Date().toISOString(),
  path,
  error: { code, message, details: null },
});

function send(res, status, body) {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

/** Same check as the backend: hex HMAC-SHA256 of `METHOD|PATH_WITH_QUERY|IP|TIMESTAMP`, ±60 s. */
function signatureIsValid(req) {
  const ip = req.headers["x-doc-client-ip"];
  const timestamp = req.headers["x-doc-proxy-timestamp"];
  const signature = req.headers["x-doc-proxy-signature"];
  if (!SECRET || typeof ip !== "string" || typeof timestamp !== "string" || typeof signature !== "string") return false;
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 60) return false;
  const expected = createHmac("sha256", SECRET).update(`${req.method}|${req.url}|${ip}|${timestamp}`).digest("hex");
  return expected.length === signature.length && timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return null;
  }
}

createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", `http://127.0.0.1:${PORT}`);

  if (url.pathname === "/health") return send(res, 200, { ok: true });

  if (url.pathname === "/__last") return send(res, 200, last.get(url.searchParams.get("email") ?? "") ?? null);

  if (req.method === "GET" && url.pathname === "/v1/public/waitlist/stats") return send(res, 200, envelope(200, url.pathname, STATS));

  if (req.method === "POST" && url.pathname === "/v1/public/waitlist") {
    const body = await readJson(req);
    if (!body || typeof body.email !== "string") return send(res, 422, failure(422, url.pathname, "VALIDATION_ERROR", "Datos no válidos"));
    last.set(body.email, {
      body,
      signed: signatureIsValid(req),
      clientIp: req.headers["x-doc-client-ip"] ?? null,
      clientApp: req.headers["x-client-app"] ?? null,
      cookie: req.headers.cookie ?? null,
    });
    return send(res, 201, envelope(201, url.pathname, { type: body.type, position: POSITION }));
  }

  return send(res, 404, failure(404, url.pathname, "NOT_FOUND", "Recurso no encontrado"));
}).listen(PORT, "127.0.0.1", () => console.log(`stub API on http://127.0.0.1:${PORT}`));
