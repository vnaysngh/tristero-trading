"use client";

import { useState, useEffect } from "react";
import { useAppState } from "@/state/store";
import { useAccountData, usePlaceOrder } from "@/hooks/useMarket";
import {
  leverage,
  MIN_MARGIN_REQUIRED,
  VALIDATION_MESSAGES
} from "@/constants";
import SideButton from "./SideButton";
import LeverageDisplay from "./LeverageDisplay";
import StatusMessage from "./StatusMessage";
import PositionSize from "./PositionSize";
import Balances from "./Balances";
import OrderDetails from "./OrderDetails";
import SubmitButton from "./SubmitButton";
import {
  FormData,
  CalculationResult,
  AccountValues,
  ValidationResult,
  OrderSide,
  OrderRequest,
  TradingFormState,
  INITIAL_FORM_DATA
} from "@/types/trading";

export default function MarketTradingForm() {
  const ticker = useAppState((s) => s.ticker);
  const isOnline = useAppState((s) => s.isOnline);
  const walletAddress = useAppState((s) => s.walletAddress);
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
  } = useAccountData(walletAddress);

  const {
    placeOrder,
    isPlacing,
    orderError,
    orderSuccess,
    reset: resetOrder
  } = usePlaceOrder(walletAddress);

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

  function calculateOrderValues(): CalculationResult {
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

  function extractAccountValues(): AccountValues {
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

  function validateOrder(
    calculations: CalculationResult,
    accountValues: AccountValues
  ): ValidationResult {
    const usdcBalanceNum = parseFloat(accountValues.usdcBalance);
    const sizeNum = parseFloat(formData.size);

    const hasEnoughMargin = calculations.marginRequired <= usdcBalanceNum;
    const hasMinimumMargin = calculations.marginRequired >= MIN_MARGIN_REQUIRED;
    const isValidSize = !isNaN(sizeNum) && sizeNum > 0;
    const hasSize = formData.size !== "";

    return {
      hasEnoughMargin,
      hasMinimumMargin,
      isValidSize,
      canSubmit:
        hasEnoughMargin &&
        hasMinimumMargin &&
        isValidSize &&
        hasSize &&
        isOnline
    };
  }

  function determineButtonText(validation: ValidationResult): string {
    if (!walletAddress) return VALIDATION_MESSAGES.CONNECT_WALLET;
    if (isPlacing) return VALIDATION_MESSAGES.PLACING;
    if (!validation.hasEnoughMargin)
      return VALIDATION_MESSAGES.NOT_ENOUGH_MARGIN;
    if (!validation.hasMinimumMargin) return VALIDATION_MESSAGES.MIN_MARGIN;
    if (!validation.isValidSize) return VALIDATION_MESSAGES.ENTER_SIZE;
    return VALIDATION_MESSAGES.PLACE_ORDER;
  }

  function computeAllValues(): TradingFormState {
    const calculations = calculateOrderValues();
    const accountValues = extractAccountValues();
    const validation = validateOrder(calculations, accountValues);
    const buttonText = determineButtonText(validation);

    return {
      formData,
      calculations,
      accountValues,
      validation,
      buttonText
    };
  }

  function updateFormField(field: keyof FormData, value: string | number) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    resetOrder();
  }

  function changeTradingSide(side: OrderSide) {
    updateFormField("side", side);
  }

  function handleLongClick() {
    changeTradingSide("long");
  }

  function handleShortClick() {
    changeTradingSide("short");
  }

  function handleSizeInput(e: React.ChangeEvent<HTMLInputElement>) {
    updateFormField("size", e.target.value);
  }

  function clearOrderSize() {
    setFormData((prev) => ({
      ...prev,
      size: "",
      sizePercentage: 0
    }));
  }

  function createOrderRequest(): OrderRequest {
    return {
      coin: formData.coin,
      side: formData.side,
      size: parseFloat(formData.size),
      leverage
    };
  }

  async function handleOrderSubmit(e: React.FormEvent) {
    e.preventDefault();
    resetOrder();

    const state = computeAllValues();

    if (!state.validation.canSubmit || !formData.coin) {
      return;
    }

    const orderRequest = createOrderRequest();

    try {
      await placeOrder(orderRequest);
      clearOrderSize();
    } catch (error) {
      throw error;
    }
  }

  function renderErrorMessage() {
    if (!orderError && !accountError) return null;

    return (
      <StatusMessage
        type="error"
        message={orderError || accountError || ""}
        onClose={resetOrder}
      />
    );
  }

  function renderSuccessMessage() {
    if (!orderSuccess) return null;

    return (
      <StatusMessage
        type="success"
        message="Order placed successfully!"
        onClose={resetOrder}
      />
    );
  }

  function renderTradingSideButtons() {
    return (
      <div className="flex space-x-4 mb-6">
        <SideButton
          side="long"
          currentSide={formData.side}
          label="Buy / Long"
          onClick={handleLongClick}
        />
        <SideButton
          side="short"
          currentSide={formData.side}
          label="Sell / Short"
          onClick={handleShortClick}
        />
        <LeverageDisplay leverage={leverage} />
      </div>
    );
  }

  // Compute all state for render
  const state = computeAllValues();

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Market Order
      </h2>

      <form onSubmit={handleOrderSubmit} className="space-y-4">
        {renderTradingSideButtons()}

        <Balances
          usdcBalance={state.accountValues.usdcBalance}
          positionSize={state.accountValues.positionSize}
          loadingBalance={loadingBalance}
          refetchAccount={refetchAccount}
          coin={formData.coin}
        />

        <PositionSize
          size={formData.size}
          coin={formData.coin}
          handleSizeChange={handleSizeInput}
        />

        <OrderDetails
          orderValue={state.calculations.orderValue}
          marginRequired={state.calculations.marginRequired}
          hasMinimumMargin={state.validation.hasMinimumMargin}
          hasEnoughMargin={state.validation.hasEnoughMargin}
          size={formData.size}
        />

        {renderErrorMessage()}
        {renderSuccessMessage()}

        <SubmitButton
          isPlacing={isPlacing}
          canSubmit={state.validation.canSubmit}
          buttonText={state.buttonText}
        />
      </form>
    </div>
  );
}
