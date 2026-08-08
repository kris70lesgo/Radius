const BASE_URL = process.env.AI_BASE_URL ?? "https://agentrouter.org/v1";
const CHAT_MODEL = process.env.AI_MODEL ?? "gpt-5.6-sol";
const MAX_RETRIES = 3;

interface GradientChatOptions {
  systemPrompt: string;
  userPrompt: string;
  maxTokens?: number;
  temperature?: number;
}

function getApiKey(): string {
  const key = process.env.AI_API_KEY;
  if (!key) throw new Error("AI_API_KEY is not set");
  return key;
}

function stripMarkdownFences(content: string): string {
  return content
    .replace(/^```(?:json|javascript|js|ts|typescript)?\n?/i, "")
    .replace(/\n?```$/, "")
    .trim();
}

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = MAX_RETRIES,
): Promise<Response> {
  console.log(`[AI] → ${url}`);
  for (let attempt = 1; attempt <= retries; attempt++) {
    const res = await fetch(url, options);

    if (res.ok) {
      console.log(`[AI] ✅ ${res.status} OK`);
      return res;
    }

    const body = await res.text();
    console.error(`[AI] ❌ ${res.status} response:`, body);

    if ((res.status === 429 || res.status >= 500) && attempt < retries) {
      const delay = Math.pow(2, attempt) * 500;
      console.warn(
        `[AI] Retrying in ${delay}ms (attempt ${attempt}/${retries})...`,
      );
      await new Promise((r) => setTimeout(r, delay));
      continue;
    }

    throw new Error(`AI API error ${res.status}: ${body}`);
  }

  throw new Error("AI API: max retries exceeded");
}

async function chat(options: GradientChatOptions): Promise<string> {
  const {
    systemPrompt,
    userPrompt,
    maxTokens = 2000,
    temperature = 0.7,
  } = options;

  const apiKey = getApiKey();
  console.log(`[AI] Chat request → model: ${CHAT_MODEL}`);
  const res = await fetchWithRetry(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: CHAT_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: maxTokens,
      temperature,
      stream: false,
    }),
  });

  const data = await res.json();
  const content: string = data.choices?.[0]?.message?.content ?? "";
  return stripMarkdownFences(content);
}

function parseJSON<T>(rawContent: string): T {
  const cleaned = stripMarkdownFences(rawContent);
  try {
    return JSON.parse(cleaned) as T;
  } catch (err) {
    console.error("[AI] Failed to parse JSON. Raw content:", rawContent);
    throw new Error(
      `Failed to parse AI response as JSON: ${(err as Error).message}`,
    );
  }
}

export const gradientClient = { chat, parseJSON };
