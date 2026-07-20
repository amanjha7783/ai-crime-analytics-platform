import { z } from "zod";
import { tool } from "ai";

export const getCrimeTrends = tool({
  description: "Get crime trends and statistics for a specific region over a timeframe. Use this when asked for crime rates, trends, or summaries.",
  parameters: z.object({
    region: z.string().describe("The district or city name (e.g., Bengaluru, Mysuru, Hubballi)"),
    timeframe: z.string().describe("The timeframe (e.g., last_6_months, this_year, last_week)"),
  }),
  // @ts-expect-error - AI SDK v3 types don't match exactly
  execute: async (args: unknown) => {
    const { region, timeframe } = args as { region: string; timeframe: string };
    
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/crimes?district=${region}&limit=1000`);
      const crimes = await res.json();
      
      return {
        region,
        timeframe,
        totalIncidents: crimes.length,
        message: `Found ${crimes.length} recent records for ${region}. Data might be truncated to 1000 records for analysis.`,
      };
    } catch (e) {
      return { error: "Failed to fetch crime data from the backend." };
    }
  },
});

export const getHotspots = tool({
  description: "Get crime hotspots for a specific district. Use this when asked about the most dangerous areas, hotspots, or where crimes are concentrated.",
  parameters: z.object({
    district: z.string().describe("The district name (e.g., Bengaluru)"),
    crimeType: z.string().optional().describe("Specific type of crime to filter by, if any"),
  }),
  // @ts-expect-error - AI SDK v3 types don't match exactly
  execute: async (args: unknown) => {
    const { district, crimeType } = args as { district: string; crimeType?: string };
    try {
      const res = await fetch("http://127.0.0.1:8000/api/hotspots");
      const hotspots = await res.json();
      
      const filtered = hotspots.filter((h: any) => h.district.toLowerCase().includes(district.toLowerCase()));
      
      return {
        district,
        crimeType: crimeType || "All",
        hotspots: filtered.slice(0, 10).map((h: any) => ({
          location: `${h.district} area`,
          riskLevel: h.risk_level,
          incidentCount: h.crime_count,
          confidence: h.confidence,
        }))
      };
    } catch (e) {
      return { error: "Failed to fetch hotspots from the backend." };
    }
  }
});

export const navigateDashboard = tool({
  description: "Navigate the user to a specific dashboard page (e.g., /crime-map, /analytics, /predictions, /search, /reports). Use this when the user asks to open, view, or go to a specific dashboard or tool.",
  parameters: z.object({
    page: z.enum(["/crime-map", "/analytics", "/predictions", "/search", "/reports", "/hotspots", "/risk-score", "/network-analysis"]).describe("The path to navigate to"),
    reason: z.string().describe("Why you are navigating them there"),
  }),
  // @ts-expect-error - AI SDK v3 types don't match exactly
  execute: async (args: unknown) => {
    const { page, reason } = args as { page: string; reason: string };
    return { success: true, url: page, message: `Navigating to ${page} for ${reason}` };
  }
});
