import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/currentUser";
import { generateInsights, type BusinessStats } from "@/lib/aiInsights";

const CACHE_MINUTES = 30;

export async function GET(req: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const force = searchParams.get("refresh") === "true";

  const accounts = await prisma.account.findMany({
    where: { userId },
    include: { entries: true, group: true },
  });

  const allEntries = accounts.flatMap((a) => a.entries);

  const revenue = allEntries
    .filter((e) => e.category === "sale")
    .reduce((sum, e) => sum + e.amount, 0);
  const purchases = allEntries
    .filter((e) => e.category === "purchase")
    .reduce((sum, e) => sum + e.amount, 0);
  const totalSales = allEntries.filter((e) => e.category === "sale").length;

  const now = Date.now();
  const staleAccounts = accounts
    .map((acc) => {
      const lastEntry = acc.entries.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )[0];
      const daysSinceActivity = lastEntry
        ? Math.floor((now - new Date(lastEntry.date).getTime()) / 86400000)
        : Math.floor((now - new Date(acc.createdAt).getTime()) / 86400000);
      const debit = acc.entries.filter((e) => e.type === "debit").reduce((s, e) => s + e.amount, 0);
      const credit = acc.entries.filter((e) => e.type === "credit").reduce((s, e) => s + e.amount, 0);
      return {
        name: acc.name,
        daysSinceActivity,
        balance: acc.openingBalance + debit - credit,
      };
    })
    .filter((a) => a.daysSinceActivity >= 30)
    .sort((a, b) => b.daysSinceActivity - a.daysSinceActivity);

  const topDebtors = accounts
    .filter((a) => a.group.natureOf === "asset")
    .map((acc) => {
      const debit = acc.entries.filter((e) => e.type === "debit").reduce((s, e) => s + e.amount, 0);
      const credit = acc.entries.filter((e) => e.type === "credit").reduce((s, e) => s + e.amount, 0);
      return { name: acc.name, balance: acc.openingBalance + debit - credit };
    })
    .filter((a) => a.balance > 0)
    .sort((a, b) => b.balance - a.balance)
    .slice(0, 5);

  const stats: BusinessStats = {
    revenue,
    purchases,
    totalSales,
    accountCount: accounts.length,
    staleAccounts,
    topDebtors,
    expenseRatio: revenue > 0 ? purchases / revenue : null,
  };

  // Reuse cached insights if they're recent, to stay comfortably inside
  // the free AI tier's rate limits.
  let insights;
  if (!force) {
    const cutoff = new Date(now - CACHE_MINUTES * 60 * 1000);
    const cached = await prisma.aiInsight.findMany({
      where: { userId, createdAt: { gte: cutoff } },
      orderBy: { createdAt: "desc" },
      take: 5,
    });
    if (cached.length > 0) insights = cached;
  }

  if (!insights) {
    const fresh = await generateInsights(stats);
    await prisma.aiInsight.deleteMany({ where: { userId } });
    await prisma.aiInsight.createMany({
      data: fresh.map((i) => ({ userId, type: i.type, message: i.message })),
    });
    insights = await prisma.aiInsight.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
  }

  return NextResponse.json({
    total_sales: totalSales,
    revenue,
    active_alerts: insights.map((i) => ({ id: i.id, type: i.type, message: i.message })),
  });
}
