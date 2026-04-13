"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [data, setData] = useState({ total_sales: 0, revenue: 0, active_alerts: [] });

  useEffect(() => {
    const token = localStorage.getItem('hexora_token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    axios.get(`${apiUrl}/analytics`, { headers: { 'x-user-id': token } })
      .then(res => setData(res.data))
      .catch(err => {
        if (err.response?.status === 401) window.location.href = '/login';
        console.error(err);
      });
  }, []);

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-700">
      <h1 className="text-4xl font-extrabold text-[#0A192F] mb-2 tracking-tight">System Overview</h1>
      <p className="text-[#36454F] mb-8">AI-driven insights for your business.</p>
      
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden group hover:border-[#0A192F]/30 transition-all">
          <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <h3 className="text-slate-500 font-medium tracking-wide mb-2 uppercase text-xs z-10 relative">Total Revenue</h3>
          <p className="text-4xl font-bold text-[#0A192F] z-10 relative">
            ${data.revenue.toLocaleString()}
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden group hover:border-[#0A192F]/30 transition-all">
          <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <h3 className="text-slate-500 font-medium tracking-wide mb-2 uppercase text-xs z-10 relative">Total Sales (Past 90d)</h3>
          <p className="text-4xl font-bold text-[#0A192F] z-10 relative">
            {data.total_sales}
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden group hover:border-emerald-300 transition-all">
          <div className="absolute inset-0 bg-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <h3 className="text-slate-500 font-medium tracking-wide mb-2 uppercase text-xs z-10 relative">AI Agent Status</h3>
          <p className="text-2xl font-bold text-emerald-600 flex items-center mt-2 z-10 relative">
            <span className="h-3 w-3 rounded-full bg-emerald-500 mr-3 animate-ping absolute"></span>
            <span className="h-3 w-3 rounded-full bg-emerald-500 mr-3"></span>
            Active
          </p>
        </div>
      </div>

      {/* AI System Alerts */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#0A192F] mb-6 flex items-center">
          <svg className="w-6 h-6 mr-3 text-[#0A192F]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          Autonomous Insights
        </h2>
        <div className="space-y-4">
          {data.active_alerts.map((alert: any) => (
            <div key={alert.id} className={`p-5 rounded-2xl border flex items-start space-x-4
              ${alert.type === 'warning' ? 'bg-orange-50 border-orange-200' : 'bg-blue-50 border-blue-200'}
              hover:shadow-md transition-all cursor-pointer`}>
              <div className="mt-1">
                {alert.type === 'warning' && (
                  <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                )}
                {alert.type === 'info' && (
                  <svg className="w-6 h-6 text-[#0A192F]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                )}
              </div>
              <div className="flex-1">
                <h4 className={`font-semibold text-lg ${alert.type === 'warning' ? 'text-orange-600' : 'text-[#0A192F]'}`}>
                  {alert.type === 'warning' ? 'Attention Needed' : 'AI Recommendation'}
                </h4>
                <p className="text-[#36454F] mt-1">{alert.message}</p>
              </div>
              <button className="px-4 py-2 bg-[#0A192F] hover:bg-[#081324] text-white rounded-lg text-sm transition-colors border border-[#0A192F]">
                Take Action
              </button>
            </div>
          ))}
          {data.active_alerts.length === 0 && (
             <p className="text-slate-500 italic">No active insights right now.</p>
          )}
        </div>
      </div>
    </div>
  );
}
