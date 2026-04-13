"use client";
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('hexora_token')) {
      window.location.href = '/login';
    } else {
      setMounted(true);
    }
  }, []);

  if (!mounted) return null;

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-700">
      <h1 className="text-4xl font-extrabold text-[#0A192F] tracking-tight mb-2">Profile & AI Settings</h1>
      <p className="text-[#36454F] mb-8">Configure your business details and AI agent permissions.</p>

      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm mb-8">
        <h2 className="text-xl font-bold text-[#0A192F] mb-4">Business Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-2">Company Name</label>
            <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[#36454F] focus:outline-none focus:border-[#0A192F] focus:ring-1 focus:ring-[#0A192F] transition-all" defaultValue="Hexora Global" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-2">Owner Name</label>
            <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[#36454F] focus:outline-none focus:border-[#0A192F] focus:ring-1 focus:ring-[#0A192F] transition-all" defaultValue="" placeholder="Your Name" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-500 mb-2">Support Email (For AI Dispatch)</label>
            <input type="email" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[#36454F] focus:outline-none focus:border-[#0A192F] focus:ring-1 focus:ring-[#0A192F] transition-all" defaultValue="support@hexora.com" />
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
            {/* Toggle */}
            <div className="w-14 h-8 bg-emerald-500 rounded-full flex items-center px-1 cursor-pointer transition-colors shadow-inner">
              <div className="w-6 h-6 bg-white rounded-full translate-x-6 shadow-sm transition-transform"></div>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <div>
              <h3 className="font-medium text-[#0A192F] mb-1">Fraud & Turnover Alerts via SMS</h3>
              <p className="text-sm text-[#36454F]">Receive immediate SMS texts if suspicious transactions or extreme profit drops occur.</p>
            </div>
            {/* Toggle */}
            <div className="w-14 h-8 bg-emerald-500 rounded-full flex items-center px-1 cursor-pointer transition-colors shadow-inner">
              <div className="w-6 h-6 bg-white rounded-full translate-x-6 shadow-sm transition-transform"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex justify-end">
        <button className="bg-[#0A192F] hover:bg-[#081324] text-white px-8 py-3 rounded-xl font-medium shadow-md shadow-[#0A192F]/20 transition-all">
          Save Configuration
        </button>
      </div>
    </div>
  );
}
