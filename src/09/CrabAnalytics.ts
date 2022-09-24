import { EpochRow, ParsedOptionProduct } from "./registry10";
import { parseOptionProduct } from "./registry10";

export type ProfitRangeDataPoint = {
  unixTime: number;
  fundingDiff: number;
  fundingTest: number;
  profitRangePct: number;
  profitRangeLow: number;
  profitRangeHigh: number;
};

export async function profitRangeForEpochRow(
  epochRow: EpochRow
): Promise<ProfitRangeDataPoint[]> {
  const optionProduct = parseOptionProduct(
    epochRow.product
  ) as ParsedOptionProduct;
  try {
    const response = await fetch(
      `https://stats.entropy.trade/perp/funding_rate_agg?market=${
        (optionProduct.asset as string) + "%5E2-PERP"
      }&mangoGroup=mainnet.2&refPrice=${optionProduct.strike}&startTime=${
        epochRow.startEpoch
      }&endTime=${epochRow.endEpoch}`,
      {
        mode: "cors",
      }
    );
    const data: ProfitRangeDataPoint[] = await response.json();
    return data;
  } catch (error) {
    return [];
  }
}
