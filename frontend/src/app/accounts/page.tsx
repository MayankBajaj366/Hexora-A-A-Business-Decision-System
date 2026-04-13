"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

// Extracted from the provided classic ERP screenshots
const menuData: Record<string, string[]> = {
  MASTER: [
    "Account Master", "Account Groups", "Items Master", 
    "Item Groups", "Place Master", "Repre. Master", "Sales Opening"
  ],
  TRANSACTIONS: [
    "Cash/Bank Entry", "Sales/Returns Entry", "Purchases/Returns Entry", 
    "Journal Entry", "Daily Receipts/Issues", "Sales Inv.Adjustment", 
    "Purchase Inv.Adjustment", "Commission Sales"
  ],
  DISPLAY: [
    "A/c Information", "Group Information", "A/c (Date)", "Stock Information"
  ],
  REPORTS: [
    "Day Books/Ledger", "Trial/Group Balance", "Sales Reports", 
    "Purchase Reports", "MIS Reports", "Code Lists", 
    "Stock Reports", "VAT REPORTS", "GST REPORTS"
  ],
  UTILITIES: [
    "Backup", "Restore", "Indexing", "Setup", "Checkup", "Create O..."
  ]
};

export default function AccountsERP() {
  const [activeMenu, setActiveMenu] = useState<string | null>("REPORTS");
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
    <div className="max-w-6xl mx-auto animate-in fade-in duration-700 h-full flex flex-col items-center py-6">
      
      <div className="mb-6 w-full text-center">
         <h1 className="text-3xl font-extrabold text-[#0A192F] tracking-tight">Hexora Core Accounting</h1>
         <p className="text-[#36454F] mt-1">Advanced ERP Module</p>
      </div>

      <div className="w-full bg-[#0A192F] shadow-2xl shadow-blue-900/20 rounded-xl border border-slate-200 overflow-hidden flex flex-col" style={{ minHeight: '650px' }}>
        
        {/* Terminal Header Bar (Homage to the classic UI lines) */}
        <div className="bg-[#0A192F] text-white flex justify-between items-center px-4 py-3 text-xs font-bold tracking-widest border-b-2 border-emerald-500">
          <div className="flex-1 border-b border-white/20 mr-4"></div>
          <span className="px-4 text-emerald-400">HEXORA A&A INDUSTRIES</span>
          <div className="flex-1 border-b border-white/20 mx-4"></div>
          <span className="px-2 text-slate-400">FA=2025-2026</span>
          <div className="flex-1 border-b border-white/20 ml-4"></div>
        </div>

        {/* Top Navbar Menu */}
        <div className="bg-[#081324] flex overflow-x-auto no-scrollbar justify-center sm:justify-start px-2 py-2 border-b border-white/5">
           {Object.keys(menuData).map((menu) => (
              <button 
                key={menu}
                onMouseEnter={() => setActiveMenu(menu)}
                onClick={() => setActiveMenu(activeMenu === menu ? null : menu)}
                className={`px-5 py-2 font-bold text-sm tracking-wide rounded-lg transition-all mx-1 
                  ${activeMenu === menu 
                    ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
              >
                {menu}
              </button>
           ))}
           <div className="flex-1"></div>
           <Link href="/">
              <button className="px-6 py-2 font-bold text-sm tracking-wide text-slate-400 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-all mx-1">
                EXIT
              </button>
           </Link>
        </div>

        {/* Main Content Workspace */}
        <div className="flex-1 bg-gradient-to-br from-[#0A192F] to-[#0f2343] relative p-8 overflow-hidden">
           
           {/* Dropdown Menu Container */}
           {activeMenu && (
             <div className="absolute top-4 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-1/4 lg:left-1/3 max-w-sm w-full bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-2 transition-all animate-in fade-in slide-in-from-top-4 duration-300 z-10">
                <div className="bg-[#FDFCFB] rounded-xl overflow-hidden border-2 border-emerald-500 shadow-inner">
                   {menuData[activeMenu].map((item, idx) => (
                     <button key={idx} className="w-full text-left px-6 py-3 text-[#36454F] font-semibold hover:bg-emerald-50 hover:text-emerald-700 hover:pl-8 transition-all border-b border-slate-100 last:border-0 group flex items-center justify-between">
                        {item}
                        <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-500 transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                     </button>
                   ))}
                </div>
             </div>
           )}

           {/* Subtle Background Watermark */}
           <div className="absolute inset-0 pointer-events-none opacity-[0.02] flex items-center justify-center">
              <svg className="w-full h-full p-20 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
           </div>
        </div>

        {/* Bottom Status Bar */}
        <div className="bg-[#081324] border-t border-emerald-500/30 p-2 flex justify-between items-center px-6 text-xs text-slate-500 font-mono">
           <span>HEXORA TERMINAL v1.0 [SYS: ONLINE]</span>
           <span className="flex items-center">
             <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
             AWAITING INPUT...
           </span>
        </div>
      </div>
    </div>
  );
}
