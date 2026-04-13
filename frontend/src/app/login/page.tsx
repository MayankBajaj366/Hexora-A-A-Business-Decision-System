"use client";
import { useState } from 'react';
import axios from 'axios';

export default function Login() {
  const [username, setUsername] = useState('A');
  const [password, setPassword] = useState('A');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const res = await axios.post(`${apiUrl}/login`, { username, password });
      localStorage.setItem('hexora_token', res.data.access_token);
      window.location.href = '/';
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-[#FDFCFB]">
       <div className="max-w-sm w-full bg-white p-8 rounded-2xl shadow-xl border border-emerald-100 flex flex-col justify-center animate-in zoom-in-95 duration-500">
          <div className="text-center mb-8">
             <div className="mx-auto w-16 h-16 bg-[#0A192F] rounded-full flex items-center justify-center mb-4 shadow-lg shadow-blue-900/20">
                <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
             </div>
             <h1 className="text-2xl font-bold text-[#0A192F] tracking-tight">Hexora A&A</h1>
             <p className="text-slate-500 text-sm mt-1">Owner Authentication Required</p>
          </div>
          
          {error && <p className="text-red-500 text-sm mb-4 text-center p-2 bg-red-50 rounded-lg border border-red-100">{error}</p>}
          
          <form onSubmit={handleLogin} className="space-y-4">
             <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">Username</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[#36454F] font-bold focus:outline-none focus:border-[#0A192F] focus:ring-1 focus:ring-[#0A192F] transition-all" required />
             </div>
             <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[#36454F] font-bold tracking-widest focus:outline-none focus:border-[#0A192F] focus:ring-1 focus:ring-[#0A192F] transition-all" required />
             </div>
             <button type="submit" className="w-full bg-[#0A192F] hover:bg-[#081324] text-white py-3 rounded-xl font-medium transition-all mt-6 shadow-md shadow-[#0A192F]/20 flex justify-center items-center">
                Access System
                <svg className="w-4 h-4 ml-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
             </button>
          </form>
       </div>
    </div>
  );
}
