import { PriceData } from "@/types/trading";
import { create } from "zustand";

interface AppState {
  ticker: string;
  prices: PriceData;
  setTicker: (ticker: string) => void;
  setPrices: (batch: PriceData) => void;
}

export const useAppState = create<AppState>((set, get) => ({
  ticker: "ETH",
  prices: {},
  setTicker: (ticker: string) => set({ ticker: ticker }),
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
