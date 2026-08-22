import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/currentUser";

export async function GET() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const groups = await prisma.accountGroup.findMany({
    where: { userId },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(groups);
}

export async function POST(req: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const body = await req.json();
  if (!body.name || !body.natureOf) {
    return NextResponse.json({ error: "name and natureOf are required" }, { status: 400 });
  }

  const group = await prisma.accountGroup.create({
    data: { userId, name: body.name, natureOf: body.natureOf },
  });
  return NextResponse.json(group, { status: 201 });
}
