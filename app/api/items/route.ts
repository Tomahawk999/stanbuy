import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { serializeItem } from "@/lib/serialize";
import { sweepExpiredReservations } from "@/lib/sweep";
import { CATEGORIES, CENTER } from "@/lib/data";

const VALID_CATEGORIES = new Set(CATEGORIES.map((c) => c.id).filter((id) => id !== "all"));

export async function GET(req: Request) {
  await sweepExpiredReservations();

  const session = await auth();
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");

  const viewer = session?.user?.id
    ? await prisma.user.findUnique({ where: { id: session.user.id }, select: { id: true, lat: true, lng: true } })
    : null;
  const viewerCoords = viewer ?? { id: undefined, lat: CENTER[0], lng: CENTER[1] };

  const items = await prisma.item.findMany({
    where: category && category !== "all" ? { category } : undefined,
    include: { seller: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(items.map((item) => serializeItem(item, viewerCoords)));
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in to publish a listing" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const { title, description, category, neighborhood, quantity, image } = (body ?? {}) as Record<string, unknown>;

  if (typeof title !== "string" || !title.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }
  if (typeof description !== "string" || !description.trim()) {
    return NextResponse.json({ error: "Description is required" }, { status: 400 });
  }
  if (typeof category !== "string" || !VALID_CATEGORIES.has(category as never)) {
    return NextResponse.json({ error: "Choose a valid category" }, { status: 400 });
  }
  const qty = Number(quantity);
  if (!Number.isFinite(qty) || qty < 1) {
    return NextResponse.json({ error: "Quantity must be at least 1" }, { status: 400 });
  }

  const seller = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!seller) return NextResponse.json({ error: "Account not found" }, { status: 404 });

  const item = await prisma.item.create({
    data: {
      title: title.trim(),
      description: description.trim(),
      quantity: Math.round(qty),
      image: typeof image === "string" && image ? image : null,
      category,
      neighborhood: typeof neighborhood === "string" && neighborhood.trim() ? neighborhood.trim() : seller.neighborhood,
      lat: seller.lat + (Math.random() - 0.5) * 0.003,
      lng: seller.lng + (Math.random() - 0.5) * 0.003,
      sellerId: seller.id,
    },
    include: { seller: true },
  });

  return NextResponse.json(serializeItem(item, { id: seller.id, lat: seller.lat, lng: seller.lng }), { status: 201 });
}
