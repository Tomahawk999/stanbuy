import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(_req: Request, { params }: { params: Promise<{ itemId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const { itemId } = await params;
  const item = await prisma.item.findUnique({ where: { id: itemId }, select: { id: true } });
  if (!item) return NextResponse.json({ error: "Listing not found" }, { status: 404 });

  const existing = await prisma.savedItem.findUnique({
    where: { userId_itemId: { userId: session.user.id, itemId } },
  });

  if (existing) {
    await prisma.savedItem.delete({ where: { id: existing.id } });
    return NextResponse.json({ saved: false });
  }

  await prisma.savedItem.create({ data: { userId: session.user.id, itemId } });
  return NextResponse.json({ saved: true });
}
