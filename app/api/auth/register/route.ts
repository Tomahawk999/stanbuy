import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { CENTER, NEIGHBORHOOD } from "@/lib/data";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { email, password, name, neighborhood } = (body ?? {}) as Record<string, unknown>;

  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  }
  if (typeof password !== "string" || password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }
  if (typeof name !== "string" || name.trim().length < 1) {
    return NextResponse.json({ error: "Enter your name" }, { status: 400 });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email: normalizedEmail,
      passwordHash,
      name: name.trim(),
      neighborhood: typeof neighborhood === "string" && neighborhood.trim() ? neighborhood.trim() : NEIGHBORHOOD,
      lat: CENTER[0] + (Math.random() - 0.5) * 0.01,
      lng: CENTER[1] + (Math.random() - 0.5) * 0.01,
    },
    select: { id: true, email: true, name: true },
  });

  return NextResponse.json({ ok: true, user });
}
