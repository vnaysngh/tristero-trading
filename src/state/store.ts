import { PriceData, Theme } from "@/types/trading";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_THEME } from "@/constants";

interface AppState {
  isOnline: boolean;
  theme: Theme;
  ticker: string;
  prices: PriceData;
  walletAddress: string;
  setOnline: (value: boolean) => void;
  setTheme: (theme: Theme) => void;
  setTicker: (ticker: string) => void;
  setPrices: (batch: PriceData) => void;
  setWalletAddress: (address: string) => void;
}

export const useAppState = create<AppState>()(
  persist(
    (set, get) => ({
      isOnline: true,
      theme: DEFAULT_THEME,
      ticker: "ETH",
      prices: {},
      walletAddress: "",
      setOnline: (value: boolean) => set({ isOnline: value }),
      setTheme: (theme: Theme) => set({ theme: theme }),
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
        ticker: state.ticker,
        theme: state.theme
      })
    }
  )
);
