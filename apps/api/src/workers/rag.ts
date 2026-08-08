// RAG context retrieval — optionally uses a knowledge base to enrich agent prompts.
// Falls back gracefully if no KB is configured (returns empty context string).
// Supports any compatible retrieval endpoint via KB_BASE_URL.
// Env vars: KB_UUID, KB_API_TOKEN, KB_BASE_URL

const KB_UUID = process.env.KB_UUID || ''
const KB_API_TOKEN = process.env.KB_API_TOKEN || ''
const KB_BASE_URL = process.env.KB_BASE_URL || ''
const KB_ENDPOINT = KB_UUID
    ? `${KB_BASE_URL}/v1/${KB_UUID}/retrieve`
    : ''

interface KBChunk {
    text_content: string
    metadata: {
        item_name: string
        ingested_timestamp: string
    }
}

interface KBResponse {
    results: KBChunk[]
}

export async function getRAGContext(
    _agencyId: string, // kept for API compatibility — KB is shared across agencies
    concept: string,
    topK = 3
): Promise<string> {
    // If no KB is configured, return empty context — agents still work fine without RAG
    if (!KB_ENDPOINT || !KB_API_TOKEN) {
        return 'No past similar projects found.'
    }

    try {
        console.log(`[RAG] → ${KB_ENDPOINT}`)
        const res = await fetch(KB_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${KB_API_TOKEN}`,
            },
            body: JSON.stringify({
                query: concept,
                num_results: topK,
                alpha: 0.6, // 0=lexical only, 1=semantic only, 0.6=slightly semantic-biased
            }),
        })

        if (!res.ok) {
            const errorBody = await res.text()
            console.error(`[RAG] ❌ ${res.status} response:`, errorBody)
            return 'No past similar projects found.'
        }

        console.log(`[RAG] ✅ ${res.status} OK`)

        const data: KBResponse = await res.json()

        if (!data.results?.length) {
            return 'No past similar projects found.'
        }

        return data.results
            .map((chunk, i) => `Past Project ${i + 1}:\n${chunk.text_content}`)
            .join('\n\n')
    } catch (err) {
        // Never crash an agent because RAG failed
        console.error('RAG context fetch error:', err)
        return 'No past similar projects found.'
    }
}
