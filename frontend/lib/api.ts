export type Kpis = {
  total_crimes: number;
  active_cases: number;
  solved_cases: number;
  repeat_offenders: number;
  high_risk_zones: number;
  top_district: string;
};

export type DashboardData = {
  kpis: Kpis;
  district_ranking: Array<{ district: string; crime_count: number }>;
  trend: Array<{ period: string; crime_count: number }>;
  crime_mix: Array<{ crime_type: string; count: number }>;
  alerts: Array<{ district: string; date: string; crime_count: number; severity: string; message: string }>;
};

export type CrimeRecord = {
  fir_id: string;
  crime_type: string;
  district: string;
  police_station: string;
  reported_at: string;
  latitude: number;
  longitude: number;
  status: string;
  offender_id: string;
  risk_score: number;
  risk_level: string;
};

export type Hotspot = {
  district: string;
  crime_count: number;
  latitude: number;
  longitude: number;
  confidence: number;
  risk_level: string;
};

export type RepeatOffender = {
  offender_id: string;
  crime_count: number;
  last_seen: string;
  districts: string[];
  crime_types: string[];
  risk_score: number;
};

export type SocioEconomicData = {
  factors: Array<{
    district: string;
    crime_count: number;
    population_density: number;
    income_category: string;
    risk_score: number;
    high_risk_cases: number;
  }>;
  correlation: number;
  insight: string;
};

export type NetworkData = {
  nodes: Array<{ id: string; label: string; type: string; weight: number }>;
  edges: Array<{ source: string; target: string; type: string; weight: number }>;
  central_criminals: Array<{ id: string; centrality: number }>;
  communities: string[];
};

export type PredictionData = {
  classifications: Array<{ district: string; predicted_crime_type: string; confidence: number; average_risk: number }>;
  hotspots: Hotspot[];
  risk_scores: Array<{ fir_id: string; district: string; crime_type: string; risk_score: number; risk_level: string }>;
  trend_forecast: Array<{ period: string; crime_count: number }>;
  explainability: {
    global_importance: Array<{ feature: string; importance: number }>;
  };
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

function getAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") {
    return {};
  }
  const token = window.localStorage.getItem("authToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}/api${path}`, {
    next: { revalidate: 30 },
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });
  
  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }
  
  return (await response.json()) as T;
}

export function getDashboard(): Promise<DashboardData> {
  return fetchJson<DashboardData>("/dashboard");
}

export function getCrimes(): Promise<CrimeRecord[]> {
  return fetchJson<CrimeRecord[]>("/crimes");
}

export function getHotspots(): Promise<Hotspot[]> {
  return fetchJson<Hotspot[]>("/hotspots");
}

export function getNetwork(focusNode?: string, maxNodes: number = 500): Promise<NetworkData> {
  const url = focusNode ? `/network?focus_node=${encodeURIComponent(focusNode)}&max_nodes=${maxNodes}` : `/network?max_nodes=${maxNodes}`;
  return fetchJson<NetworkData>(url);
}

export function getPredictions(): Promise<PredictionData> {
  return fetchJson<PredictionData>("/predictions");
}

export function getAnomalies(): Promise<DashboardData['alerts']> {
  return fetchJson<DashboardData['alerts']>("/anomalies");
}

export function getRepeatOffenders(): Promise<RepeatOffender[]> {
  return fetchJson<RepeatOffender[]>("/repeat-offenders");
}

export function getSocioEconomic(): Promise<SocioEconomicData> {
  return fetchJson<SocioEconomicData>("/analytics/socio-economic");
}

export function getReports(): Promise<any> {
  return fetchJson<any>("/reports");
}
