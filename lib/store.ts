"use client";

import { create } from "zustand";
import { Item, Reservation } from "./types";

interface CurrentUser {
  id: string;
  name: string;
  email: string;
  neighborhood: string;
  memberSince: number;
}

interface StanState {
  items: Item[];
  reservations: Reservation[];
  reliabilityScore: number;
  freezeUntil: number | null;
  savedIds: string[];
  currentUser: CurrentUser | null;
  loading: boolean;
  hydrate: () => Promise<void>;
  reserveItem: (itemId: string) => Promise<{ ok: boolean; reason?: string; reservationId?: string }>;
  confirmPickup: (reservationId: string) => Promise<void>;
  toggleSave: (itemId: string) => Promise<{ ok: boolean; reason?: string }>;
  publishItem: (input: {
    title: string;
    description: string;
    category: Item["category"];
    neighborhood: string;
    quantity: number;
    image?: string;
  }) => Promise<{ ok: boolean; id?: string; error?: string }>;
}

export const useStanStore = create<StanState>((set, get) => ({
  items: [],
  reservations: [],
  reliabilityScore: 98,
  freezeUntil: null,
  savedIds: [],
  currentUser: null,
  loading: true,

  hydrate: async () => {
    const [itemsRes, meRes] = await Promise.all([fetch("/api/items"), fetch("/api/me")]);
    const items: Item[] = itemsRes.ok ? await itemsRes.json() : [];
    const me = meRes.ok ? await meRes.json() : { authenticated: false };

    set({
      items,
      loading: false,
      currentUser: me.authenticated
        ? { id: me.id, name: me.name, email: me.email, neighborhood: me.neighborhood, memberSince: me.memberSince }
        : null,
      reliabilityScore: me.authenticated ? me.reliabilityScore : 98,
      freezeUntil: me.authenticated ? me.freezeUntil : null,
      savedIds: me.authenticated ? me.savedIds : [],
      reservations: me.authenticated ? me.reservations : [],
    });
  },

  reserveItem: async (itemId) => {
    if (!get().currentUser) return { ok: false, reason: "unauthenticated" };
    const res = await fetch(`/api/items/${itemId}/reserve`, { method: "POST" });
    const data = await res.json();
    if (data.ok) {
      set((state) => ({
        items: state.items.map((i) => (i.id === itemId ? { ...i, status: "reserved" as const } : i)),
        reservations: [data.reservation, ...state.reservations],
      }));
      return { ok: true, reservationId: data.reservation.id };
    }
    return { ok: false, reason: data.reason };
  },

  confirmPickup: async (reservationId) => {
    const reservation = get().reservations.find((r) => r.id === reservationId);
    if (!reservation) return;
    const res = await fetch(`/api/reservations/${reservationId}/confirm`, { method: "POST" });
    if (!res.ok) return;
    set((state) => ({
      reservations: state.reservations.map((r) => (r.id === reservationId ? { ...r, status: "picked_up" as const } : r)),
      items: state.items.map((i) => (i.id === reservation.itemId ? { ...i, status: "claimed" as const } : i)),
    }));
  },

  toggleSave: async (itemId) => {
    if (!get().currentUser) return { ok: false, reason: "unauthenticated" };
    const wasSaved = get().savedIds.includes(itemId);
    set((state) => ({
      savedIds: wasSaved ? state.savedIds.filter((id) => id !== itemId) : [...state.savedIds, itemId],
    }));
    const res = await fetch(`/api/saved/${itemId}`, { method: "POST" });
    if (!res.ok) {
      set((state) => ({
        savedIds: wasSaved ? [...state.savedIds, itemId] : state.savedIds.filter((id) => id !== itemId),
      }));
      return { ok: false, reason: "failed" };
    }
    return { ok: true };
  },

  publishItem: async (input) => {
    if (!get().currentUser) return { ok: false, error: "unauthenticated" };
    const res = await fetch("/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = await res.json();
    if (!res.ok) return { ok: false, error: data.error ?? "Could not publish listing" };
    set((state) => ({ items: [data, ...state.items] }));
    return { ok: true, id: data.id };
  },
}));
