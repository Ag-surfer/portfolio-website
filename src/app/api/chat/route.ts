import { NextRequest, NextResponse } from 'next/server';

const CANNED_RESPONSE =
  "Thanks for your message! I'm Krishna's AI assistant. This chat feature is coming soon — stay tuned!";

/** In-memory rate limit store: IP -> array of timestamps */
const rateLimitMap = new Map<string, number[]>();

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 20;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) ?? [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (recent.length >= RATE_LIMIT_MAX) {
    rateLimitMap.set(ip, recent);
    return true;
  }

  recent.push(now);
  rateLimitMap.set(ip, recent);
  return false;
}

/**
 * POST /api/chat
 * Scaffold for AI chatbot. Streams a canned response word-by-word.
 */
export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 },
      );
    }

    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 },
      );
    }
    const { message } = body ?? {};

    if (typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 },
      );
    }

    if (message.trim().length > 500) {
      return NextResponse.json(
        { error: 'Message must be 500 characters or less' },
        { status: 400 },
      );
    }

    const words = CANNED_RESPONSE.split(' ');
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        for (let i = 0; i < words.length; i++) {
          const chunk = i === 0 ? words[i] : ` ${words[i]}`;
          controller.enqueue(encoder.encode(chunk));
          await new Promise((resolve) => setTimeout(resolve, 80));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('[API] POST /api/chat error:', error);
    return NextResponse.json({ error: 'Failed to process chat message' }, { status: 500 });
  }
}
