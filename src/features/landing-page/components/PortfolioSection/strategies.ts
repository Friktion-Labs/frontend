import { VoltNumber } from "@friktion-labs/friktion-sdk";
import { InvestmentStyle } from "./InvestmentStyle";

export interface Strategy {
  id: VoltNumber;
  label: string;
  allocation: Record<InvestmentStyle, number>;
  description: string;
  path: string;
}

export const STRATEGIES: Strategy[] = [
  {
    id: 1,
    label: "Generate Income",
    allocation: {
      conservative: 35,
      moderate: 30,
      aggressive: 25,
    },
    description:
      "Enhance returns on volatile assets with call option overwriting",
    path: "/income",
  },
  {
    id: 2,
    label: "Sustainable Stables",
    allocation: {
      conservative: 25,
      moderate: 20,
      aggressive: 15,
    },
    description: "Earn on stablecoins using automated cash secured puts",
    path: "/stables",
  },
  {
    id: 3,
    label: "Crab Strategy",
    allocation: {
      conservative: 20,
      moderate: 25,
      aggressive: 30,
    },
    description: "Monetize range-bound “crab” markets",
    path: "/crab",
  },
  {
    id: 4,
    label: "Basis Yield",
    allocation: {
      conservative: 20,
      moderate: 25,
      aggressive: 30,
    },
    description: "Harvest basis yield via delta-neutral funding",
    path: "/basis",
  },
];
