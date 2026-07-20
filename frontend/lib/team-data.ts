import {
  BarChart3,
  Binoculars,
  Brain,
  Map,
  Radar,
  ShieldCheck,
  Siren,
  type LucideIcon
} from "lucide-react";

export type TeamMember = {
  name: string;
  role: string;
  unit: string;
  focus: string;
};

export type TeamMetric = {
  label: string;
  value: string;
  detail: string;
};

export type TeamActivity = {
  time: string;
  title: string;
  description: string;
};

export type TeamProject = {
  name: string;
  status: string;
  impact: string;
};

export type TeamProfile = {
  slug: string;
  name: string;
  role: string;
  subtitle: string;
  overview: string;
  icon: LucideIcon;
  accent: string;
  members: TeamMember[];
  responsibilities: string[];
  metrics: TeamMetric[];
  activities: TeamActivity[];
  projects: TeamProject[];
  dashboards: string[];
};

export const teamProfiles: TeamProfile[] = [
  {
    slug: "ksp-data-science",
    name: "KSP Data Science",
    role: "AI & Analytics",
    subtitle: "Model governance, crime intelligence research, and explainable prediction systems.",
    overview:
      "The KSP Data Science team converts raw FIR, geospatial, temporal, and socio-economic signals into actionable crime intelligence. The unit owns model experimentation, feature quality, risk scoring, hotspot confidence, anomaly logic, and explainability for command-level decision support.",
    icon: Brain,
    accent: "from-violet-600 to-cyan-500",
    members: [
      { name: "Dr. Ananya Rao", role: "Lead Crime Data Scientist", unit: "AI Strategy Cell", focus: "Hotspot prediction and explainability" },
      { name: "Raghavendra Hegde", role: "ML Engineer", unit: "Model Operations", focus: "Training pipelines and evaluation" },
      { name: "Meera Kulkarni", role: "Data Analyst", unit: "District Intelligence", focus: "Trend discovery and reporting" },
      { name: "Fayaz Ahmed", role: "Feature Engineer", unit: "Data Quality", focus: "Temporal, spatial, and offender features" }
    ],
    responsibilities: [
      "Develop crime category, hotspot, risk, trend, and anomaly models.",
      "Maintain feature engineering standards for FIR, offender, location, and time-based signals.",
      "Publish confidence scores and local/global explanations for model-assisted decisions.",
      "Validate model quality with accuracy, precision, recall, F1, ROC-AUC, and drift checks.",
      "Coordinate with operations teams to convert predictions into patrol and investigation actions."
    ],
    metrics: [
      { label: "Model Experiments", value: "48", detail: "baseline and advanced model runs tracked" },
      { label: "Prediction Coverage", value: "31 districts", detail: "district-level risk feeds prepared" },
      { label: "Feature Signals", value: "27", detail: "temporal, spatial, offender, and socio-economic indicators" },
      { label: "Explainability SLA", value: "100%", detail: "risk outputs include reason summaries" }
    ],
    activities: [
      { time: "09:20", title: "Hotspot model review", description: "Compared Bengaluru Urban night-time theft clusters against repeat-offender density." },
      { time: "11:45", title: "Risk score calibration", description: "Adjusted district severity bands for cyber crime and drug trafficking reports." },
      { time: "15:10", title: "Explainability briefing", description: "Prepared feature-importance notes for analyst review and judge demo narrative." }
    ],
    projects: [
      { name: "Spatio-temporal hotspot model", status: "In validation", impact: "Improves patrol-zone confidence and early warning quality." },
      { name: "Model comparison matrix", status: "Active", impact: "Benchmarks Random Forest, XGBoost, LightGBM, CatBoost, and heuristics." },
      { name: "SHAP explanation layer", status: "Planned", impact: "Adds transparent, court-safe model interpretation." }
    ],
    dashboards: ["Model Quality", "District Risk", "Anomaly Feed", "Feature Health"]
  },
  {
    slug: "crimeops-command",
    name: "CrimeOps Command",
    role: "Operations",
    subtitle: "Command-center operations, patrol prioritization, case triage, and escalation workflow.",
    overview:
      "CrimeOps Command transforms analytics into field action. The unit monitors live KPIs, open case pressure, solved-case movement, patrol priority zones, and escalations from high-risk districts so senior officers can coordinate fast, evidence-backed interventions.",
    icon: Siren,
    accent: "from-rose-600 to-amber-500",
    members: [
      { name: "DCP Vikram Shetty", role: "Operations Commander", unit: "State Command Desk", focus: "Escalation and tactical coordination" },
      { name: "Inspector Kavitha Nair", role: "Case Triage Lead", unit: "Investigation Support", focus: "Active and pending case queues" },
      { name: "Suresh Gowda", role: "Patrol Planner", unit: "Field Deployment", focus: "Beat and response prioritization" },
      { name: "Nandini Prasad", role: "Operations Analyst", unit: "Command Reporting", focus: "Daily briefings and watch lists" }
    ],
    responsibilities: [
      "Monitor total crimes, active cases, solved cases, pending cases, and alert queues.",
      "Translate hotspot and anomaly intelligence into patrol deployment plans.",
      "Coordinate station-level escalations and district drilldowns.",
      "Track repeat incidents and high-risk categories for command briefings.",
      "Generate daily operational summaries for senior leadership."
    ],
    metrics: [
      { label: "Active Watch Zones", value: "14", detail: "areas under elevated operational review" },
      { label: "Case Triage SLA", value: "2.5 hrs", detail: "median time to classify new incident priority" },
      { label: "Patrol Plans", value: "38", detail: "district and station plans prepared this cycle" },
      { label: "Escalations Closed", value: "82%", detail: "priority alerts closed within review window" }
    ],
    activities: [
      { time: "08:30", title: "Morning command sync", description: "Reviewed open cases and high-risk zones across Bengaluru Urban and Mysuru." },
      { time: "12:05", title: "Station escalation", description: "Assigned repeat theft cluster to Central and Indiranagar station review teams." },
      { time: "18:25", title: "Night patrol adjustment", description: "Updated deployment recommendation for late-evening assault patterns." }
    ],
    projects: [
      { name: "Command watch board", status: "Active", impact: "Consolidates district ranking, alerts, and case-pressure indicators." },
      { name: "Patrol recommendation workflow", status: "In design", impact: "Converts hotspots into beat-level deployment guidance." },
      { name: "Daily intelligence brief", status: "Active", impact: "Produces command-ready reporting from dashboard data." }
    ],
    dashboards: ["Command KPIs", "Active Cases", "Station Analytics", "Alert Resolution"]
  },
  {
    slug: "geo-surveillance",
    name: "Geo Surveillance",
    role: "GIS & Mapping",
    subtitle: "Geospatial intelligence, hotspot visualization, station coverage, and map-led investigation.",
    overview:
      "Geo Surveillance owns the spatial intelligence layer of the platform. The team manages geocoded crime data, PostGIS readiness, interactive maps, hotspot overlays, station coverage views, and district-level spatial drilldowns for operational planning.",
    icon: Map,
    accent: "from-emerald-600 to-sky-500",
    members: [
      { name: "Aditi Menon", role: "Senior GIS Engineer", unit: "Spatial Intelligence", focus: "PostGIS and map layers" },
      { name: "Pranav Bhat", role: "Geospatial Analyst", unit: "Hotspot Cell", focus: "Clusters, heatmaps, and radius analysis" },
      { name: "Sameer Khan", role: "Map Operations Lead", unit: "Field Mapping", focus: "Police station and route overlays" },
      { name: "Lakshmi H R", role: "Data Steward", unit: "Location Quality", focus: "Coordinate validation and district boundaries" }
    ],
    responsibilities: [
      "Maintain district, station, crime, and hotspot geospatial layers.",
      "Build heatmaps, clusters, radius searches, and drilldown workflows.",
      "Validate coordinates and detect suspicious or missing location data.",
      "Prepare satellite, terrain, and operational map layer toggles.",
      "Support route mapping and time-based crime playback planning."
    ],
    metrics: [
      { label: "Mapped Incidents", value: "120k+", detail: "geocoded historical and demo crime records" },
      { label: "Spatial Indexes", value: "3", detail: "crime, station, and hotspot GIST indexes" },
      { label: "Coverage Zones", value: "38", detail: "district-level surveillance regions" },
      { label: "Coordinate Quality", value: "96%", detail: "records passing spatial validation checks" }
    ],
    activities: [
      { time: "10:15", title: "Hotspot overlay review", description: "Validated high-confidence hotspot circles against district boundary assumptions." },
      { time: "13:40", title: "Station coverage audit", description: "Checked police station locations for Mangaluru and Hubballi Dharwad overlays." },
      { time: "17:05", title: "Playback prototype planning", description: "Defined time-slider data needs for animated crime movement analysis." }
    ],
    projects: [
      { name: "PostGIS spatial query layer", status: "Ready for hardening", impact: "Enables radius and district drilldown APIs." },
      { name: "Cluster and heatmap visualizer", status: "Next", impact: "Makes high-density crime patterns easier to inspect." },
      { name: "Station response map", status: "Planned", impact: "Shows coverage gaps and route-to-incident planning." }
    ],
    dashboards: ["Crime Map", "Heatmap Layers", "Station Coverage", "Spatial Data Quality"]
  },
  {
    slug: "security-trust",
    name: "Security & Trust",
    role: "Risk & Compliance",
    subtitle: "Access control, auditability, secure APIs, data governance, and responsible AI safeguards.",
    overview:
      "Security & Trust ensures the platform can be safely used for sensitive law-enforcement workflows. The team governs identity, role-based access, audit trails, data privacy, secure deployment posture, and responsible AI checks for predictive policing features.",
    icon: ShieldCheck,
    accent: "from-slate-700 to-cyan-600",
    members: [
      { name: "Nisha Fernandes", role: "Security Architect", unit: "Trust Engineering", focus: "JWT, RBAC, and secure APIs" },
      { name: "Arun Prakash", role: "Compliance Lead", unit: "Governance", focus: "Audit logs and policy controls" },
      { name: "Devika S", role: "Privacy Engineer", unit: "Data Protection", focus: "PII minimization and retention" },
      { name: "Imran Pasha", role: "Platform Reliability Engineer", unit: "DevSecOps", focus: "Deployment checks and monitoring" }
    ],
    responsibilities: [
      "Enforce authentication, authorization, and role-specific access policies.",
      "Maintain audit logs for sensitive intelligence access and report generation.",
      "Review model outputs for responsible use and confidence communication.",
      "Harden deployment settings, secrets, CORS, and operational monitoring.",
      "Define incident response and data-governance workflows."
    ],
    metrics: [
      { label: "Protected Workflows", value: "11", detail: "routes targeted for RBAC policy enforcement" },
      { label: "Audit Events", value: "24/7", detail: "continuous access and action logging target" },
      { label: "Policy Checks", value: "18", detail: "security and compliance controls tracked" },
      { label: "Risk Reviews", value: "Weekly", detail: "model, data, and access governance cadence" }
    ],
    activities: [
      { time: "09:50", title: "RBAC policy review", description: "Mapped Admin, Officer, Investigator, and Analyst access boundaries." },
      { time: "14:20", title: "Audit log design", description: "Defined event structure for login, report export, and intelligence endpoint access." },
      { time: "16:45", title: "Deployment posture check", description: "Reviewed CORS, secret handling, and Docker service boundaries." }
    ],
    projects: [
      { name: "RBAC route enforcement", status: "High priority", impact: "Prevents unauthorized access to intelligence endpoints." },
      { name: "Audit trail service", status: "Next", impact: "Creates accountability for sensitive police analytics actions." },
      { name: "Responsible AI checklist", status: "Planned", impact: "Documents safe use of predictive risk outputs." }
    ],
    dashboards: ["Access Control", "Audit Events", "Security Posture", "Responsible AI"]
  }
];

export function getTeamProfile(slug: string) {
  return teamProfiles.find((profile) => profile.slug === slug);
}

export function getTeamSlugs() {
  return teamProfiles.map((profile) => profile.slug);
}

export const landingTeams = teamProfiles.map(({ slug, name, role, icon }) => ({ slug, name, role, icon }));

export const teamPageQuickLinks = [
  { label: "Analytics Dashboard", href: "/analytics", icon: BarChart3 },
  { label: "Crime Map", href: "/crime-map", icon: Radar },
  { label: "Network Analysis", href: "/network-analysis", icon: Binoculars },
  { label: "Security Settings", href: "/settings", icon: ShieldCheck }
];
