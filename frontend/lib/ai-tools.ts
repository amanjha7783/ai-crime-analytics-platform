import { z } from "zod";
import { tool } from "ai";

const API_BASE = "http://127.0.0.1:8000/api";

export const getCrimeTrends = tool({
  description: "Get raw crime records for a specific district over a timeframe. Use this when asked for crime rates, trends, or summaries.",
  parameters: z.object({
    district: z.string().describe("The district or city name (e.g., Bengaluru, Mysuru, Hubballi)"),
    timeframe: z.string().optional().describe("The timeframe (e.g., last_6_months, this_year, last_week)"),
  }),
  // @ts-expect-error - AI SDK v3 types don't match exactly
  execute: async ({ district, timeframe }) => {
    try {
      const res = await fetch(`${API_BASE}/crimes?district=${district}&limit=500`);
      const crimes = await res.json();
      return {
        district,
        timeframe: timeframe || "recent",
        totalIncidents: crimes.length,
        data: crimes.slice(0, 10), // only send a sample to LLM to save tokens
        message: `Found ${crimes.length} recent records for ${district}. I am providing the top 10 as a sample for you to analyze.`,
      };
    } catch (e) {
      return { error: "Failed to fetch crime data from the backend." };
    }
  },
});

export const getHotspots = tool({
  description: "Get predictive crime hotspots and high-risk zones.",
  parameters: z.object({
    district: z.string().optional().describe("The district name to filter by (optional)"),
  }),
  // @ts-expect-error - AI SDK v3 types don't match exactly
  execute: async ({ district }) => {
    try {
      const res = await fetch(`${API_BASE}/hotspots`);
      const hotspots = await res.json();
      
      let filtered = hotspots;
      if (district) {
        filtered = hotspots.filter((h: any) => h.district.toLowerCase().includes(district.toLowerCase()));
      }
      
      return {
        district: district || "All",
        total_hotspots: filtered.length,
        high_risk_hotspots: filtered.filter((h: any) => h.risk_level === "High").length,
        hotspots: filtered.slice(0, 15).map((h: any) => ({
          district: h.district,
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

export const getAnalytics = tool({
  description: "Get system-wide analytics, crime breakdowns by category, and socio-economic data.",
  parameters: z.object({}),
  // @ts-expect-error - AI SDK v3 types don't match exactly
  execute: async () => {
    try {
      const res = await fetch(`${API_BASE}/analytics`);
      const data = await res.json();
      return {
        total_crimes: data.total_crimes,
        active_officers: data.active_officers,
        resolved_cases: data.resolved_cases,
        critical_alerts: data.critical_alerts,
        crime_breakdown: data.crime_breakdown,
        monthly_trends: data.monthly_trends.slice(-6)
      };
    } catch (e) {
      return { error: "Failed to fetch analytics from the backend." };
    }
  }
});

export const getPredictions = tool({
  description: "Get AI-generated crime predictions, trend forecasts, and feature explainability data.",
  parameters: z.object({}),
  // @ts-expect-error - AI SDK v3 types don't match exactly
  execute: async () => {
    try {
      const res = await fetch(`${API_BASE}/predictions`);
      const data = await res.json();
      return {
        trend_forecast: data.trend_forecast,
        top_features: data.explainability.global_importance.slice(0, 5),
        high_risk_predictions: data.risk_scores.filter((r: any) => r.risk_level === 'High').length
      };
    } catch (e) {
      return { error: "Failed to fetch predictions from the backend." };
    }
  }
});

export const getRepeatOffenders = tool({
  description: "Retrieve a list of repeat offenders, their risk scores, and associated crimes.",
  parameters: z.object({
    limit: z.number().optional().describe("Number of offenders to return (max 10)"),
  }),
  // @ts-expect-error - AI SDK v3 types don't match exactly
  execute: async ({ limit = 5 }) => {
    try {
      const res = await fetch(`${API_BASE}/repeat-offenders`);
      const data = await res.json();
      const highRisk = data.sort((a: any, b: any) => b.risk_score - a.risk_score);
      return {
        total_offenders: data.length,
        top_offenders: highRisk.slice(0, limit)
      };
    } catch (e) {
      return { error: "Failed to fetch repeat offenders from the backend." };
    }
  }
});

export const navigateDashboard = tool({
  description: "Navigate the user's UI to a specific dashboard page.",
  parameters: z.object({
    page: z.enum(["/crime-map", "/analytics", "/predictions", "/search", "/reports", "/hotspots", "/risk-score", "/network-analysis", "/repeat-offenders"]).describe("The path to navigate to"),
    reason: z.string().describe("Why you are navigating them there"),
  }),
  // @ts-expect-error - AI SDK v3 types don't match exactly
  execute: async ({ page, reason }) => {
    return { success: true, url: page, message: `Navigated to ${page} for ${reason}` };
  }
});
