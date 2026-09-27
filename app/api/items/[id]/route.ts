import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { serializeItem } from "@/lib/serialize";
import { sweepExpiredReservations } from "@/lib/sweep";
import { CENTER } from "@/lib/data";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  await sweepExpiredReservations();

  const { id } = await params;
  const session = await auth();

  const viewer = session?.user?.id
    ? await prisma.user.findUnique({ where: { id: session.user.id }, select: { id: true, lat: true, lng: true } })
    : null;
  const viewerCoords = viewer ?? { id: undefined, lat: CENTER[0], lng: CENTER[1] };

  const item = await prisma.item.findUnique({ where: { id }, include: { seller: true } });
  if (!item) return NextResponse.json({ error: "Listing not found" }, { status: 404 });

  const [sellerListingCount, nearbyRaw] = await Promise.all([
    prisma.item.count({ where: { sellerId: item.sellerId } }),
    prisma.item.findMany({
      where: { sellerId: { not: item.sellerId }, status: "available", id: { not: item.id } },
      include: { seller: true },
      orderBy: { createdAt: "desc" },
      take: 24,
    }),
  ]);

  const moreNearby = nearbyRaw
    .map((it) => serializeItem(it, viewerCoords))
    .sort((a, b) => a.distanceMin - b.distanceMin)
    .slice(0, 4);

  return NextResponse.json({
    item: serializeItem(item, viewerCoords),
    sellerListingCount,
    moreNearby,
  });
}
