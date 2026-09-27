import { prisma } from "./prisma";
import { NO_SHOW_PENALTY, FREEZE_THRESHOLD, FREEZE_DAYS } from "./data";

// Lazily expires overdue reservations and applies the no-show penalty.
// Runs at the top of the read endpoints instead of a background cron job.
export async function sweepExpiredReservations(): Promise<void> {
  const now = new Date();
  const expired = await prisma.reservation.findMany({
    where: { status: "active", expiresAt: { lte: now } },
  });
  if (expired.length === 0) return;

  await prisma.$transaction([
    ...expired.map((r) => prisma.reservation.update({ where: { id: r.id }, data: { status: "expired" } })),
    ...expired.map((r) => prisma.item.update({ where: { id: r.itemId }, data: { status: "available" } })),
  ]);

  const missesByBuyer = new Map<string, number>();
  for (const r of expired) {
    missesByBuyer.set(r.buyerId, (missesByBuyer.get(r.buyerId) ?? 0) + 1);
  }

  for (const [buyerId, misses] of missesByBuyer) {
    const user = await prisma.user.findUnique({ where: { id: buyerId } });
    if (!user) continue;
    const newScore = Math.max(0, user.reliabilityScore - misses * NO_SHOW_PENALTY);
    await prisma.user.update({
      where: { id: buyerId },
      data: {
        reliabilityScore: newScore,
        freezeUntil: newScore < FREEZE_THRESHOLD ? new Date(Date.now() + FREEZE_DAYS * 24 * 60 * 60 * 1000) : user.freezeUntil,
      },
    });
  }
}
