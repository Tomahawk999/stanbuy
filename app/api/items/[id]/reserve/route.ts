import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { serializeReservation } from "@/lib/serialize";
import { sweepExpiredReservations } from "@/lib/sweep";
import { RESERVE_WINDOW_MS } from "@/lib/data";

function genCode(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  await sweepExpiredReservations();

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ ok: false, reason: "unauthenticated" }, { status: 401 });
  }

  const { id } = await params;
  const buyer = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!buyer) return NextResponse.json({ ok: false, reason: "unauthenticated" }, { status: 401 });

  if (buyer.freezeUntil && buyer.freezeUntil.getTime() > Date.now()) {
    return NextResponse.json({ ok: false, reason: "frozen" });
  }

  const item = await prisma.item.findUnique({ where: { id } });
  if (!item || item.status !== "available") {
    return NextResponse.json({ ok: false, reason: "unavailable" });
  }
  if (item.sellerId === buyer.id) {
    return NextResponse.json({ ok: false, reason: "own-item" });
  }

  const now = new Date();
  const reservation = await prisma.$transaction(async (tx) => {
    await tx.item.update({ where: { id: item.id }, data: { status: "reserved" } });
    return tx.reservation.create({
      data: {
        itemId: item.id,
        buyerId: buyer.id,
        code: genCode(),
        status: "active",
        createdAt: now,
        expiresAt: new Date(now.getTime() + RESERVE_WINDOW_MS),
      },
    });
  });

  return NextResponse.json({ ok: true, reservation: serializeReservation(reservation) });
}
