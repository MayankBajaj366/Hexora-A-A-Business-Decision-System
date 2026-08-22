"use client";
import { signIn } from "next-auth/react";

export default function Login() {
  return (
    <div className="fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-[#FDFCFB]">
      <div className="max-w-sm w-full bg-white p-8 rounded-2xl shadow-xl border border-emerald-100 flex flex-col justify-center animate-in zoom-in-95 duration-500">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-[#0A192F] rounded-full flex items-center justify-center mb-4 shadow-lg shadow-blue-900/20">
            <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#0A192F] tracking-tight">Hexora A&A</h1>
          <p className="text-slate-500 text-sm mt-1">Sign in to access your business dashboard</p>
        </div>

        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full bg-white hover:bg-slate-50 text-[#36454F] py-3 rounded-xl font-medium transition-all border border-slate-300 shadow-sm flex justify-center items-center gap-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.9 32.3 29.4 35 24 35c-6.1 0-11-4.9-11-11s4.9-11 11-11c2.8 0 5.3 1 7.3 2.7l5.7-5.7C33.6 6.5 29 4.5 24 4.5 12.9 4.5 4 13.4 4 24.5s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-4z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16 18.9 13 24 13c2.8 0 5.3 1 7.3 2.7l5.7-5.7C33.6 6.5 29 4.5 24 4.5c-7.7 0-14.3 4.4-17.7 10.2z"/>
            <path fill="#4CAF50" d="M24 44.5c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.4-4.6 2.4-7.2 2.4-5.3 0-9.8-3.6-11.4-8.4l-6.5 5c3.3 6.6 10.1 11.4 17.9 11.4z"/>
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1 2.9-2.9 5.2-5.3 6.8l6.2 5.2C39.5 37.5 44 31.5 44 24.5c0-1.3-.1-2.7-.4-4z"/>
          </svg>
          Continue with Google
        </button>
      </div>
    </div>
  );
}
