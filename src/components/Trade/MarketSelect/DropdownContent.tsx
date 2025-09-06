import { MarketData } from "@/types";
import MarketDropdown from "./MarketDropdown";

const DropdownContent = ({
  isLoading,
  markets,
  onSelect,
  currentTicker
}: {
  isLoading: boolean;
  markets: MarketData[];
  onSelect: (assetName: string) => void;
  currentTicker: string;
}) => {
  if (isLoading) {
    return (
      <div className="p-4 text-center text-gray-400">Loading markets...</div>
    );
  }

  if (markets.length === 0) {
    return <div className="p-4 text-center text-gray-400">No assets found</div>;
  }

  return (
    <>
      {markets.map((market) => (
        <MarketDropdown
          key={market.name}
          market={market}
          handleAssetSelect={onSelect}
          ticker={currentTicker}
        />
      ))}
    </>
  );
};

export default DropdownContent;
