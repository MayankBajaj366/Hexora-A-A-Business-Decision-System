"use client";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/accounts", label: "Accounts" },
  { href: "/profile", label: "Profile Setup" },
];

export default function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  if (pathname === "/login") return null;

  return (
    <div className="w-64 border-r border-blue-900/50 bg-[#0A192F] flex flex-col items-center py-8">
      <div className="text-2xl font-bold text-white mb-1">Hexora A&A</div>
      <div className="text-xs text-blue-300 mb-8 text-center px-2">Accounts & Analysis</div>

      {session?.user && (
        <div className="flex items-center space-x-3 mb-8 px-4 w-full">
          {session.user.image && (
            <Image
              src={session.user.image}
              alt={session.user.name ?? "User"}
              width={36}
              height={36}
              className="rounded-full border border-emerald-400"
            />
          )}
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{session.user.name}</p>
            <p className="text-xs text-slate-400 truncate">{session.user.email}</p>
          </div>
        </div>
      )}

      <nav className="w-full flex-1 px-4 space-y-2 text-slate-300">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`flex items-center space-x-3 w-full py-3 px-4 rounded-xl transition-colors ${
              pathname === l.href ? "bg-blue-800 text-white" : "hover:bg-blue-800"
            }`}
          >
            <span>{l.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto px-4 w-full space-y-3">
        <div className="bg-blue-800/50 rounded-xl p-4 flex items-center justify-center space-x-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-sm font-medium text-slate-300">Agents Active</span>
        </div>
        {session?.user && (
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full text-center text-sm text-slate-400 hover:text-red-400 py-2 transition-colors"
          >
            Sign out
          </button>
        )}
      </div>
    </div>
  );
}
