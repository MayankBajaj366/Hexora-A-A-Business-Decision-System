"use client";
import { useEffect, useState } from "react";

type Alert = { id: string; type: "warning" | "info" | "opportunity"; message: string };

export default function Dashboard() {
  const [data, setData] = useState<{ total_sales: number; revenue: number; active_alerts: Alert[] }>({
    total_sales: 0,
    revenue: 0,
    active_alerts: [],
  });
  const [loading, setLoading] = useState(true);

  const load = async (refresh = false) => {
    setLoading(true);
    const res = await fetch(`/api/analytics${refresh ? "?refresh=true" : ""}`);
    if (res.ok) setData(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-700">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-4xl font-extrabold text-[#0A192F] tracking-tight">System Overview</h1>
        <button
          onClick={() => load(true)}
          disabled={loading}
          className="text-sm px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-[#0A192F] font-medium disabled:opacity-50"
        >
          {loading ? "Scanning…" : "Re-run AI scan"}
        </button>
      </div>
      <p className="text-[#36454F] mb-8">AI-driven insights for your business.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-slate-500 font-medium tracking-wide mb-2 uppercase text-xs">Total Revenue</h3>
          <p className="text-4xl font-bold text-[#0A192F]">₹{data.revenue.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-slate-500 font-medium tracking-wide mb-2 uppercase text-xs">Total Sales Entries</h3>
          <p className="text-4xl font-bold text-[#0A192F]">{data.total_sales}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-slate-500 font-medium tracking-wide mb-2 uppercase text-xs">AI Agent Status</h3>
          <p className="text-2xl font-bold text-emerald-600 flex items-center mt-2">
            <span className="h-3 w-3 rounded-full bg-emerald-500 mr-3"></span>
            Active
          </p>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#0A192F] mb-6">Autonomous Insights</h2>
        <div className="space-y-4">
          {data.active_alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-5 rounded-2xl border flex items-start space-x-4 ${
                alert.type === "warning"
                  ? "bg-orange-50 border-orange-200"
                  : alert.type === "opportunity"
                  ? "bg-emerald-50 border-emerald-200"
                  : "bg-blue-50 border-blue-200"
              }`}
            >
              <div className="flex-1">
                <h4
                  className={`font-semibold text-lg ${
                    alert.type === "warning"
                      ? "text-orange-600"
                      : alert.type === "opportunity"
                      ? "text-emerald-600"
                      : "text-[#0A192F]"
                  }`}
                >
                  {alert.type === "warning"
                    ? "Attention Needed"
                    : alert.type === "opportunity"
                    ? "Opportunity"
                    : "AI Recommendation"}
                </h4>
                <p className="text-[#36454F] mt-1">{alert.message}</p>
              </div>
            </div>
          ))}
          {data.active_alerts.length === 0 && !loading && (
            <p className="text-slate-500 italic">No active insights right now.</p>
          )}
        </div>
      </div>
    </div>
  );
}
