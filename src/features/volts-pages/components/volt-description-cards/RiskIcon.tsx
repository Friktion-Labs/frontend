import { getVoltColorPair } from "09/glow09";
import { VoltNumber } from "09/registry10";
import React from "react";

interface RiskIconProps extends React.SVGProps<SVGSVGElement> {
  voltNumber: VoltNumber;
}
export const RiskIcon = ({ voltNumber, ...rest }: RiskIconProps) => {
  const [colorA, colorB] = getVoltColorPair(voltNumber);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      fill="none"
      viewBox="0 0 22 22"
      {...rest}
    >
      <path
        stroke="url(#paint0_linear_3732_31841_info_icon)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M11 21c5.523 0 10-4.477 10-10S16.523 1 11 1 1 5.477 1 11s4.477 10 10 10z"
      ></path>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M11 15h.01"
        stroke={colorA}
      ></path>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M11 7v4"
        stroke={colorA}
      ></path>
      <defs>
        <linearGradient
          id="paint0_linear_3732_31841_info_icon"
          x1="1"
          x2="21"
          y1="11"
          y2="11"
          gradientUnits="userSpaceOnUse"
          gradientTransform="rotate(315, 11, 11)"
        >
          <stop offset="0" stopColor={colorA} />
          <stop offset="0" stopColor={colorB}></stop>
          <stop offset="1" stopColor={colorA} />
        </linearGradient>
      </defs>
    </svg>
  );
};
