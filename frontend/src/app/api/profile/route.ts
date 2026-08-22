import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/currentUser";

export async function GET() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { id: userId } });
  return NextResponse.json(user);
}

export async function PUT(req: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const body = await req.json();
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      companyName: body.companyName,
      ownerName: body.ownerName,
      supportEmail: body.supportEmail,
      autoEmails: !!body.autoEmails,
      fraudAlerts: !!body.fraudAlerts,
    },
  });
  return NextResponse.json(user);
}
