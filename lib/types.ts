export type Category = "bakery" | "produce" | "cooked" | "dairy" | "pantry" | "other";

export type ItemStatus = "available" | "reserved" | "claimed" | "expired";

export interface Item {
  id: string;
  title: string;
  description: string;
  quantity: number;
  image?: string;
  seller: string;
  sellerScore: number;
  neighborhood: string;
  distanceMin: number;
  lat: number;
  lng: number;
  category: Category;
  status: ItemStatus;
  mine: boolean;
  createdAt: number;
}

export interface Reservation {
  id: string;
  itemId: string;
  code: string;
  createdAt: number;
  expiresAt: number;
  status: "active" | "picked_up" | "expired";
}
