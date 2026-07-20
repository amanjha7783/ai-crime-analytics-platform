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

const isBrowser = typeof window !== "undefined";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || (isBrowser ? "" : "http://127.0.0.1:8000");

function getAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") {
    return {};
  }
  const token = window.localStorage.getItem("authToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function fetchJson<T>(path: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}/api${path}`, {
      next: { revalidate: 30 },
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });
    if (!response.ok) {
      return fallback;
    }
    return (await response.json()) as T;
  } catch {
    return fallback;
  }
}

export const fallbackDashboard: DashboardData = {
  kpis: {
    total_crimes: 20,
    active_cases: 13,
    solved_cases: 7,
    repeat_offenders: 3,
    high_risk_zones: 2,
    top_district: "Bengaluru Urban"
  },
  district_ranking: [
    { district: "Bengaluru Urban", crime_count: 7 },
    { district: "Mysuru", crime_count: 2 },
    { district: "Mangaluru", crime_count: 2 },
    { district: "Hubballi Dharwad", crime_count: 2 }
  ],
  trend: [
    { period: "2026-01", crime_count: 6 },
    { period: "2026-02", crime_count: 6 },
    { period: "2026-03", crime_count: 8 }
  ],
  crime_mix: [
    { crime_type: "Theft", count: 4 },
    { crime_type: "Assault", count: 4 },
    { crime_type: "Cyber Crime", count: 4 },
    { crime_type: "Burglary", count: 3 }
  ],
  alerts: [
    {
      district: "Bengaluru Urban",
      date: "2026-03-20",
      crime_count: 1,
      severity: "Watch",
      message: "Unusual activity pattern detected in Bengaluru Urban"
    }
  ]
};

export const fallbackHotspots: Hotspot[] = [
  { district: "Bengaluru Urban", crime_count: 7, latitude: 12.972, longitude: 77.638, confidence: 0.88, risk_level: "High" },
  { district: "Mangaluru", crime_count: 2, latitude: 12.914, longitude: 74.856, confidence: 0.71, risk_level: "High" },
  { district: "Mysuru", crime_count: 2, latitude: 12.296, longitude: 76.639, confidence: 0.62, risk_level: "Medium" }
];

export const fallbackCrimes: CrimeRecord[] = [
  {
    fir_id: "FIR-2026-0001",
    crime_type: "Theft",
    district: "Bengaluru Urban",
    police_station: "Central",
    reported_at: "2026-01-15 21:15:00",
    latitude: 12.9716,
    longitude: 77.5946,
    status: "Open",
    offender_id: "OFF-1001",
    risk_score: 68,
    risk_level: "Medium"
  },
  {
    fir_id: "FIR-2026-0016",
    crime_type: "Drug Trafficking",
    district: "Mangaluru",
    police_station: "Pandeshwar",
    reported_at: "2026-03-09 00:30:00",
    latitude: 12.9144,
    longitude: 74.8565,
    status: "Open",
    offender_id: "OFF-1007",
    risk_score: 91,
    risk_level: "High"
  }
];

export const fallbackNetwork: NetworkData = {
  nodes: [
    { id: "OFF-1001", label: "OFF-1001", type: "offender", weight: 4 },
    { id: "OFF-1003", label: "OFF-1003", type: "offender", weight: 3 },
    { id: "Bengaluru Urban", label: "Bengaluru Urban", type: "district", weight: 7 },
    { id: "Mysuru", label: "Mysuru", type: "district", weight: 2 }
  ],
  edges: [
    { source: "OFF-1001", target: "Bengaluru Urban", type: "reported_in", weight: 4 },
    { source: "OFF-1001", target: "Mysuru", type: "reported_in", weight: 4 }
  ],
  central_criminals: [{ id: "OFF-1001", centrality: 0.2 }],
  communities: ["Bengaluru Urban", "Mysuru"]
};

export function getDashboard(): Promise<DashboardData> {
  return fetchJson("/dashboard", fallbackDashboard);
}

export function getCrimes(): Promise<CrimeRecord[]> {
  return fetchJson("/crimes", fallbackCrimes);
}

export function getHotspots(): Promise<Hotspot[]> {
  return fetchJson("/hotspots", fallbackHotspots);
}

export function getNetwork(): Promise<NetworkData> {
  return fetchJson("/network", fallbackNetwork);
}

export function getPredictions(): Promise<PredictionData> {
  return fetchJson<PredictionData>("/predictions", {
    classifications: [],
    hotspots: fallbackHotspots,
    risk_scores: [],
    trend_forecast: fallbackDashboard.trend,
    explainability: { global_importance: [] }
  });
}

export function getAnomalies() {
  return fetchJson("/anomalies", fallbackDashboard.alerts);
}

export function getRepeatOffenders(): Promise<RepeatOffender[]> {
  return fetchJson("/repeat-offenders", [
    {
      offender_id: "OFF-1001",
      crime_count: 4,
      last_seen: "2026-03-16",
      districts: ["Bengaluru Urban", "Mysuru", "Kalaburagi"],
      crime_types: ["Assault", "Theft"],
      risk_score: 78
    }
  ]);
}

export function getSocioEconomic(): Promise<SocioEconomicData> {
  return fetchJson("/analytics/socio-economic", {
    factors: [
      {
        district: "Bengaluru Urban",
        crime_count: 7,
        population_density: 12000,
        income_category: "High",
        risk_score: 70,
        high_risk_cases: 3
      }
    ],
    correlation: 0.62,
    insight: "Higher-density urban districts show stronger crime concentration in the current demo dataset."
  });
}

export function getReports() {
  return fetchJson("/reports", {
    title: "Karnataka Crime Intelligence Brief",
    generated_for: "Karnataka State Police Datathon 2026",
    summary: "Demo intelligence brief from fallback data.",
    sections: []
  });
}
