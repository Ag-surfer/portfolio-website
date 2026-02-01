import { NextRequest, NextResponse } from 'next/server';

/** In-memory rate limit store: IP -> array of timestamps */
const rateLimitMap = new Map<string, number[]>();

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) ?? [];

  // Remove entries older than the window
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (recent.length >= RATE_LIMIT_MAX) {
    rateLimitMap.set(ip, recent);
    return true;
  }

  recent.push(now);
  rateLimitMap.set(ip, recent);
  return false;
}

/** Strip HTML tags from a string. */
function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, '');
}

/** Basic email regex check. */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * POST /api/contact
 * Accepts a contact form submission with name, email, message, and optional honeypot.
 */
export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, message: 'Too many requests' },
        { status: 429 },
      );
    }

    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, errors: ['Invalid request body'] },
        { status: 400 },
      );
    }
    const { name, email, message, honeypot } = body ?? {};

    // Bot trap: if honeypot is filled, silently return success
    if (honeypot) {
      return NextResponse.json({ success: true, message: 'Message sent successfully' });
    }

    // Validation
    const errors: string[] = [];

    if (typeof name !== 'string' || name.trim().length === 0) {
      errors.push('Name is required');
    } else if (name.trim().length > 100) {
      errors.push('Name must be 100 characters or less');
    }

    if (typeof email !== 'string' || email.trim().length === 0) {
      errors.push('Email is required');
    } else if (!isValidEmail(email.trim())) {
      errors.push('Email format is invalid');
    }

    if (typeof message !== 'string' || message.trim().length === 0) {
      errors.push('Message is required');
    } else if (message.trim().length > 2000) {
      errors.push('Message must be 2000 characters or less');
    }

    if (errors.length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    // Sanitize inputs (types verified by validation above)
    const sanitized = {
      name: stripHtml((name as string).trim()),
      email: (email as string).trim(),
      message: stripHtml((message as string).trim()),
    };

    // TODO: persist to database or send email
    console.log('[API] Contact form submission:', sanitized);

    return NextResponse.json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('[API] POST /api/contact error:', error);
    return NextResponse.json(
      { success: false, errors: ['An unexpected error occurred'] },
      { status: 500 },
    );
  }
}
