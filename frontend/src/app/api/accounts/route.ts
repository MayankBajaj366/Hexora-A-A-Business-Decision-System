import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/currentUser";

export async function GET() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const accounts = await prisma.account.findMany({
    where: { userId },
    include: {
      group: true,
      entries: { orderBy: { date: "desc" }, take: 5 },
    },
    orderBy: { name: "asc" },
  });

  // Compute a running balance for each account: opening balance + debits - credits
  const withBalance = await Promise.all(
    accounts.map(async (acc) => {
      const sums = await prisma.ledgerEntry.groupBy({
        by: ["type"],
        where: { accountId: acc.id },
        _sum: { amount: true },
      });
      const debit = sums.find((s) => s.type === "debit")?._sum.amount ?? 0;
      const credit = sums.find((s) => s.type === "credit")?._sum.amount ?? 0;
      return { ...acc, balance: acc.openingBalance + debit - credit };
    })
  );

  return NextResponse.json(withBalance);
}

export async function POST(req: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const body = await req.json();
  if (!body.name || !body.groupId) {
    return NextResponse.json({ error: "name and groupId are required" }, { status: 400 });
  }

  const group = await prisma.accountGroup.findFirst({ where: { id: body.groupId, userId } });
  if (!group) return NextResponse.json({ error: "Invalid group" }, { status: 400 });

  const account = await prisma.account.create({
    data: {
      userId,
      groupId: body.groupId,
      name: body.name,
      openingBalance: Number(body.openingBalance) || 0,
      contactEmail: body.contactEmail || null,
      contactPhone: body.contactPhone || null,
    },
  });
  return NextResponse.json(account, { status: 201 });
}
