"use client";

import React, { useState } from "react";
import { SectionPanel } from "@/components/section-panel";
import { Shield, Server, Database, Key, Settings as SettingsIcon, Bell, Users, Globe } from "lucide-react";

const roles = [
  { name: "Admin", access: "Full Control", users: 3 },
  { name: "Police Officer", access: "Read / Write", users: 142 },
  { name: "Investigator", access: "Advanced Analytics", users: 56 },
  { name: "Analyst", access: "Read Only", users: 24 }
];

export function SettingsDashboard() {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 shrink-0">
        <nav className="flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0">
          <button 
            onClick={() => setActiveTab("general")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === "general" ? "bg-slate-900 text-white shadow-md" : "text-slate-600 hover:bg-slate-100"}`}
          >
            <SettingsIcon className="w-4 h-4" /> General Settings
          </button>
          <button 
            onClick={() => setActiveTab("roles")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === "roles" ? "bg-slate-900 text-white shadow-md" : "text-slate-600 hover:bg-slate-100"}`}
          >
            <Users className="w-4 h-4" /> Role Access
          </button>
          <button 
            onClick={() => setActiveTab("deployment")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === "deployment" ? "bg-slate-900 text-white shadow-md" : "text-slate-600 hover:bg-slate-100"}`}
          >
            <Server className="w-4 h-4" /> Deployment Targets
          </button>
          <button 
            onClick={() => setActiveTab("api")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === "api" ? "bg-slate-900 text-white shadow-md" : "text-slate-600 hover:bg-slate-100"}`}
          >
            <Key className="w-4 h-4" /> API Keys
          </button>
          <button 
            onClick={() => setActiveTab("notifications")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === "notifications" ? "bg-slate-900 text-white shadow-md" : "text-slate-600 hover:bg-slate-100"}`}
          >
            <Bell className="w-4 h-4" /> Notifications
          </button>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 space-y-6">
        {activeTab === "roles" && (
          <SectionPanel title="Role Management">
            <div className="space-y-4">
              {roles.map((role) => (
                <div key={role.name} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800">{role.name}</h4>
                      <p className="text-xs text-slate-500">{role.access} • {role.users} active users</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
              ))}
            </div>
          </SectionPanel>
        )}

        {activeTab === "deployment" && (
          <SectionPanel title="Infrastructure">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <Globe className="w-6 h-6 text-blue-500" />
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">Healthy</span>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800">Frontend</h4>
                  <p className="text-sm text-slate-500 mt-1">Hosted on Vercel</p>
                </div>
              </div>
              
              <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <Server className="w-6 h-6 text-purple-500" />
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">Healthy</span>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800">Backend API</h4>
                  <p className="text-sm text-slate-500 mt-1">Render / Railway instances</p>
                </div>
              </div>

              <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <Database className="w-6 h-6 text-emerald-500" />
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">Connected</span>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800">Database</h4>
                  <p className="text-sm text-slate-500 mt-1">PostgreSQL + PostGIS</p>
                </div>
              </div>

              <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <Server className="w-6 h-6 text-red-500" />
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">Connected</span>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800">Cache</h4>
                  <p className="text-sm text-slate-500 mt-1">Redis Cluster</p>
                </div>
              </div>
            </div>
          </SectionPanel>
        )}

        {activeTab === "general" && (
          <SectionPanel title="General Settings">
            <div className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Platform Name</label>
                  <input type="text" defaultValue="KSP Intelligence Center" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-slate-50 text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Default Timezone</label>
                  <select className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-slate-50 text-sm">
                    <option>Asia/Kolkata (IST)</option>
                    <option>UTC</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Data Retention Period</label>
                  <select className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-slate-50 text-sm">
                    <option>5 Years (Standard)</option>
                    <option>10 Years</option>
                    <option>Indefinite</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Language Preference</label>
                  <select className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-slate-50 text-sm">
                    <option>English (UK)</option>
                    <option>Kannada</option>
                    <option>Hindi</option>
                  </select>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end">
                <button className="px-5 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm">
                  Save Changes
                </button>
              </div>
            </div>
          </SectionPanel>
        )}

        {activeTab === "api" && (
          <SectionPanel title="API Management">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-slate-800">Active API Keys</h4>
                  <p className="text-sm text-slate-500">Manage keys for external system integrations.</p>
                </div>
                <button className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 border border-slate-200 shadow-sm">
                  <Key className="w-4 h-4" /> Generate New Key
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                      <Server className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800 text-sm">CCTNS Integration</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Last used: 2 mins ago • Expires: Never</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="px-3 py-1.5 bg-slate-100 text-slate-600 font-mono text-xs rounded-md border border-slate-200">
                      ksp_live_*******************
                    </div>
                    <button className="text-sm text-[var(--accent)] font-medium hover:text-[var(--accent-2)] transition-colors px-2">Revoke</button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                      <Globe className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800 text-sm">Emergency Response System (ERS)</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Last used: 12 hours ago • Expires: In 30 days</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="px-3 py-1.5 bg-slate-100 text-slate-600 font-mono text-xs rounded-md border border-slate-200">
                      ksp_live_*******************
                    </div>
                    <button className="text-sm text-[var(--accent)] font-medium hover:text-[var(--accent-2)] transition-colors px-2">Revoke</button>
                  </div>
                </div>
              </div>
            </div>
          </SectionPanel>
        )}

        {activeTab === "notifications" && (
          <SectionPanel title="Alerts & Notifications">
            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-800 mb-2">Delivery Channels</h4>
                
                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
                  <div>
                    <h5 className="font-medium text-slate-800 text-sm">Email Notifications</h5>
                    <p className="text-xs text-slate-500 mt-0.5">Receive daily digests and critical alerts via email.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent)]"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
                  <div>
                    <h5 className="font-medium text-slate-800 text-sm">SMS Alerts</h5>
                    <p className="text-xs text-slate-500 mt-0.5">Immediate text messages for high-severity incidents.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent)]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
                  <div>
                    <h5 className="font-medium text-slate-800 text-sm">Push Notifications</h5>
                    <p className="text-xs text-slate-500 mt-0.5">Browser and mobile app push notifications.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent)]"></div>
                  </label>
                </div>
              </div>
            </div>
          </SectionPanel>
        )}
      </div>
    </div>
  );
}
