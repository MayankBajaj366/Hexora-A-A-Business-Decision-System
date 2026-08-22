"use client";
import { useEffect, useState, useCallback } from "react";

type Group = { id: string; name: string; natureOf: string };
type Account = {
  id: string;
  name: string;
  groupId: string;
  group: Group;
  openingBalance: number;
  balance: number;
  contactEmail?: string | null;
  contactPhone?: string | null;
};
type Entry = {
  id: string;
  accountId: string;
  account: Account;
  type: "debit" | "credit";
  category: string;
  amount: number;
  narration?: string | null;
  date: string;
};

const menuData: Record<string, string[]> = {
  MASTER: ["Account Groups", "Account Master"],
  TRANSACTIONS: ["Cash/Bank Entry", "Sales Entry", "Purchase Entry", "Journal Entry"],
  DISPLAY: ["A/c Information"],
  REPORTS: ["Trial Balance"],
};

const ENTRY_CATEGORY: Record<string, string> = {
  "Cash/Bank Entry": "receipt",
  "Sales Entry": "sale",
  "Purchase Entry": "purchase",
  "Journal Entry": "journal",
};

export default function AccountsERP() {
  const [activeMenu, setActiveMenu] = useState<string | null>("MASTER");
  const [activeItem, setActiveItem] = useState<string>("Account Master");
  const [groups, setGroups] = useState<Group[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAll = useCallback(async () => {
    setLoading(true);
    const [g, a, e] = await Promise.all([
      fetch("/api/account-groups").then((r) => r.json()),
      fetch("/api/accounts").then((r) => r.json()),
      fetch("/api/entries").then((r) => r.json()),
    ]);
    setGroups(g);
    setAccounts(a);
    setEntries(e);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-700 h-full flex flex-col items-center py-6">
      <div className="mb-6 w-full text-center">
        <h1 className="text-3xl font-extrabold text-[#0A192F] tracking-tight">Hexora Core Accounting</h1>
        <p className="text-[#36454F] mt-1">Chart of accounts, ledger entries, and reports</p>
      </div>

      <div
        className="w-full bg-[#0A192F] shadow-2xl shadow-blue-900/20 rounded-xl border border-slate-200 overflow-hidden flex flex-col"
        style={{ minHeight: "650px" }}
      >
        <div className="bg-[#0A192F] text-white flex justify-between items-center px-4 py-3 text-xs font-bold tracking-widest border-b-2 border-emerald-500">
          <span className="px-4 text-emerald-400">HEXORA A&A INDUSTRIES</span>
          <span className="px-2 text-slate-400">{new Date().getFullYear()}</span>
        </div>

        <div className="bg-[#081324] flex overflow-x-auto no-scrollbar px-2 py-2 border-b border-white/5">
          {Object.keys(menuData).map((menu) => (
            <button
              key={menu}
              onClick={() => {
                setActiveMenu(activeMenu === menu ? null : menu);
              }}
              className={`px-5 py-2 font-bold text-sm tracking-wide rounded-lg transition-all mx-1 ${
                activeMenu === menu
                  ? "bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {menu}
            </button>
          ))}
        </div>

        <div className="flex-1 bg-white relative">
          {activeMenu && (
            <div className="border-b border-slate-200 bg-slate-50 flex flex-wrap px-4 py-2 gap-1">
              {menuData[activeMenu].map((item) => (
                <button
                  key={item}
                  onClick={() => setActiveItem(item)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                    activeItem === item
                      ? "bg-[#0A192F] text-white"
                      : "text-[#36454F] hover:bg-slate-200"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          )}

          <div className="p-6">
            {loading ? (
              <p className="text-slate-500">Loading…</p>
            ) : (
              <>
                {activeItem === "Account Groups" && (
                  <GroupsPanel groups={groups} onChange={loadAll} />
                )}
                {activeItem === "Account Master" && (
                  <AccountsPanel groups={groups} accounts={accounts} onChange={loadAll} />
                )}
                {["Cash/Bank Entry", "Sales Entry", "Purchase Entry", "Journal Entry"].includes(activeItem) && (
                  <EntryPanel
                    accounts={accounts}
                    category={ENTRY_CATEGORY[activeItem]}
                    label={activeItem}
                    onChange={loadAll}
                  />
                )}
                {activeItem === "A/c Information" && (
                  <AccountInfoPanel accounts={accounts} entries={entries} />
                )}
                {activeItem === "Trial Balance" && <TrialBalancePanel accounts={accounts} />}
              </>
            )}
          </div>
        </div>

        <div className="bg-[#081324] border-t border-emerald-500/30 p-2 flex justify-between items-center px-6 text-xs text-slate-500 font-mono">
          <span>HEXORA TERMINAL v2.0 [SYS: ONLINE]</span>
          <span className="flex items-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
            {accounts.length} accounts · {entries.length} entries
          </span>
        </div>
      </div>
    </div>
  );
}

function GroupsPanel({ groups, onChange }: { groups: Group[]; onChange: () => void }) {
  const [name, setName] = useState("");
  const [natureOf, setNatureOf] = useState("asset");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await fetch("/api/account-groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, natureOf }),
    });
    setName("");
    setSubmitting(false);
    onChange();
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <h3 className="font-bold text-[#0A192F] mb-3">Existing Groups</h3>
        <div className="border border-slate-200 rounded-xl divide-y">
          {groups.map((g) => (
            <div key={g.id} className="px-4 py-2 flex justify-between text-sm">
              <span className="font-medium text-[#0A192F]">{g.name}</span>
              <span className="text-slate-500 capitalize">{g.natureOf}</span>
            </div>
          ))}
          {groups.length === 0 && <p className="px-4 py-4 text-slate-400 text-sm">No groups yet.</p>}
        </div>
      </div>
      <div>
        <h3 className="font-bold text-[#0A192F] mb-3">Add Group</h3>
        <form onSubmit={submit} className="space-y-3">
          <input
            required
            placeholder="Group name e.g. Fixed Assets"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5"
          />
          <select
            value={natureOf}
            onChange={(e) => setNatureOf(e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5"
          >
            <option value="asset">Asset</option>
            <option value="liability">Liability</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
            <option value="equity">Equity</option>
          </select>
          <button
            disabled={submitting}
            className="bg-[#0A192F] text-white px-6 py-2.5 rounded-xl font-medium disabled:opacity-50"
          >
            {submitting ? "Adding…" : "Add Group"}
          </button>
        </form>
      </div>
    </div>
  );
}

function AccountsPanel({
  groups,
  accounts,
  onChange,
}: {
  groups: Group[];
  accounts: Account[];
  onChange: () => void;
}) {
  const [name, setName] = useState("");
  const [groupId, setGroupId] = useState(groups[0]?.id ?? "");
  const [openingBalance, setOpeningBalance] = useState("0");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!groupId && groups.length > 0) setGroupId(groups[0].id);
  }, [groups, groupId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupId) return;
    setSubmitting(true);
    await fetch("/api/accounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, groupId, openingBalance: Number(openingBalance) }),
    });
    setName("");
    setOpeningBalance("0");
    setSubmitting(false);
    onChange();
  };

  const remove = async (id: string) => {
    await fetch(`/api/accounts/${id}`, { method: "DELETE" });
    onChange();
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <h3 className="font-bold text-[#0A192F] mb-3">Chart of Accounts</h3>
        <div className="border border-slate-200 rounded-xl divide-y max-h-96 overflow-y-auto">
          {accounts.map((a) => (
            <div key={a.id} className="px-4 py-2.5 flex justify-between items-center text-sm">
              <div>
                <p className="font-medium text-[#0A192F]">{a.name}</p>
                <p className="text-xs text-slate-400">{a.group?.name}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={a.balance >= 0 ? "text-emerald-600 font-semibold" : "text-red-500 font-semibold"}>
                  ₹{a.balance.toLocaleString()}
                </span>
                <button onClick={() => remove(a.id)} className="text-slate-400 hover:text-red-500 text-xs">
                  Delete
                </button>
              </div>
            </div>
          ))}
          {accounts.length === 0 && <p className="px-4 py-4 text-slate-400 text-sm">No accounts yet.</p>}
        </div>
      </div>
      <div>
        <h3 className="font-bold text-[#0A192F] mb-3">Add Account</h3>
        {groups.length === 0 ? (
          <p className="text-sm text-slate-500">Create an Account Group first.</p>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <input
              required
              placeholder="Account name e.g. Acme Corp"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5"
            />
            <select
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5"
            >
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Opening balance"
              value={openingBalance}
              onChange={(e) => setOpeningBalance(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5"
            />
            <button
              disabled={submitting}
              className="bg-[#0A192F] text-white px-6 py-2.5 rounded-xl font-medium disabled:opacity-50"
            >
              {submitting ? "Adding…" : "Add Account"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function EntryPanel({
  accounts,
  category,
  label,
  onChange,
}: {
  accounts: Account[];
  category: string;
  label: string;
  onChange: () => void;
}) {
  const [accountId, setAccountId] = useState(accounts[0]?.id ?? "");
  const [type, setType] = useState<"debit" | "credit">("debit");
  const [amount, setAmount] = useState("");
  const [narration, setNarration] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!accountId && accounts.length > 0) setAccountId(accounts[0].id);
  }, [accounts, accountId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountId || !amount) return;
    setSubmitting(true);
    await fetch("/api/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accountId, type, category, amount: Number(amount), narration }),
    });
    setAmount("");
    setNarration("");
    setSubmitting(false);
    setDone(true);
    setTimeout(() => setDone(false), 2000);
    onChange();
  };

  if (accounts.length === 0) {
    return <p className="text-sm text-slate-500">Create an account in Account Master first.</p>;
  }

  return (
    <div className="max-w-md">
      <h3 className="font-bold text-[#0A192F] mb-3">{label}</h3>
      <form onSubmit={submit} className="space-y-3">
        <select
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          className="w-full border border-slate-200 rounded-xl px-4 py-2.5"
        >
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
        <div className="flex gap-3">
          <label className="flex-1 flex items-center gap-2 border border-slate-200 rounded-xl px-4 py-2.5">
            <input type="radio" checked={type === "debit"} onChange={() => setType("debit")} /> Debit
          </label>
          <label className="flex-1 flex items-center gap-2 border border-slate-200 rounded-xl px-4 py-2.5">
            <input type="radio" checked={type === "credit"} onChange={() => setType("credit")} /> Credit
          </label>
        </div>
        <input
          required
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border border-slate-200 rounded-xl px-4 py-2.5"
        />
        <input
          placeholder="Narration (optional)"
          value={narration}
          onChange={(e) => setNarration(e.target.value)}
          className="w-full border border-slate-200 rounded-xl px-4 py-2.5"
        />
        <button
          disabled={submitting}
          className="bg-[#0A192F] text-white px-6 py-2.5 rounded-xl font-medium disabled:opacity-50"
        >
          {submitting ? "Saving…" : "Save Entry"}
        </button>
        {done && <span className="ml-3 text-emerald-600 text-sm font-medium">Saved ✓</span>}
      </form>
    </div>
  );
}

function AccountInfoPanel({ accounts, entries }: { accounts: Account[]; entries: Entry[] }) {
  const [accountId, setAccountId] = useState(accounts[0]?.id ?? "");
  const account = accounts.find((a) => a.id === accountId);
  const accountEntries = entries.filter((e) => e.accountId === accountId);

  return (
    <div>
      <select
        value={accountId}
        onChange={(e) => setAccountId(e.target.value)}
        className="border border-slate-200 rounded-xl px-4 py-2.5 mb-4"
      >
        {accounts.map((a) => (
          <option key={a.id} value={a.id}>
            {a.name}
          </option>
        ))}
      </select>
      {account && (
        <p className="mb-4 text-lg">
          Balance: <span className="font-bold text-[#0A192F]">₹{account.balance.toLocaleString()}</span>
        </p>
      )}
      <div className="border border-slate-200 rounded-xl divide-y max-h-96 overflow-y-auto">
        {accountEntries.map((e) => (
          <div key={e.id} className="px-4 py-2.5 flex justify-between text-sm">
            <div>
              <p className="font-medium text-[#0A192F] capitalize">{e.category}</p>
              <p className="text-xs text-slate-400">{e.narration || "—"} · {new Date(e.date).toLocaleDateString()}</p>
            </div>
            <span className={e.type === "debit" ? "text-emerald-600 font-semibold" : "text-red-500 font-semibold"}>
              {e.type === "debit" ? "+" : "-"}₹{e.amount.toLocaleString()}
            </span>
          </div>
        ))}
        {accountEntries.length === 0 && <p className="px-4 py-4 text-slate-400 text-sm">No entries yet.</p>}
      </div>
    </div>
  );
}

function TrialBalancePanel({ accounts }: { accounts: Account[] }) {
  const totalDebit = accounts.filter((a) => a.balance >= 0).reduce((s, a) => s + a.balance, 0);
  const totalCredit = accounts.filter((a) => a.balance < 0).reduce((s, a) => s + Math.abs(a.balance), 0);

  return (
    <div>
      <h3 className="font-bold text-[#0A192F] mb-3">Trial Balance</h3>
      <table className="w-full text-sm border border-slate-200 rounded-xl overflow-hidden">
        <thead className="bg-slate-50">
          <tr>
            <th className="text-left px-4 py-2">Account</th>
            <th className="text-left px-4 py-2">Group</th>
            <th className="text-right px-4 py-2">Debit</th>
            <th className="text-right px-4 py-2">Credit</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {accounts.map((a) => (
            <tr key={a.id}>
              <td className="px-4 py-2 font-medium text-[#0A192F]">{a.name}</td>
              <td className="px-4 py-2 text-slate-500">{a.group?.name}</td>
              <td className="px-4 py-2 text-right">{a.balance >= 0 ? `₹${a.balance.toLocaleString()}` : "-"}</td>
              <td className="px-4 py-2 text-right">{a.balance < 0 ? `₹${Math.abs(a.balance).toLocaleString()}` : "-"}</td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-slate-50 font-bold">
          <tr>
            <td className="px-4 py-2" colSpan={2}>
              Total
            </td>
            <td className="px-4 py-2 text-right">₹{totalDebit.toLocaleString()}</td>
            <td className="px-4 py-2 text-right">₹{totalCredit.toLocaleString()}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
