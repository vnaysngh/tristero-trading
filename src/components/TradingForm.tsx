"use client";

import { useState, useEffect } from "react";
import { useAppState } from "@/state/store";
import { useAccountData, usePlaceOrder } from "@/hooks/useMarket";
import { leverage, USER_ADDRESS, MIN_MARGIN_REQUIRED } from "@/constants";
import SideButton from "./SideButton";
import LeverageDisplay from "./LeverageDisplay";
import StatusMessage from "./StatusMessage";
import PositionSize from "./PositionSize";
import Balances from "./Balances";
import OrderDetails from "./OrderDetails";
import SubmitButton from "./SubmitButton";
import {
  INITIAL_FORM_DATA,
  FormData,
  CalculationResult,
  AccountValues,
  ValidationResult,
  OrderSide,
  OrderRequest
} from "@/types/trading";

export default function MarketTradingForm() {
  const ticker = useAppState((s) => s.ticker);
  const currentPrice = useAppState((s) => s.prices[ticker]);

  const [formData, setFormData] = useState<FormData>(() => ({
    ...INITIAL_FORM_DATA,
    coin: ticker || ""
  }));

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

  function getCalculationResult(): CalculationResult {
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
  }

  function getAccountValues(): AccountValues {
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
  }

  function getValidationResult(
    calculationResult: CalculationResult,
    accountValues: AccountValues
  ): ValidationResult {
    const usdcBalanceNum = parseFloat(accountValues.usdcBalance);
    const sizeNum = parseFloat(formData.size);

    const hasEnoughMargin = calculationResult.marginRequired <= usdcBalanceNum;
    const hasMinimumMargin =
      calculationResult.marginRequired >= MIN_MARGIN_REQUIRED;
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
  }

  function getButtonText(validationResult: ValidationResult): string {
    if (isPlacing) return "Placing Order...";
    if (!validationResult.hasEnoughMargin) return "Not Enough Margin";
    if (!validationResult.hasMinimumMargin) return "Min Margin $10";
    if (!validationResult.isValidSize) return "Enter Size";
    return "Place Order";
  }

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    resetOrder();
  };

  const handleSideChange = (side: OrderSide) => {
    handleInputChange("side", side);
  };

  const onClickLong = () => {
    handleSideChange("long");
  };

  const onClickShort = () => {
    handleSideChange("short");
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange("size", e.target.value);
  };

  const resetFormSize = () => {
    setFormData((prev) => ({
      ...prev,
      size: "",
      sizePercentage: 0
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetOrder();

    const calculationResult = getCalculationResult();
    const accountValues = getAccountValues();
    const validationResult = getValidationResult(
      calculationResult,
      accountValues
    );

    if (!validationResult.canSubmit || !formData.coin) return;

    const orderRequest: OrderRequest = {
      coin: formData.coin,
      side: formData.side,
      size: parseFloat(formData.size),
      leverage
    };

    placeOrder(orderRequest, {
      onSuccess: resetFormSize
    });
  };

  const calculationResult = getCalculationResult();
  const accountValues = getAccountValues();
  const validationResult = getValidationResult(
    calculationResult,
    accountValues
  );
  const buttonText = getButtonText(validationResult);

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
            onClick={onClickLong}
          />
          <SideButton
            side="short"
            currentSide={formData.side}
            label="Sell / Short"
            onClick={onClickShort}
          />
          <LeverageDisplay leverage={leverage} />
        </div>

        <Balances
          usdcBalance={accountValues.usdcBalance}
          positionSize={accountValues.positionSize}
          loadingBalance={loadingBalance}
          refetchAccount={refetchAccount}
          coin={formData.coin}
        />

        <PositionSize
          size={formData.size}
          coin={formData.coin}
          handleSizeChange={handleSizeChange}
        />

        <OrderDetails
          orderValue={calculationResult.orderValue}
          marginRequired={calculationResult.marginRequired}
          hasMinimumMargin={validationResult.hasMinimumMargin}
          hasEnoughMargin={validationResult.hasEnoughMargin}
          size={formData.size}
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
          canSubmit={validationResult.canSubmit}
          buttonText={buttonText}
        />
      </form>
    </div>
  );
}
