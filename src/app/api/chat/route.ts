import { NextRequest } from 'next/server';
import OpenAI from 'openai';
import { conciergeKnowledge } from '@/lib/conciergeKnowledge';

// Limit message size to prevent large payload injections
const MAX_MESSAGE_LENGTH = 1000;

export async function POST(req: NextRequest) {
  try {
    // Check key availability safely without crashing
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'api_key_missing' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'invalid_payload' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Sanitize and validate inputs
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.content && lastMessage.content.length > MAX_MESSAGE_LENGTH) {
      return new Response(
        JSON.stringify({ error: 'message_too_long' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const sanitizedMessages = messages.map(m => ({
      role: (m.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
      content: String(m.content).slice(0, MAX_MESSAGE_LENGTH)
    }));

    // Construct the Michelin-star concierge system prompt
    const systemPrompt = `You are the elegant, Michelin-starred Urban Concierge of "Urban Fork", a cinematic luxury restaurant in Manhattan. 
Your tone is refined, poised, anticipatory, and warm — mirroring the highest standard of elite hospitality (like Aman Resorts, Four Seasons, or a 3-star Michelin Maitre D'). 
Always address guests with absolute respect.

Answer questions using the provided restaurant knowledge base. Prioritize these details over general model knowledge. If the answer is not in the knowledge base, answer politely and suggest speaking with the host or concierge directly (Phone: +1 (212) 555-0187, WhatsApp: +91 88220 77515).

Format your responses cleanly. Use bold (**text**) for emphasis, and bullet points for lists. Keep your answers concise, highly specific, and elegant.

RESTAURANT KNOWLEDGE BASE:
${JSON.stringify(conciergeKnowledge, null, 2)}`;

    // Initialize OpenAI client
    const openai = new OpenAI({ apiKey });

    // Request completions stream
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...sanitizedMessages
      ],
      stream: true,
      temperature: 0.7,
      max_tokens: 600,
    });

    // Create a native readable stream to pipe chunks directly to the client
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of response) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
        } catch (err) {
          controller.error(err);
        } finally {
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      }
    });

  } catch (error: any) {
    console.error('Urban Concierge AI API Error:', error);
    return new Response(
      JSON.stringify({ error: 'internal_server_error', message: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
