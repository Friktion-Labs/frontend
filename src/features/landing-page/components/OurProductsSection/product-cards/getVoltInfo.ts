import { VoltNumber } from "09/registry10";

const TITLES: Partial<Record<VoltNumber, string>> = {
  1: "Generate Income",
  2: "Sustainable Stables",
  3: "Crab Strategy",
  4: "Basis Yield",
  5: "Capital Protection",
};
export const getVoltTitle = (voltNumber: VoltNumber) => TITLES[voltNumber];

const PATHS: Partial<Record<VoltNumber, string>> = {
  1: "/income",
  2: "/stables",
  3: "/crab",
  4: "/basis",
  5: "/protection",
};
export const getVoltPath = (voltNumber: VoltNumber) => PATHS[voltNumber];
