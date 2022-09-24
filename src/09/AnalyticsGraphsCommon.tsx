import Bolt from "./friktionLogos/bolt80.png";
import styled from "@emotion/styled";
import { AsyncButton09Bolt } from "./Button09";
import { css } from "@emotion/react";

export const GraphContainer = styled.div`
  padding-left: 20px;
  padding-right: 20px;
  margin-bottom: 20px;
  position: relative;
  z-index: 5;
`;

// 210px is the sweet spot due to the vertical line
export const GraphWrapper = styled.div`
  backdrop-filter: blur(1px);

  width: 100%;
  height: 210px;
  color: #000;
  background: hsla(230, 15%, 50%, 0.15);

  @media print {
    & {
      outline: 1px solid rgba(0, 0, 0, 0.2);
    }
  }
  transition: background 0.2s ease-in-out;
  border-radius: 4px;
  position: relative;
  &,
  div > svg {
    border-radius: 4px;
  }
  &.loading {
    .loadingLabel {
      opacity: 1;
    }
  }
  &.loaded {
    .loadingLabel {
      opacity: 0;
    }
  }
  svg {
    g {
      text {
        opacity: 0.9;
        transition: opacity 0.4s ease-in-out;
      }
    }
  }
  svg + div {
    /* transform: unset !important; */
    /* position: absolute;
  left: 0;
  right: 0; */
  }
  &.priceAndStrike {
    svg > g:first-of-type > path:first-of-type {
      stroke-dasharray: 1, 2;
    }
    svg > g:first-of-type > path:nth-of-type(2) {
      stroke-dasharray: 1, 2;
    }
  }
  &.tvlUsd {
    /* height: 210; */
    svg > g:first-of-type > g:first-of-type {
      opacity: 0.6;
    }
    text {
      @media print {
        fill: #333 !important;
      }
    }
  }
  &:hover {
    /* background: hsla(230, 15%, 50%, 0.2); */

    svg {
      g {
        text {
          opacity: 1;
        }
      }
    }
  }
  -webkit-backface-visibility: hidden;
  -moz-backface-visibility: hidden;
  -webkit-transform: translate3d(0, 0, 0);
  -moz-transform: translate3d(0, 0, 0);
`;

export const colorGain = css`
  color: #54b843;
`;
export const colorLoss = css`
  color: #ff6766;
`;

export const AbsoluteLabel = styled.div`
  position: absolute;
  font-weight: bold;
  font-size: 18px;
  width: 100%;
  text-align: center;
  left: 0;
  right: 0;
  top: 14px;
  color: rgba(255, 255, 255, 0.9);
`;

export const LoadingLabel = styled.div`
  position: absolute;
  top: 88px;
  left: 0;
  right: 0;
  font-size: 18px;
  color: hsl(230, 15%, 80%);
  text-align: center;
  user-select: none;
  transition: opacity 0.5s ease-in-out;
`;

export const loading = (
  <LoadingLabel className="loadingLabel">
    <AsyncButton09Bolt
      css={css`
        visibility: visible;
        margin: 20px;
      `}
      src={Bolt}
    ></AsyncButton09Bolt>
    <span>loading...</span>
    <AsyncButton09Bolt
      css={css`
        visibility: visible;
        margin: 20px;
      `}
      src={Bolt}
      className="alternate"
    ></AsyncButton09Bolt>
  </LoadingLabel>
);

export const noData = (
  <LoadingLabel className="loadingLabel">
    <AsyncButton09Bolt
      css={css`
        visibility: hidden;
        margin: 20px;
      `}
      src={Bolt}
    ></AsyncButton09Bolt>
    <span>Too new to show data</span>
    <AsyncButton09Bolt
      css={css`
        visibility: hidden;
        margin: 20px;
      `}
      src={Bolt}
      className="alternate"
    ></AsyncButton09Bolt>
  </LoadingLabel>
);

export const generateIntervalBasedOnTimeRange = (min: Date, max: Date) => {
  const daysDiff = (max.getTime() - min.getTime()) / 86400000;
  if (daysDiff > 180) {
    return "every 28 days";
  }
  if (daysDiff > 60) {
    return "every 14 days";
  }

  if (daysDiff > 30) {
    return "every 7 days";
  }
  if (daysDiff > 7) {
    return "every 2 days";
  }
  if (daysDiff > 2) {
    return "every 1 day";
  }

  return "every 12 hours";
};
