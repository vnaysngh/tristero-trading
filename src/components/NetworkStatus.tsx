"use client";

import { useEffect, useState } from "react";
import { WarningIcon } from "./Icons";
import { useAppState } from "@/state/store";

export function NetworkStatus() {
  const [isClient, setIsClient] = useState(false);

  const isOnline = useAppState((s) => s.isOnline);
  const setIsOnline = useAppState((s) => s.setOnline);

  const handleOnline = () => setIsOnline(true);
  const handleOffline = () => setIsOnline(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [isClient]);

  if (isOnline) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-[#ad4747] text-white px-4 py-2 text-center text-sm shadow-lg">
      <div className="flex items-center justify-center space-x-2">
        <WarningIcon className="w-4 h-4" />
        <span>You're offline. Please check your internet connection.</span>
      </div>
    </div>
  );
}
