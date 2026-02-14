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

  // If we have a Groq API key, get the AI diagnosis asynchronously
  if (env.GROQ_API_KEY) {
    diagnoseError(systemError.id, message, stack).catch((err) => {
      console.error('Failed to diagnose error with AI (Groq):', err);
    });
  } else {
    console.warn('GROQ_API_KEY is not set. AI Diagnosis will be skipped.');
  }

  return systemError;
}

async function diagnoseError(errorId: string, message: string, stack?: string) {
  const prompt = `
    You are a Senior QA Automation Engineer. Explain this error in simple terms and suggest a fix.
    
    Error Message: ${message}
    Stack Trace: ${stack || 'No stack trace available'}
    
    IMPORTANT: Provide your response in valid JSON format with exactly these two keys:
    "diagnosis": "your explanation",
    "suggestedFix": "your fix"
  `;

  try {
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
  } catch (err) {
    console.error('Groq Diagnosis failed:', err);
  }
}
