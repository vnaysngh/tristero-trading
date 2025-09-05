import { PriceData } from "@/types/trading";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AppState {
  ticker: string;
  prices: PriceData;
  walletAddress: string;
  setTicker: (ticker: string) => void;
  setPrices: (batch: PriceData) => void;
  setWalletAddress: (address: string) => void;
}

export const useAppState = create<AppState>()(
  persist(
    (set, get) => ({
      ticker: "ETH",
      prices: {},
      walletAddress: "",
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
      },
      setWalletAddress: (address: string) => set({ walletAddress: address })
    }),
    {
      name: "ticker",
      partialize: (state) => ({
        ticker: state.ticker
      })
    }
  )
);
