# Estore Chatbot – Issue Report

Scope: `backend/routes/chatbot_V2.js` (active), `backend/routes/chatbot.js` (legacy, disabled), `frontend/src/Components/Chatbot/Chatbot.jsx`.

Architecture: product embeddings (`gemini-embedding-001`) stored in MongoDB → `$vectorSearch` (top 5) → `gemini-2.0-flash` with products injected into the system prompt → frontend renders JSON as product cards or falls back to sanitized text.

## High severity

### 1. Global shared chat history
- **Where:** `chatbot_V2.js:75` – `const history = [];` at module level.
- **Impact:** All users share one conversation (context leaks between users). It grows unbounded (rising token cost, eventual errors) and resets unpredictably on Vercel cold starts.
- **Fix:** Keep history per session (client sends it, or a session ID), and cap its length.

### 2. Unauthenticated, unthrottled expensive endpoints
- **Where:** `POST /api/prodEmbedding`, `POST /api/VectorSearch`.
- **Impact:** Anyone can trigger Gemini embedding calls over the whole catalog or burn the API quota.
- **Fix:** Protect `/prodEmbedding` with `protect` + admin check; add rate limiting and input validation to `/VectorSearch`.

### 3. API key read before dotenv loads
- **Where:** `chatbot_V2.js:9` – `new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })` at import time; `config()` runs later in `index.js` (ES imports are hoisted).
- **Impact:** Key is `undefined` locally; works on Vercel only because env vars are injected.
- **Fix:** `import 'dotenv/config'` first, or create the client lazily.

### 4. Broken error handling
- `/prodEmbedding` catch logs "Checkout Error" / returns "Failed to process order" (copy-paste from the order route).
- `candidates[0]?.content?.parts[0]?.text` may be `undefined` (e.g. safety block) and is pushed into history, corrupting later requests.
- Failed requests leave a dangling `user` turn in history (consecutive user turns).
- `query` is not validated as a non-empty string.

## Medium severity

### 5. Poor embedding input
- `JSON.stringify(item)` embeds `_id`, image URL, quantity and old `Embeddings`; the query is `JSON.stringify(query)` (extra quotes).
- **Fix:** Embed only `name + description + Brand + Category`; embed the raw query string.

### 6. Slow/sequential embedding generation
- One product per loop iteration, new embeddings client each iteration → risk of Vercel timeout on large catalogs.
- **Fix:** Create the client once, use `embedDocuments` in batches.

### 7. Fragile prompt / output contract
- Model switches between JSON and prose; frontend must guess the format.
- Model is trusted to copy `image` and `link` exactly (hardcoded domain in prompt).
- `$$` fences in the prompt may confuse the model.
- Follow-up questions only see the latest 5 vector results, not earlier products.
- `quantity` is dropped in `$project`, so out-of-stock items can be recommended.
- **Fix:** Use `responseMimeType: "application/json"` with a schema (e.g. `{type: "recommendation" | "answer", ...}`), build links/images server-side, filter by stock.

## Frontend (`Chatbot.jsx`)

- **Rules of Hooks violation:** `useState`/`useRef` are called after an early `return null` (line ~24–36). Move the route check below the hooks.
- **Route check bug:** `"/Product/edit/:id"` is compared as a literal string and never matches real URLs.
- **Typing animation:** one `setTimeout` + state update per character; timeouts never cleaned up; `setIsTyping(false)` fires immediately, so new messages can interleave with the running animation.
- **Enter key:** sends on Shift+Enter too although the field is multiline.
- **Hardcoded domain:** `estore-frontend-jade.vercel.app` in the prompt and CORS list.
- **UX:** product cards omit price.

## Other notes

- `chatbot.js` (MCP tool-calling) and the MCP server code in `index.js` are dead/commented-out code; consider removing.
- `bodyParser.json()` and `express.json()` are redundant.
- `mongoose.connect` at module load may race on serverless cold starts.
- Non-chatbot routes (auth, orders, products, dashboard) were not audited in depth.

## Suggested order

1. #1, #2, #4 (history, auth/rate limiting, error handling)
2. #3, #5
3. #7 (structured output simplifies the frontend)
4. #6 and frontend fixes
