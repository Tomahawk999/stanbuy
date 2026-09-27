import { Category } from "./types";

export const CATEGORIES: { id: Category | "all"; label: string }[] = [
  { id: "all", label: "All categories" },
  { id: "bakery", label: "Bakery" },
  { id: "produce", label: "Produce" },
  { id: "cooked", label: "Cooked meals" },
  { id: "dairy", label: "Dairy" },
  { id: "pantry", label: "Pantry" },
];

export const CATEGORY_IMAGES: Record<Category, string> = {
  bakery: "/category-bakery.jpg",
  produce: "/category-produce.jpg",
  cooked: "/category-cooked.jpg",
  dairy: "/category-dairy.jpg",
  pantry: "/category-pantry.jpg",
  other: "/category-pantry.jpg",
};

export const NEIGHBORHOOD = "Palo Alto";
export const CENTER: [number, number] = [37.4443, -122.1598];

export const RESERVE_WINDOW_MS = 60 * 60 * 1000;
export const NO_SHOW_PENALTY = 15;
export const FREEZE_THRESHOLD = 80;
export const FREEZE_DAYS = 7;
