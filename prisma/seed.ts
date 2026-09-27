import { config } from "dotenv";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

config({ path: ".env" });
config({ path: ".env.local", override: true });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");
const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

// Seed accounts have no password (passwordHash: null) — they're browsable
// seller identities only, nobody can sign in as them. Safe to run against
// a real production database.

const SELLERS = [
  { key: "tom", email: "tom@stanbuy.app", name: "Tom", neighborhood: "Elm Street", lat: 37.44564, lng: -122.16392, score: 98 },
  { key: "javier", email: "javier@stanbuy.app", name: "Javier R.", neighborhood: "Riverside", lat: 37.44, lng: -122.1672, score: 91 },
  { key: "ana", email: "ana@stanbuy.app", name: "Ana P.", neighborhood: "Oak Avenue", lat: 37.4473, lng: -122.1643, score: 100 },
  { key: "david", email: "david@stanbuy.app", name: "David O.", neighborhood: "Birchwood", lat: 37.4482, lng: -122.1597, score: 87 },
  { key: "priya", email: "priya@stanbuy.app", name: "Priya S.", neighborhood: "Downtown", lat: 37.4464, lng: -122.1632, score: 96 },
  { key: "sam", email: "sam@stanbuy.app", name: "Sam K.", neighborhood: "Willow Park", lat: 37.4431, lng: -122.1689, score: 94 },
] as const;

type SellerKey = (typeof SELLERS)[number]["key"];

const ITEMS: {
  seller: SellerKey;
  title: string;
  description: string;
  quantity: number;
  neighborhood: string;
  lat: number;
  lng: number;
  category: string;
  status: "available" | "reserved" | "claimed";
  ageMs: number;
}[] = [
  { seller: "tom", title: "Box of today's croissants", description: "8 croissants left over from this morning's brunch. Perfectly good, just too many for the house to finish. Great for breakfast over two or three days.", quantity: 8, neighborhood: "Elm Street", lat: 37.4467, lng: -122.1656, category: "bakery", status: "available", ageMs: 1000 * 60 * 30 },
  { seller: "tom", title: "Chicken and rice, serves 4", description: "Cooked this in our shared kitchen and made way too much. Still warm, in a sealed container. Happy to split if you don't need all of it.", quantity: 4, neighborhood: "Maple Court", lat: 37.4458, lng: -122.1625, category: "cooked", status: "claimed", ageMs: 1000 * 60 * 60 * 5 },
  { seller: "javier", title: "Mixed market vegetables", description: "A mix of peppers, courgettes and tomatoes from my CSA box, more than I can get through before they turn. All in great condition.", quantity: 1, neighborhood: "Riverside", lat: 37.44, lng: -122.1672, category: "produce", status: "available", ageMs: 1000 * 60 * 90 },
  { seller: "ana", title: "Sourdough loaf, pack of 2", description: "Baked for a house dinner yesterday, still fresh. Great for toast or sandwiches over the next few days.", quantity: 2, neighborhood: "Oak Avenue", lat: 37.4473, lng: -122.1643, category: "bakery", status: "available", ageMs: 1000 * 60 * 20 },
  { seller: "tom", title: "Greek yogurt, pack of 6", description: "Bought too many on my last Trader Joe's run. Sealed, well within date.", quantity: 6, neighborhood: "Cedar Heights", lat: 37.4424, lng: -122.1604, category: "dairy", status: "available", ageMs: 1000 * 60 * 45 },
  { seller: "david", title: "Fresh pasta, homemade", description: "Made a big batch of fresh tagliatelle for a dinner party, more than I can freeze. Uncooked, ready to boil.", quantity: 1, neighborhood: "Birchwood", lat: 37.4482, lng: -122.1597, category: "pantry", status: "available", ageMs: 1000 * 60 * 60 * 2 },
  { seller: "priya", title: "Bagels, everything & plain, dozen", description: "Ordered too many for a floor event in FloMo. Still in the sealed bakery bag from this morning.", quantity: 12, neighborhood: "Downtown", lat: 37.4464, lng: -122.1632, category: "bakery", status: "available", ageMs: 1000 * 60 * 12 },
  { seller: "tom", title: "Banana bread, one loaf", description: "Baked last night for a study group that didn't show. Wrapped and untouched.", quantity: 1, neighborhood: "Elm Street", lat: 37.4468, lng: -122.1658, category: "bakery", status: "available", ageMs: 1000 * 60 * 60 * 4 },
  { seller: "javier", title: "Farmers market apples, half bushel", description: "Picked these up at the farmers market and way overestimated how many we'd eat. Crisp and fresh.", quantity: 10, neighborhood: "Riverside", lat: 37.4403, lng: -122.1668, category: "produce", status: "available", ageMs: 1000 * 60 * 60 * 3 },
  { seller: "sam", title: "Extra zucchini and squash", description: "Our co-op garden had a big harvest this week. Free to a good home before it goes soft.", quantity: 6, neighborhood: "Willow Park", lat: 37.4431, lng: -122.1689, category: "produce", status: "available", ageMs: 1000 * 60 * 50 },
  { seller: "david", title: "Vegetable stir fry, serves 3", description: "Cooked for a house dinner that got cancelled last minute. In the fridge since this evening, still hot when packed.", quantity: 3, neighborhood: "Birchwood", lat: 37.4484, lng: -122.16, category: "cooked", status: "available", ageMs: 1000 * 60 * 35 },
  { seller: "priya", title: "Homemade lentil soup, 2 quarts", description: "Big batch from meal prep Sunday. Freezer's full so this needs to go today.", quantity: 2, neighborhood: "Downtown", lat: 37.4461, lng: -122.1629, category: "cooked", status: "available", ageMs: 1000 * 60 * 60 * 6 },
  { seller: "ana", title: "Half gallon of oat milk, unopened", description: "Bought the wrong kind on a grocery run. Still sealed, plenty of time before it expires.", quantity: 1, neighborhood: "Oak Avenue", lat: 37.4475, lng: -122.1646, category: "dairy", status: "available", ageMs: 1000 * 60 * 60 },
  { seller: "sam", title: "Block of cheddar cheese", description: "Bulk-bought from Costco with roommates and it turns out none of us eat this much cheese.", quantity: 1, neighborhood: "Willow Park", lat: 37.4428, lng: -122.1685, category: "dairy", status: "available", ageMs: 1000 * 60 * 60 * 8 },
  { seller: "javier", title: "Unopened boxes of cereal", description: "Care package had two boxes of the same cereal. Both sealed, happy to give one or both away.", quantity: 2, neighborhood: "Riverside", lat: 37.4397, lng: -122.1676, category: "pantry", status: "available", ageMs: 1000 * 60 * 60 * 24 },
  { seller: "tom", title: "Jar of peanut butter, almost full", description: "Moving out of the dorm for the summer and can't take pantry items with me. Barely touched.", quantity: 1, neighborhood: "Elm Street", lat: 37.4465, lng: -122.1653, category: "pantry", status: "reserved", ageMs: 1000 * 60 * 60 * 5 },
  { seller: "david", title: "Bag of rice, 5 lb", description: "Bought in bulk for a dinner event and only used a fraction of it. Unopened bag.", quantity: 1, neighborhood: "Birchwood", lat: 37.4487, lng: -122.1594, category: "pantry", status: "available", ageMs: 1000 * 60 * 60 * 10 },
  { seller: "sam", title: "Assorted granola bars", description: "Leftover from a club event, about 15 bars of mixed flavors. All within date.", quantity: 15, neighborhood: "Willow Park", lat: 37.4434, lng: -122.1682, category: "pantry", status: "available", ageMs: 1000 * 60 * 25 },
  { seller: "priya", title: "Cans of chickpeas and black beans", description: "Cleaning out the pantry before finals. Six cans total, all unopened and well within date.", quantity: 6, neighborhood: "Downtown", lat: 37.4459, lng: -122.1636, category: "pantry", status: "available", ageMs: 1000 * 60 * 60 * 7 },
  { seller: "ana", title: "Mini muffins, box of 12", description: "Bought for a meeting that ended up ordering different snacks. Never opened.", quantity: 12, neighborhood: "Oak Avenue", lat: 37.4471, lng: -122.164, category: "bakery", status: "available", ageMs: 1000 * 60 * 15 },
];

function genCode(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

async function main() {
  const users = new Map<SellerKey, { id: string }>();
  for (const s of SELLERS) {
    const user = await prisma.user.upsert({
      where: { email: s.email },
      update: {},
      create: {
        email: s.email,
        passwordHash: null,
        name: s.name,
        neighborhood: s.neighborhood,
        lat: s.lat,
        lng: s.lng,
        reliabilityScore: s.score,
      },
    });
    users.set(s.key, user);
  }

  const now = Date.now();
  const createdItems: { id: string; sellerKey: SellerKey; status: string }[] = [];

  for (const it of ITEMS) {
    const seller = users.get(it.seller)!;
    const item = await prisma.item.create({
      data: {
        title: it.title,
        description: it.description,
        quantity: it.quantity,
        category: it.category,
        neighborhood: it.neighborhood,
        lat: it.lat,
        lng: it.lng,
        status: it.status,
        createdAt: new Date(now - it.ageMs),
        sellerId: seller.id,
      },
    });
    createdItems.push({ id: item.id, sellerKey: it.seller, status: it.status });
  }

  const reservedItem = createdItems.find((i) => i.status === "reserved");
  const claimedItem = createdItems.find((i) => i.status === "claimed");
  const javier = users.get("javier")!;
  const ana = users.get("ana")!;

  if (reservedItem) {
    await prisma.reservation.create({
      data: {
        itemId: reservedItem.id,
        buyerId: javier.id,
        code: genCode(),
        status: "active",
        createdAt: new Date(now - 1000 * 60 * 10),
        expiresAt: new Date(now + 1000 * 60 * 50),
      },
    });
  }

  if (claimedItem) {
    await prisma.reservation.create({
      data: {
        itemId: claimedItem.id,
        buyerId: ana.id,
        code: genCode(),
        status: "picked_up",
        createdAt: new Date(now - 1000 * 60 * 60 * 5),
        expiresAt: new Date(now - 1000 * 60 * 60 * 4),
      },
    });
  }

  console.log(`Seeded ${users.size} users and ${createdItems.length} items.`);
  console.log("Seed accounts have no password and can't sign in — register a real account to test as a buyer/seller.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
