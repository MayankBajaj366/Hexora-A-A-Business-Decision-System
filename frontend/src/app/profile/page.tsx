"use client";
import { useEffect, useState } from "react";

type Profile = {
  companyName: string;
  ownerName: string;
  supportEmail: string;
  autoEmails: boolean;
  fraudAlerts: boolean;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((u) =>
        setProfile({
          companyName: u.companyName ?? "",
          ownerName: u.ownerName ?? "",
          supportEmail: u.supportEmail ?? "",
          autoEmails: u.autoEmails ?? true,
          fraudAlerts: u.fraudAlerts ?? true,
        })
      );
  }, []);

  const save = async () => {
    if (!profile) return;
    setSaving(true);
    setSaved(false);
    await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!profile) return <p className="text-slate-500">Loading…</p>;

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-700">
      <h1 className="text-4xl font-extrabold text-[#0A192F] tracking-tight mb-2">Profile & AI Settings</h1>
      <p className="text-[#36454F] mb-8">Configure your business details and AI agent permissions.</p>

      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm mb-8">
        <h2 className="text-xl font-bold text-[#0A192F] mb-4">Business Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-2">Company Name</label>
            <input
              type="text"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[#36454F] focus:outline-none focus:border-[#0A192F] focus:ring-1 focus:ring-[#0A192F] transition-all"
              value={profile.companyName}
              onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-2">Owner Name</label>
            <input
              type="text"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[#36454F] focus:outline-none focus:border-[#0A192F] focus:ring-1 focus:ring-[#0A192F] transition-all"
              value={profile.ownerName}
              onChange={(e) => setProfile({ ...profile, ownerName: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-500 mb-2">Support Email (For AI Dispatch)</label>
            <input
              type="email"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[#36454F] focus:outline-none focus:border-[#0A192F] focus:ring-1 focus:ring-[#0A192F] transition-all"
              value={profile.supportEmail}
              onChange={(e) => setProfile({ ...profile, supportEmail: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <h2 className="text-xl font-bold text-[#0A192F] mb-6">AI Agent Permissions</h2>
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-6">
            <div>
              <h3 className="font-medium text-[#0A192F] mb-1">Autonomous Relationship Emails</h3>
              <p className="text-sm text-[#36454F]">Allow AI to formulate and send check-ins or discounts to low-scoring clients.</p>
            </div>
            <button
              onClick={() => setProfile({ ...profile, autoEmails: !profile.autoEmails })}
              className={`w-14 h-8 rounded-full flex items-center px-1 cursor-pointer transition-colors shadow-inner ${
                profile.autoEmails ? "bg-emerald-500 justify-end" : "bg-slate-300 justify-start"
              }`}
            >
              <div className="w-6 h-6 bg-white rounded-full shadow-sm"></div>
            </button>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <h3 className="font-medium text-[#0A192F] mb-1">Fraud & Turnover Alerts</h3>
              <p className="text-sm text-[#36454F]">Get flagged in the dashboard if suspicious transactions or steep drops occur.</p>
            </div>
            <button
              onClick={() => setProfile({ ...profile, fraudAlerts: !profile.fraudAlerts })}
              className={`w-14 h-8 rounded-full flex items-center px-1 cursor-pointer transition-colors shadow-inner ${
                profile.fraudAlerts ? "bg-emerald-500 justify-end" : "bg-slate-300 justify-start"
              }`}
            >
              <div className="w-6 h-6 bg-white rounded-full shadow-sm"></div>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end items-center gap-4">
        {saved && <span className="text-emerald-600 text-sm font-medium">Saved ✓</span>}
        <button
          onClick={save}
          disabled={saving}
          className="bg-[#0A192F] hover:bg-[#081324] text-white px-8 py-3 rounded-xl font-medium shadow-md shadow-[#0A192F]/20 transition-all disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save Configuration"}
        </button>
      </div>
    </div>
  );
}
