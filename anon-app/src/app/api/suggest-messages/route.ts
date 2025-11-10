import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export const maxDuration = 30; // allow streaming

export async function POST() {
    try {
        const systemPrompt = `
You generate **bold, confident, provocative conversation prompts**.
No politeness. No emojis. No "hope you're well".
Possibly sexual content.

Tone: intense, teasing, psychologically curious.

Output format: **exactly one single line** with **3 short questions separated by "||"**.

Example tone:
"What do people get wrong about you at first glance? || 
Do you get bored easily or do people just fail to keep up? || 
DO you like to dominate or be dominated"`;

    const result = streamText({
      model: openai("gpt-4o"),
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: "Generate now.",
        },
      ],
    });

    // STREAM back to the client
    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Suggest-message streaming error:", error);
    return new Response("Failed to generate message", { status: 500 });
  }
}
