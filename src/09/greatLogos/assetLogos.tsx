import { AllSymbolsUnion } from "../registry10";

// export const BoltBackground: React.FC<React.SVGProps<SVGSVGElement>> =
//   React.memo(() => (
//     <svg
//       width="89"
//       height="115"
//       viewBox="0 0 89 115"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <g opacity="1">
//         <path
//           d="M78.6811 62.6111L20.7666 115L36.5029 74.6223L78.6811 62.6111Z"
//           fill="white"
//         />
//         <path d="M0 80.5L89 0L64.7507 62.1L0 80.5Z" fill="white" />
//       </g>
//     </svg>
//   ));

type UrlString = string;
/**
 * Make sure we have the best logos for the important assets
 */
export const ImportantAssetLogos: Record<AllSymbolsUnion | "LDO", UrlString> = {
  BTC: require("./logos/BTC.png"),
  SOL: require("./logos/SOL.png"),
  ETH: require("./logos/ETH.png"),
  USDC: require("./logos/USDC.png"),
  tsUSDC: require("./logos/tsUSDC.png"),
  PAI: require("./logos/PAI.svg"),
  UXD: require("./logos/UXD.svg"),
  mSOL: require("./logos/mSOL.png"),
  stSOL: require("./logos/stSOL.png"),
  LDO: require("./logos/LDO.png"),
  FTT: require("./logos/FTT.png"),
  SRM: require("./logos/SRM.png"),
  SAMO: require("./logos/SAMO.png"),
  NEAR: require("./logos/NEAR.png"),
  MNGO: require("./logos/MNGO.png"),
  scnSOL: require("./logos/SCNSOL.png"),
  SBR: require("./logos/SBR.png"),
  LUNA: require("./logos/LUNA-alternative.png"),
  UST: require("./logos/UST.png"),
  RAY: require("./logos/RAY.png"),
  STEP: require("./logos/STEP.png"),
  AVAX: require("./logos/AVAX.png"),
  MNDE: require("./logos/MNDE.png"),
};
