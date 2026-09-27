import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const { id } = await params;
  const reservation = await prisma.reservation.findUnique({ where: { id } });
  if (!reservation || reservation.status !== "active") {
    return NextResponse.json({ error: "Reservation not found or already resolved" }, { status: 404 });
  }
  if (reservation.buyerId !== session.user.id) {
    return NextResponse.json({ error: "This reservation belongs to someone else" }, { status: 403 });
  }

  await prisma.$transaction([
    prisma.reservation.update({ where: { id: reservation.id }, data: { status: "picked_up" } }),
    prisma.item.update({ where: { id: reservation.itemId }, data: { status: "claimed" } }),
  ]);

  return NextResponse.json({ ok: true });
}
