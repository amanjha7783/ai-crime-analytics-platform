import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";
import { getCrimeTrends, getHotspots, navigateDashboard } from "@/lib/ai-tools";

export const maxDuration = 60;

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || "",
});

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      throw new Error("Google Gemini API Key is missing or invalid. Please update your .env.local file with a valid API key.");
    }

    const { messages, userRole } = await req.json();
    
    // Map messages to ensure compatibility with Vercel AI SDK CoreMessage format
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const coreMessages = messages.map((msg: any) => {
      if (msg.parts && Array.isArray(msg.parts)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const textParts = msg.parts.filter((p: any) => p.type === "text").map((p: any) => p.text).join("\n");
        return { role: msg.role, content: textParts };
      }
      return { role: msg.role, content: msg.content || "" };
    });

    const systemPrompt = `You are a highly intelligent Crime Intelligence Assistant for the Karnataka State Police AI-Driven Crime Analytics Platform.
Your role is to help ${userRole || "officers and analysts"} understand crime data, predict hotspots, analyze trends, and generate insights.
Be professional, analytical, and concise. 
Format responses clearly using Markdown.
If the user asks to see a chart, map, or open a page, use the navigateDashboard tool to take them to the relevant dashboard.
If they ask for specific data, use the available tools to fetch it before answering.`;

    const tools = {
      getCrimeTrends,
      getHotspots,
      navigateDashboard,
    };

    const result = await streamText({
      model: google("gemini-2.5-pro"),
      messages: coreMessages,
      system: systemPrompt,
      tools,
    });

    // @ts-expect-error: Handle type mismatch across AI SDK versions
    return result.toDataStreamResponse ? result.toDataStreamResponse({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      getErrorMessage: (err: any) => {
        return err instanceof Error ? err.message : String(err);
      }
    }) : result.toTextStreamResponse();
  } catch (error) {
    console.error("AI Chat Error:", error);
    const errorMessage = error instanceof Error ? error.message : "An error occurred during the AI chat session.";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
