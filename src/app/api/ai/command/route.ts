import type { NextRequest } from 'next/server';

import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Extract standard AI SDK properties
    const { messages, system } = body;
    
    // Extract custom properties for API key and model
    const {
      apiKey: key,
      model: requestedModel = 'gemini-1.5-flash',
    } = body;

    const apiKey = key || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing Gemini API key',
          details: 'Please provide a valid Google Gemini API key. You can get one at https://aistudio.google.com/app/apikey'
        }),
        { headers: { 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Messages must be an array' }),
        { headers: { 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Create Google provider with API key
    const google = createGoogleGenerativeAI({ apiKey });
    
    // Use AI SDK's streamText with Google provider
    const result = await streamText({
      messages,
      model: google(requestedModel),
      ...(system && { system }),
    });

    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error('AI API Error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error name:', error.name);
    
    // Handle specific API key errors
    if (error.message?.includes('API key not valid') || error.message?.includes('Invalid API key')) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid API key',
          details: 'Please provide a valid Google Gemini API key. You can get one at https://aistudio.google.com/app/apikey',
          type: 'AuthenticationError'
        }),
        { headers: { 'Content-Type': 'application/json' }, status: 401 }
      );
    }
    
    // Handle general errors
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process AI request',
        details: error.message || 'Unknown error occurred',
        type: error.name || 'UnknownError'
      }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    );
  }
}
