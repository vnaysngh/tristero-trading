import { PriceData } from "@/types/trading";
import { create } from "zustand";

interface AppState {
  prices: PriceData;
  setPrices: (batch: PriceData) => void;
}

export const useAppState = create<AppState>((set, get) => ({
  prices: {},
  setPrices: (batch: PriceData) => {
    const state = get();

    const changedKeys: string[] = [];
    for (const k of Object.keys(batch)) {
      const incoming = batch[k];
      const existing = state.prices[k];
      if (existing !== incoming) changedKeys.push(k);
    }

    if (changedKeys.length === 0) {
      return;
    }

    const next: PriceData = { ...state.prices };
    for (const k of changedKeys) next[k] = batch[k];

    for (const ticker in batch) {
      if (next[ticker] !== batch[ticker]) {
        next[ticker] = batch[ticker];
      }
    }

    set(() => ({ prices: next }));
  }
}));
