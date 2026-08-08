/**
 * Isolated test for the configured OpenAI-compatible AI provider.
 * Run with: pnpm ai:test
 * Requires AI_API_KEY, with optional AI_BASE_URL and AI_MODEL overrides.
 */
import 'dotenv/config'
import { gradientClient } from './gradient'

async function testChat() {
    console.log('--- Testing chat() ---')
    const result = await gradientClient.chat({
        systemPrompt: 'Respond ONLY with valid JSON. No markdown. No preamble.',
        userPrompt: 'Return a JSON object with a single key "test" set to true.',
        maxTokens: 100,
        temperature: 0.1,
    })

    console.log('Raw result:', result)
    const parsed = gradientClient.parseJSON<{ test: boolean }>(result)
    console.log('Parsed:', parsed)

    if (parsed.test !== true) {
        throw new Error(`Expected { test: true }, got ${JSON.stringify(parsed)}`)
    }
    console.log('chat() test passed\n')
}

async function main() {
    if (!process.env.AI_API_KEY) {
        console.log('AI_API_KEY not set — skipping AI API tests')
        return
    }

    try {
        await testChat()
        console.log('All AI API tests passed!')
    } catch (err) {
        console.error('Test failed:', err)
        process.exit(1)
    }
}

main()
