import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/currentUser";

export async function GET(req: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const accountId = searchParams.get("accountId");

  const entries = await prisma.ledgerEntry.findMany({
    where: { userId, ...(accountId ? { accountId } : {}) },
    include: { account: true },
    orderBy: { date: "desc" },
    take: 200,
  });
  return NextResponse.json(entries);
}

export async function POST(req: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const body = await req.json();
  const { accountId, type, category, amount, narration } = body;

  if (!accountId || !["debit", "credit"].includes(type) || !amount) {
    return NextResponse.json(
      { error: "accountId, type (debit|credit), and amount are required" },
      { status: 400 }
    );
  }

  const account = await prisma.account.findFirst({ where: { id: accountId, userId } });
  if (!account) return NextResponse.json({ error: "Invalid account" }, { status: 400 });

  const entry = await prisma.ledgerEntry.create({
    data: {
      userId,
      accountId,
      type,
      category: category || "journal",
      amount: Number(amount),
      narration: narration || null,
    },
  });
  return NextResponse.json(entry, { status: 201 });
}
