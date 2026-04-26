import { create } from "zustand";
import type { ReservationDraft } from "@/types";

interface ReserveStore {
  draft: Partial<ReservationDraft>;
  setDraft: (patch: Partial<ReservationDraft>) => void;
  reset: () => void;
}

export const useReserveStore = create<ReserveStore>((set) => ({
  draft: {},
  setDraft: (patch) => set((s) => ({ draft: { ...s.draft, ...patch } })),
  reset: () => set({ draft: {} }),
}));
