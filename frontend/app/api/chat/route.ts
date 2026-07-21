import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText, convertToModelMessages, UIMessage } from "ai";
import { z } from "zod";
import { 
  getCrimeTrends, 
  getHotspots, 
  getAnalytics,
  getPredictions,
  getRepeatOffenders,
  navigateDashboard 
} from "@/lib/ai-tools";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      return new Response(
        JSON.stringify({ error: "API Key missing. Please configure GEMINI_API_KEY in .env.local" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const google = createGoogleGenerativeAI({
      apiKey: apiKey,
    });

    const body = await req.json();
    const messages: UIMessage[] = body.messages ?? [];

    const systemPrompt = `You are an elite, highly intelligent Police Intelligence Assistant for the Karnataka State Police AI-Driven Crime Analytics Platform.
Your role is to help officers and analysts understand crime data, predict hotspots, analyze trends, and generate insights.
CRITICAL RULES:
1. ALWAYS use the provided tools to fetch real data from the platform database before answering questions about crimes, hotspots, analytics, or repeat offenders. Do NOT make up data.
2. If the user asks a specific question (e.g., "Which district has the highest cyber crime rate?"), use 'getAnalytics' or 'getCrimeTrends' to find the answer.
3. Be professional, analytical, and concise. Format responses clearly using Markdown tables, bullet points, and bold text for emphasis.
4. If a user asks to see a chart, map, or open a specific page, use the 'navigateDashboard' tool to take them there.
5. Provide actionable recommendations based on the data.
6. When using tools, summarize the data you receive in a digestible way for the user. Don't just dump raw JSON.`;

    const tools = {
      getCrimeTrends,
      getHotspots,
      getAnalytics,
      getPredictions,
      getRepeatOffenders,
      navigateDashboard,
    };

    // Convert UIMessage[] (parts-based) to model messages for streamText
    const modelMessages = convertToModelMessages(messages);

    const result = await streamText({
      model: google("gemini-2.5-pro"),
      messages: modelMessages,
      system: systemPrompt,
      tools,
      maxSteps: 3,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("AI Chat Error:", error);
    const errorMessage = error instanceof Error ? error.message : "AI service temporarily unavailable.";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
