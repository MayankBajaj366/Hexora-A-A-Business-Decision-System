import { GoogleGenerativeAI } from "@google/generative-ai";

export type Insight = { type: "warning" | "info" | "opportunity"; message: string };

export type BusinessStats = {
  revenue: number;
  purchases: number;
  totalSales: number;
  accountCount: number;
  staleAccounts: { name: string; daysSinceActivity: number; balance: number }[];
  topDebtors: { name: string; balance: number }[];
  expenseRatio: number | null; // purchases / revenue
};

/**
 * Deterministic, free, no-API-key-required analysis. This always runs and
 * guarantees the dashboard has real suggestions even before anyone sets up
 * a Gemini key.
 */
function ruleBasedInsights(stats: BusinessStats): Insight[] {
  const insights: Insight[] = [];

  if (stats.accountCount === 0) {
    return [
      {
        type: "info",
        message: "Add your first account in Account Master to start getting AI insights.",
      },
    ];
  }

  for (const acc of stats.staleAccounts.slice(0, 3)) {
    insights.push({
      type: "warning",
      message: `${acc.name} has had no activity in ${acc.daysSinceActivity} days — consider a check-in or retention offer.`,
    });
  }

  for (const debtor of stats.topDebtors.slice(0, 2)) {
    insights.push({
      type: "warning",
      message: `${debtor.name} owes ₹${debtor.balance.toLocaleString()} — following up now protects cash flow.`,
    });
  }

  if (stats.expenseRatio !== null) {
    if (stats.expenseRatio > 0.8) {
      insights.push({
        type: "warning",
        message: `Purchases are ${(stats.expenseRatio * 100).toFixed(
          0
        )}% of revenue this period — margins are getting thin.`,
      });
    } else if (stats.expenseRatio < 0.4) {
      insights.push({
        type: "opportunity",
        message: `Expense ratio is a healthy ${(stats.expenseRatio * 100).toFixed(
          0
        )}% of revenue — a good time to reinvest in growth.`,
      });
    }
  }

  if (stats.totalSales === 0) {
    insights.push({
      type: "info",
      message: "No sales recorded yet — log a Sales Entry to start tracking revenue trends.",
    });
  }

  if (insights.length === 0) {
    insights.push({
      type: "info",
      message: "Accounts look healthy — no urgent issues detected right now.",
    });
  }

  return insights;
}

/**
 * If GEMINI_API_KEY is set, ask Gemini's free tier to turn the same stats
 * into sharper, more specific business advice. Falls back to the rule-based
 * insights above on any error (missing key, rate limit, network) so the
 * feature never breaks.
 */
export async function generateInsights(stats: BusinessStats): Promise<Insight[]> {
  const fallback = ruleBasedInsights(stats);
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return fallback;

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are a business decision AI embedded in an accounting dashboard called Hexora A&A.
Given this account data, return 3-5 short, specific, actionable business suggestions.
Respond with ONLY a JSON array, no markdown, in this exact shape:
[{"type": "warning" | "info" | "opportunity", "message": "..."}]
Each message must be under 160 characters and reference concrete numbers from the data when useful.

DATA:
${JSON.stringify(stats, null, 2)}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const cleaned = text.replace(/^```json\s*|```$/g, "").trim();
    const parsed = JSON.parse(cleaned);

    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed
        .filter((i) => i?.message && ["warning", "info", "opportunity"].includes(i?.type))
        .slice(0, 5);
    }
    return fallback;
  } catch {
    return fallback;
  }
}
