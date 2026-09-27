import type { Item as DbItem, Reservation as DbReservation, User } from "./generated/prisma/client";
import type { Item, Reservation } from "./types";
import { walkMinutes } from "./geo";

export type ItemWithSeller = DbItem & { seller: User };

export function serializeItem(item: ItemWithSeller, viewer: { id?: string; lat: number; lng: number }): Item {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    quantity: item.quantity,
    image: item.image ?? undefined,
    seller: item.seller.name,
    sellerScore: item.seller.reliabilityScore,
    neighborhood: item.neighborhood,
    distanceMin: walkMinutes([viewer.lat, viewer.lng], [item.lat, item.lng]),
    lat: item.lat,
    lng: item.lng,
    category: item.category as Item["category"],
    status: item.status as Item["status"],
    mine: viewer.id === item.sellerId,
    createdAt: item.createdAt.getTime(),
  };
}

export function serializeReservation(r: DbReservation): Reservation {
  return {
    id: r.id,
    itemId: r.itemId,
    code: r.code,
    createdAt: r.createdAt.getTime(),
    expiresAt: r.expiresAt.getTime(),
    status: r.status as Reservation["status"],
  };
}
