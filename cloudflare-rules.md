# Cloudflare WAF & Caching Rules for Warspend

To protect the platform from DDoS attacks and ensure high performance, configure the following rules in your Cloudflare dashboard:

## 1. WAF Custom Rules (Security)
Create custom rules under **Security > WAF > Custom rules**:

**Rule 1: Block Malicious Bots & Known Threats**
- **Expression:** `(cf.client.bot) or (cf.threat_score > 10)`
- **Action:** `Managed Challenge` (or `Block` for higher strictness)

**Rule 2: Restrict Direct API Access (Optional but recommended)**
If you want to prevent direct access to your API (e.g., `api.warspend.com`) except from your frontend server or specific origins:
- **Expression:** `(http.host eq "api.warspend.com" and not http.referer contains "warspend.com")`
- **Action:** `Block`

## 2. Rate Limiting Rules
Under **Security > WAF > Rate limiting rules**:

**Rule 1: Protect Force Update Endpoint**
- **URL Path:** `/api/force-update`
- **Rate:** 5 requests per 1 hour
- **Action:** `Block` for 1 hour

## 3. Caching Rules (Performance)
Under **Caching > Cache Rules**:

**Rule 1: Cache Static Next.js Assets**
- **Expression:** `(http.request.uri.path starts_with "/_next/static/")`
- **Edge TTL:** `Browser Cache TTL (1 year)`
- **Browser TTL:** `1 year`

**Rule 2: Bypass Cache for API (WebSockets & Live Data)**
- **Expression:** `(http.request.uri.path starts_with "/api/") or (http.request.uri.path starts_with "/socket.io/")`
- **Cache Status:** `Bypass cache`

## 4. Network & DDoS Settings
- **Security Level:** Set to `Medium` or `High`.
- **Browser Integrity Check:** `ON`.
- **Bot Fight Mode:** `ON` (Under Security > Bots).
