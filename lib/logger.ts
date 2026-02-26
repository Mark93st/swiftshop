import { prisma } from './prisma';
import { env } from './env';

export async function logError(error: unknown, source?: string) {
  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;

  console.error(`[ERROR][${source || 'UNKNOWN'}] ${message}`);

  // Create the error record first
  const systemError = await prisma.systemError.create({
    data: {
      message,
      stack,
      source,
    },
  });

  // We no longer automatically trigger diagnoseError here.
  // It will be triggered manually via the UI.

  return systemError;
}

export async function diagnoseError(errorId: string, message: string, stack?: string) {
  const prompt = `
    You are a Senior QA Automation Engineer. Explain this error in simple terms and suggest a fix.
    
    Error Message: ${message}
    Stack Trace: ${stack || 'No stack trace available'}
    
    IMPORTANT: Provide your response in valid JSON format with exactly these two keys:
    "diagnosis": "your explanation",
    "suggestedFix": "your fix"
  `;

  try {
    if (!env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is missing.');
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are a Senior QA Automation Engineer. You analyze error logs with extreme precision and provide simple, expert explanations and fixes in JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: 'json_object' }
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      console.error('🤖 Groq API Error:', data.error.message);
      await prisma.systemError.update({
        where: { id: errorId },
        data: {
          diagnosis: `AI Analysis Failed: ${data.error.message || 'Unknown API Error'}`,
          suggestedFix: 'Please check your Groq API key and rate limits in the environment variables.',
        },
      });
      return;
    }

    const resultText = data.choices?.[0]?.message?.content;

    if (resultText) {
      const result = JSON.parse(resultText);
      
      await prisma.systemError.update({
        where: { id: errorId },
        data: {
          diagnosis: result.diagnosis,
          suggestedFix: result.suggestedFix,
        },
      });
    }
  } catch (err: any) {
    console.error('Groq Diagnosis failed:', err);
    await prisma.systemError.update({
      where: { id: errorId },
      data: {
        diagnosis: `AI Analysis Failed: ${err.message}`,
        suggestedFix: 'An unexpected error occurred while communicating with the AI service.',
      },
    });
  }
}
