import type { NextRequest } from 'next/server';

import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const {
    apiKey: key,
    model = 'gemini-2.0-flash-001',
    prompt,
    system,
  } = await req.json();

  const apiKey = key || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Missing Gemini API key.' },
      { status: 401 }
    );
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      contents: prompt,
      model,
      ...(system
        ? { systemInstruction: { parts: [{ text: system }], role: 'system' } }
        : {}),
    });
    return NextResponse.json({ text: response.text });
  } catch (error: any) {
    if (error.name === 'AbortError') {
      return NextResponse.json(null, { status: 408 });
    }
    return NextResponse.json(
      { error: 'Failed to process Gemini AI request' },
      { status: 500 }
    );
  }
}
