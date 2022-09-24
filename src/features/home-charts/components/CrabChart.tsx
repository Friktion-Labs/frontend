import { css } from "@emotion/react";
import { useTheme } from "@mui/material";
import { YellowSpan } from "../../../09/glow09";

export const CrabChart = ({ ...props }: React.SVGProps<SVGSVGElement>) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  return (
    <div
      css={css`
        display: flex;
        margin: auto;
        width: 382px;
      `}
    >
      <div
        css={css`
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: end;
        `}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="382"
          height="152"
          fill="none"
          viewBox="0 0 382 152"
          css={css`
            width: 100%;
          `}
          {...props}
        >
          <path
            stroke={isDarkMode ? "#fff" : "#545B81"}
            strokeDasharray="4 4"
            strokeOpacity={isDarkMode ? "0.35" : "0.75"}
            strokeWidth="0.5"
            d="M30 1.509L382 1.509"
          ></path>
          <path
            stroke={isDarkMode ? "#fff" : "#545B81"}
            strokeOpacity={isDarkMode ? "0.5" : "0.75"}
            strokeWidth="0.5"
            d="M30 26.479h352M30 125.479h352"
          ></path>
          <path
            stroke={isDarkMode ? "#fff" : "#545B81"}
            strokeDasharray="4 4"
            strokeOpacity={isDarkMode ? "0.35" : "0.75"}
            strokeWidth="0.5"
            d="M30 149.992L382 149.992"
          ></path>
          <path
            stroke="url(#paint0_linear_3_141_crab)"
            strokeDasharray="12 8"
            d="M30 85.3064C30 85.3064 76.5 42 98.7721 42C121.044 42 148.142 109 178.321 109C208.5 109 247.323 37 264.412 37C281.5 37 311 103.41 328.195 103.41C345.389 103.41 381 61.6705 381 61.6705"
            strokeWidth="2"
          ></path>
          <path
            stroke={
              isDarkMode ? theme.palette.grey[600] : theme.palette.grey[400]
            }
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M1 1h8M5 73v8M1 77h8M1 151h8"
          ></path>
          <defs>
            <linearGradient
              id="paint0_linear_3_141_crab"
              x1="30"
              y1="73"
              x2="381"
              y2="73.0001"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0.25" stopColor="#ffc003" />
              <stop offset="0" stopColor="#cfe600"></stop>
              <stop offset="0.5" stopColor="#ffc003" />
            </linearGradient>
          </defs>
        </svg>
        <YellowSpan
          css={css`
            display: flex;
            width: 116px;
            font-family: "Euclid Circular B";
            font-size: 12px;
            position: absolute !important;
            left: 30px;
            bottom: 30px;
          `}
        >
          PROFIT RANGE
        </YellowSpan>
      </div>
    </div>
  );
};

export const MobileCrabChart = ({
  ...props
}: React.SVGProps<SVGSVGElement>) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  return (
    <div
      css={css`
        position: relative;
      `}
    >
      <YellowSpan
        css={css`
          position: absolute;
          bottom: 20%;
          left: 8%;
          font-family: "Euclid Circular B";
          font-size: 12px;

          @media (max-width: 480px) {
            bottom: 25%;
          }
          @media (max-width: 425px) {
            font-size: 10px;
            bottom: 30%;
          }
        `}
      >
        PROFIT RANGE
      </YellowSpan>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="382"
        height="152"
        fill="none"
        viewBox="0 0 382 152"
        css={css`
          width: 100%;
        `}
        {...props}
      >
        <path
          stroke={isDarkMode ? "#fff" : "#545B81"}
          strokeDasharray="4 4"
          strokeOpacity={isDarkMode ? "0.35" : "0.75"}
          strokeWidth="0.5"
          d="M30 1.509L382 1.509"
        ></path>
        <path
          stroke={isDarkMode ? "#fff" : "#545B81"}
          strokeOpacity={isDarkMode ? "0.5" : "0.75"}
          strokeWidth="0.5"
          d="M30 26.479h352M30 125.479h352"
        ></path>
        <path
          stroke={isDarkMode ? "#fff" : "#545B81"}
          strokeDasharray="4 4"
          strokeOpacity={isDarkMode ? "0.35" : "0.75"}
          strokeWidth="0.5"
          d="M30 149.992L382 149.992"
        ></path>
        <path
          stroke="url(#paint0_linear_3_141_crab)"
          strokeDasharray="12 8"
          d="M30 85.3064C30 85.3064 76.5 42 98.7721 42C121.044 42 148.142 109 178.321 109C208.5 109 247.323 37 264.412 37C281.5 37 311 103.41 328.195 103.41C345.389 103.41 381 61.6705 381 61.6705"
          strokeWidth="2"
        ></path>
        <path
          stroke={
            isDarkMode ? theme.palette.grey[600] : theme.palette.grey[400]
          }
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M1 1h8M5 73v8M1 77h8M1 151h8"
        ></path>
        <defs>
          <linearGradient
            id="paint0_linear_3_141_crab"
            x1="30"
            y1="73"
            x2="381"
            y2="73.0001"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.25" stopColor="#ffc003" />
            <stop offset="0" stopColor="#cfe600"></stop>
            <stop offset="0.5" stopColor="#ffc003" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
