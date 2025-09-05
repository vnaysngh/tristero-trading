"use client";

import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { useAppState } from "@/state/store";
import { useAccountData, usePlaceOrder } from "@/hooks/useMarket";
import { leverage, USER_ADDRESS } from "@/constants";
import SideButton from "./SideButton";
import LeverageDisplay from "./LeverageDisplay";
import StatusMessage from "./StatusMessage";
import PositionSize from "./PositionSize";
import Balances from "./Balances";
import OrderDetails from "./OrderDetails";
import SubmitButton from "./SubmitButton";

export default function MarketTradingForm() {
  const ticker = useAppState((s) => s.ticker);
  const currentPrice = useAppState((s) => s.prices[ticker]);

  const [formData, setFormData] = useState({
    coin: ticker || "",
    side: "long" as "long" | "short",
    size: "",
    sizePercentage: 0
  });

  const {
    accountData,
    loading: loadingBalance,
    error: accountError,
    refetch: refetchAccount
  } = useAccountData(USER_ADDRESS);

  const {
    placeOrder,
    isPlacing,
    orderError,
    orderSuccess,
    reset: resetOrder
  } = usePlaceOrder();

  useEffect(() => {
    if (ticker && ticker !== formData.coin) {
      setFormData((prev) => ({
        ...prev,
        coin: ticker,
        size: "",
        sizePercentage: 0
      }));
    }
  }, [ticker, formData.coin]);

  const handleInputChange = useCallback(
    (field: string, value: string | number) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      resetOrder();
    },
    [resetOrder]
  );

  const handleSideChange = useCallback(
    (side: "long" | "short") => {
      handleInputChange("side", side);
    },
    [handleInputChange]
  );

  const handleSizeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleInputChange("size", e.target.value);
    },
    [handleInputChange]
  );

  const calculations = useMemo(() => {
    const sizeNum = parseFloat(formData.size);
    const priceNum = currentPrice ? parseFloat(currentPrice.toString()) : 0;

    if (
      !ticker ||
      !currentPrice ||
      !formData.size ||
      isNaN(sizeNum) ||
      sizeNum <= 0
    ) {
      return { orderValue: 0, marginRequired: 0 };
    }

    const orderValue = sizeNum * priceNum;
    const marginRequired = orderValue / leverage;

    return { orderValue, marginRequired };
  }, [ticker, currentPrice, formData.size]);

  const accountValues = useMemo(() => {
    if (!accountData) {
      return { usdcBalance: "0.00", positionSize: "0.0000" };
    }

    const usdcBalance = parseFloat(
      accountData.crossMarginSummary?.accountValue || "0"
    ).toFixed(2);

    let positionSize = "0.0000";
    if (accountData.assetPositions && formData.coin) {
      const position = accountData.assetPositions.find(
        (pos: any) => pos.position.coin === formData.coin
      );
      if (position) {
        positionSize = parseFloat(position.position.szi || "0").toFixed(4);
      }
    }

    return { usdcBalance, positionSize };
  }, [accountData, formData.coin]);

  const validation = useMemo(() => {
    const usdcBalanceNum = parseFloat(accountValues.usdcBalance);
    const hasEnoughMargin = calculations.marginRequired <= usdcBalanceNum;
    const hasMinimumMargin = calculations.marginRequired >= 10;
    const sizeNum = parseFloat(formData.size);
    const isValidSize = !isNaN(sizeNum) && sizeNum > 0;

    return {
      hasEnoughMargin,
      hasMinimumMargin,
      isValidSize,
      canSubmit:
        hasEnoughMargin &&
        hasMinimumMargin &&
        isValidSize &&
        formData.size !== ""
    };
  }, [calculations.marginRequired, accountValues.usdcBalance, formData.size]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      resetOrder();

      if (!validation.canSubmit || !formData.coin) return;

      const orderRequest = {
        coin: formData.coin,
        side: formData.side,
        size: parseFloat(formData.size),
        leverage
      };

      placeOrder(orderRequest, {
        onSuccess: () => {
          setFormData((prev) => ({
            ...prev,
            size: "",
            sizePercentage: 0
          }));
        }
      });
    },
    [
      validation.canSubmit,
      formData.coin,
      formData.side,
      formData.size,
      placeOrder,
      resetOrder
    ]
  );

  const buttonText = useMemo(() => {
    if (isPlacing) return "Placing Order...";
    if (!validation.hasEnoughMargin) return "Not Enough Margin";
    if (!validation.hasMinimumMargin) return "Min Margin $10";
    if (!validation.isValidSize) return "Enter Size";
    return "Place Order";
  }, [isPlacing, validation]);

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Market Order
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex space-x-4 mb-6">
          <SideButton
            side="long"
            currentSide={formData.side}
            label="Buy / Long"
            onClick={() => handleSideChange("long")}
          />
          <SideButton
            side="short"
            currentSide={formData.side}
            label="Sell / Short"
            onClick={() => handleSideChange("short")}
          />
          <LeverageDisplay leverage={leverage} />
        </div>

        <Balances
          loadingBalance={loadingBalance}
          accountValues={accountValues}
          refetchAccount={refetchAccount}
          formData={formData}
        />

        <PositionSize formData={formData} handleSizeChange={handleSizeChange} />

        <OrderDetails
          calculations={calculations}
          validation={validation}
          formData={formData}
        />

        {(orderError || accountError) && (
          <StatusMessage
            type="error"
            message={orderError || accountError || ""}
            onClose={resetOrder}
          />
        )}

        {orderSuccess && (
          <StatusMessage
            type="success"
            message="Order placed successfully!"
            onClose={resetOrder}
          />
        )}

        <SubmitButton
          isPlacing={isPlacing}
          validation={validation}
          buttonText={buttonText}
        />
      </form>
    </div>
  );
}
