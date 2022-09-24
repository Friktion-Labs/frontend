import { getVoltColorPair } from "09/glow09";
import { VoltNumber } from "09/registry10";
import React from "react";

interface PerformanceIconProps extends React.SVGProps<SVGSVGElement> {
  voltNumber: VoltNumber;
}
export const PerformanceIcon = ({
  voltNumber,
  ...rest
}: PerformanceIconProps) => {
  const [colorA, colorB] = getVoltColorPair(voltNumber);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="22"
      fill="none"
      viewBox="0 0 20 22"
      {...rest}
    >
      <path
        stroke="url(#paint0_linear_4271_704_performance_icon)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M11 1L1 13h9l-1 8L19 9h-9l1-8z"
      ></path>
      <defs>
        <linearGradient
          id="paint0_linear_4271_704_performance_icon"
          x1="1"
          x2="19"
          y1="11"
          y2="11"
          gradientUnits="userSpaceOnUse"
          gradientTransform="rotate(315, 10, 11)"
        >
          <stop offset="0" stopColor={colorA} />
          <stop offset="0" stopColor={colorB}></stop>
          <stop offset="1" stopColor={colorA} />
        </linearGradient>
      </defs>
    </svg>
  );
};
