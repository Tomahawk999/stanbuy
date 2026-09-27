import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { serializeReservation } from "@/lib/serialize";
import { sweepExpiredReservations } from "@/lib/sweep";

export async function GET() {
  await sweepExpiredReservations();

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ authenticated: false });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      savedItems: { select: { itemId: true } },
      reservations: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!user) return NextResponse.json({ authenticated: false });

  return NextResponse.json({
    authenticated: true,
    id: user.id,
    name: user.name,
    email: user.email,
    neighborhood: user.neighborhood,
    memberSince: user.createdAt.getFullYear(),
    reliabilityScore: user.reliabilityScore,
    freezeUntil: user.freezeUntil ? user.freezeUntil.getTime() : null,
    savedIds: user.savedItems.map((s) => s.itemId),
    reservations: user.reservations.map(serializeReservation),
  });
}
