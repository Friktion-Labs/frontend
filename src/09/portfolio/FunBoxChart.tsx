import { css } from "@emotion/react";
import styled from "@emotion/styled";
import React from "react";
import { formatUSDAdaptable } from "../format09";
import { useTooltip } from "@nivo/tooltip";
import { VoltNumber } from "../registry10";
import { Popover } from "antd";
import { useElementSize } from "usehooks-ts";

type FunBoxVoltInfo = {
  volt: VoltNumber;
  voltTotal: number | null;
  voltWidth: number;
  baseColor: string;
  colorProperty: string;
};

export const FunBoxChart: React.FC<{
  totalPortfolioValue: number | null;
  totalThisWeekUSDC: number | null;
  totalReturnOnInvestment: number | null;
  volt1Total: number | null;
  volt2Total: number | null;
  volt3Total: number | null;
  volt4Total: number | null;
  volt5Total: number | null;
  disabled: boolean;
}> = ({
  totalPortfolioValue,
  totalThisWeekUSDC,
  totalReturnOnInvestment,
  volt1Total,
  volt2Total,
  volt3Total,
  volt4Total,
  volt5Total,
  disabled,
}) => {
  const [wrapperRef, { width: wrapperWidth }] = useElementSize();

  const funBoxSize = 320;
  const funBoxPartMinWidth = 40;
  const funBoxPartMaxWidth = 180;

  let volt1Width = null;
  let volt2Width = null;
  let volt3Width = null;
  let volt4Width = null;
  let volt5Width = null;

  if (totalPortfolioValue !== 0) {
    volt1Width =
      // eslint-disable-next-line eqeqeq
      volt1Total != null && totalPortfolioValue != null
        ? (volt1Total / totalPortfolioValue) * funBoxSize
        : null;
    volt2Width =
      // eslint-disable-next-line eqeqeq
      volt2Total != null && totalPortfolioValue != null
        ? (volt2Total / totalPortfolioValue) * funBoxSize
        : null;
    volt3Width =
      // eslint-disable-next-line eqeqeq
      volt3Total != null && totalPortfolioValue != null
        ? (volt3Total / totalPortfolioValue) * funBoxSize
        : null;
    volt4Width =
      // eslint-disable-next-line eqeqeq
      volt4Total != null && totalPortfolioValue != null
        ? (volt4Total / totalPortfolioValue) * funBoxSize
        : null;
    volt5Width =
      // eslint-disable-next-line eqeqeq
      volt5Total != null && totalPortfolioValue != null
        ? (volt5Total / totalPortfolioValue) * funBoxSize
        : null;
  }

  return (
    <Container css={gradientAnimationSetup}>
      <FunBoxAndStatsRow>
        <FunBox
          volt1Total={volt1Total}
          volt2Total={volt2Total}
          volt3Total={volt3Total}
          volt4Total={volt4Total}
          volt5Total={volt5Total}
          disabled={disabled}
          volt1Width={
            // eslint-disable-next-line eqeqeq
            volt1Width == null
              ? 70
              : Math.max(
                  Math.min(volt1Width, funBoxPartMaxWidth),
                  funBoxPartMinWidth
                )
          }
          volt2Width={
            // eslint-disable-next-line eqeqeq
            volt2Width == null
              ? 70
              : Math.max(
                  Math.min(volt2Width, funBoxPartMaxWidth),
                  funBoxPartMinWidth
                )
          }
          volt3Width={
            // eslint-disable-next-line eqeqeq
            volt3Width == null
              ? 70
              : Math.max(
                  Math.min(volt3Width, funBoxPartMaxWidth),
                  funBoxPartMinWidth
                )
          }
          volt4Width={
            // eslint-disable-next-line eqeqeq
            volt4Width == null
              ? 70
              : Math.max(
                  Math.min(volt4Width, funBoxPartMaxWidth),
                  funBoxPartMinWidth
                )
          }
          volt5Width={
            // eslint-disable-next-line eqeqeq
            volt5Width == null
              ? 70
              : Math.max(
                  Math.min(volt5Width, funBoxPartMaxWidth),
                  funBoxPartMinWidth
                )
          }
        />
        <Stats ref={wrapperRef}>
          <StatsItem>
            <StatsItemText>
              {disabled
                ? "-"
                : totalPortfolioValue !== null
                ? formatUSDAdaptable(totalPortfolioValue)
                : "$..."}
            </StatsItemText>
            <StatsItemTitle>
              Portfolio value{" "}
              <Popover
                placement="bottom"
                content={
                  <span
                    css={css`
                      display: block;
                      max-width: 200px;
                      font-size: 14px;
                      font-family: "Euclid Circular B";
                      text-align: center;
                    `}
                  >
                    The current USDC value of your portfolio (includes Deposits
                    & Withdrawals).
                  </span>
                }
              >
                <span
                  css={css`
                    &:after {
                      content: "ⓘ";
                      font-size: 12px;
                      font-weight: bold;
                      font-family: "Euclid Circular B";
                      cursor: pointer;
                    }
                  `}
                ></span>
              </Popover>
            </StatsItemTitle>
          </StatsItem>
          <Divider />
          <StatsItem>
            <StatsItemText>
              {disabled ? (
                "-"
              ) : totalReturnOnInvestment !== null ? (
                <Row
                  css={css`
                    gap: 10px !important;
                  `}
                >
                  <div
                    css={css`
                      margin-left: -1px;
                    `}
                  >{`${
                    totalReturnOnInvestment > 0 ? "+" : ""
                  }${formatUSDAdaptable(totalReturnOnInvestment)}`}</div>
                  {totalReturnOnInvestment > 0 ? (
                    <UpArrow />
                  ) : totalReturnOnInvestment === 0 ? (
                    ""
                  ) : (
                    <DownArrow />
                  )}
                </Row>
              ) : (
                "$..."
              )}
            </StatsItemText>
            <Row>
              <StatsItemTitle>
                {`${wrapperWidth > 629 ? "Return on investment " : "ROI "}`}
                <Popover
                  placement="bottom"
                  content={
                    <span
                      css={css`
                        display: block;
                        max-width: 200px;
                        font-size: 14px;
                        font-family: "Euclid Circular B";
                        text-align: center;
                      `}
                    >
                      Total net return generated in USDC from each Volt in your
                      portfolio from the beginning of time.
                    </span>
                  }
                >
                  <span
                    css={css`
                      &:after {
                        content: "ⓘ";
                        font-size: 12px;
                        font-weight: bold;
                        font-family: "Euclid Circular B";
                        cursor: pointer;
                        margin-right: 5px;
                        margin-left: 2px;
                      }
                    `}
                  ></span>
                </Popover>
              </StatsItemTitle>
            </Row>
          </StatsItem>
          <Divider />
          <StatsItem>
            <StatsItemText>
              {disabled ? (
                "-"
              ) : totalThisWeekUSDC !== null ? (
                <Row
                  css={css`
                    gap: 10px !important;
                  `}
                >
                  <div
                    css={css`
                      margin-left: -1px;
                    `}
                  >{`${totalThisWeekUSDC > 0 ? "+" : ""}${
                    totalThisWeekUSDC > 0 && totalThisWeekUSDC < 1
                      ? `$${totalThisWeekUSDC.toFixed(4)}`
                      : formatUSDAdaptable(totalThisWeekUSDC)
                  }`}</div>
                  {totalThisWeekUSDC > 0 ? (
                    <UpArrow />
                  ) : totalThisWeekUSDC === 0 ? (
                    ""
                  ) : (
                    <DownArrow />
                  )}
                </Row>
              ) : (
                "$..."
              )}
            </StatsItemText>
            <StatsItemTitle>This week</StatsItemTitle>
          </StatsItem>
        </Stats>
      </FunBoxAndStatsRow>
    </Container>
  );
};

const FunBox: React.FC<{
  disabled: boolean;
  volt1Width: number;
  volt2Width: number;
  volt3Width: number;
  volt4Width: number;
  volt5Width: number;
  volt1Total: number | null;
  volt2Total: number | null;
  volt3Total: number | null;
  volt4Total: number | null;
  volt5Total: number | null;
}> = ({
  disabled,
  volt1Width,
  volt2Width,
  volt3Width,
  volt4Width,
  volt5Width,
  volt1Total,
  volt2Total,
  volt3Total,
  volt4Total,
  volt5Total,
}) => {
  const volt1FunBoxVoltInfo: FunBoxVoltInfo = {
    volt: 1,
    voltTotal: volt1Total,
    voltWidth: volt1Width,
    baseColor: "#637dff",
    colorProperty: "--cblue",
  };
  const volt2FunBoxVoltInfo: FunBoxVoltInfo = {
    volt: 2,
    voltTotal: volt2Total,
    voltWidth: volt2Width,
    baseColor: "#28EDBF",
    colorProperty: "--cgreen",
  };
  const volt3FunBoxVoltInfo: FunBoxVoltInfo = {
    volt: 3,
    voltTotal: volt3Total,
    voltWidth: volt3Width,
    baseColor: "#FFC003",
    colorProperty: "--cyellow",
  };
  const volt4FunBoxVoltInfo: FunBoxVoltInfo = {
    volt: 4,
    voltTotal: volt4Total,
    voltWidth: volt4Width,
    baseColor: "#A695FC",
    colorProperty: "--cpink",
  };
  const volt5FunBoxVoltInfo: FunBoxVoltInfo = {
    volt: 5,
    voltTotal: volt5Total,
    voltWidth: volt5Width,
    baseColor: "#905cff",
    colorProperty: "--cviolet",
  };
  const funBoxVoltInfos = [
    volt1FunBoxVoltInfo,
    volt2FunBoxVoltInfo,
    volt3FunBoxVoltInfo,
    volt4FunBoxVoltInfo,
    volt5FunBoxVoltInfo,
  ];

  funBoxVoltInfos.sort((a, b) => {
    return a.voltTotal !== null && b.voltTotal !== null
      ? b.voltTotal - a.voltTotal
      : a.voltTotal === null && b.voltTotal !== null
      ? b.voltTotal
      : a.voltTotal !== null && b.voltTotal === null
      ? 0 - a.voltTotal
      : 0;
  });

  return (
    <FunBoxContainer>
      {funBoxVoltInfos.map((info, idx) => {
        return (
          <ColoredBox
            key={info.volt}
            volt={info.volt}
            totalValue={info.voltTotal ? info.voltTotal.toFixed(4) : "0"}
            width={info.voltWidth}
            height={83}
            background={`-webkit-linear-gradient(0deg, ${info.baseColor} var(--p), var(${info.colorProperty}) 100%)`}
            zIndex={9 - idx}
            disabled={disabled}
            dimmed={info.voltTotal !== null ? info.voltTotal <= 0 : false}
          />
        );
      })}
    </FunBoxContainer>
  );
};

const ColoredBox: React.FC<{
  volt: VoltNumber;
  totalValue: string;
  width: number;
  height: number;
  background: string;
  zIndex: number;
  disabled: boolean;
  dimmed: boolean;
}> = ({
  volt,
  totalValue,
  width,
  height,
  background,
  zIndex,
  disabled,
  dimmed,
}) => {
  const { showTooltipFromEvent, hideTooltip } = useTooltip();

  return (
    <ColoredBoxContainer
      css={css({
        width,
        height,
        background,
        zIndex,
        opacity: disabled ? "0.4" : "inherit",
        filter: dimmed ? "brightness(0.6)" : undefined,
      })}
      onMouseEnter={(event) =>
        showTooltipFromEvent(
          <ColoredBoxTooltip volt={volt} totalValue={totalValue} />,
          event
        )
      }
      onMouseLeave={() => hideTooltip()}
      onMouseMove={(event) =>
        showTooltipFromEvent(
          <ColoredBoxTooltip volt={volt} totalValue={totalValue} />,
          event
        )
      }
    >
      <LeftDiagonalLine />
      <VerticalAndTopLine />
      <RightDiagonalLine css={css({ left: width - 20 })} />
    </ColoredBoxContainer>
  );
};

const ColoredBoxTooltip: React.FC<{
  volt: VoltNumber;
  totalValue: string;
}> = ({ volt, totalValue }) => {
  const result = (
    <div
      css={css`
        background: hsla(230, 15%, 15%, 0.9);
        backdrop-filter: blur(2px);
        border-radius: 4px;
        padding: 6px 12px;
        color: #ffffff;
        /* Theres weird artifacts due to backdrop filter. we need to scale to fix */
        transform: translate(0%, 60px) scale(1.01);
        transition: transform 0.1s !important;
        z-index: 6;
        font-family: "Euclid Circular B";
        -webkit-backface-visibility: hidden;
        -moz-backface-visibility: hidden;
        -webkit-transform: translate3d(0, 0, 0);
        -moz-transform: translate3d(0, 0, 0);
      `}
    >
      <div>
        {`Volt ${volt}`}
        <table
          css={css`
            td:first-of-type {
            }
            .dolla {
              padding-left: 4px;
              text-align: right;
            }
          `}
        >
          <tbody>
            <tr
              css={css`
                font-size: 14px;
              `}
            >
              <td>Total: ${totalValue}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  return result;
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: left;
  width: 100%;
  z-index: 1;
`;

const Divider = styled.div`
  border: 1px solid #5d5d64;
  height: 60%;
  align-self: center;

  @media (max-width: 1000px) {
    height: 90%;
  }
`;

const FunBoxContainer = styled.div`
  display: flex;
  flex-direction: row;
  --notchSize: 20px;
  cursor: pointer;

  div:not(:last-child) {
    margin-right: -20px;
  }
`;

const FunBoxAndStatsRow = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0 40px 20px 40px;
  gap: 30px;
  font-family: "Euclid Circular B";

  @media (max-width: 1000px) {
    flex-direction: column;
    ${FunBoxContainer} {
      align-self: center;
    }
  }
  @media (max-width: 650px) {
    ${Divider} {
      height: 0px;
      width: 100%;
    }
  }
`;

const gradientAnimationSetup = css`
  @property --p {
    syntax: "<percentage>";
    inherits: false;
    initial-value: 40%;
  }
  @property --l {
    syntax: "<length>";
    inherits: false;
    initial-value: 10px;
  }
  @property --a {
    syntax: "<angle>";
    inherits: false;
    initial-value: 10deg;
  }
  @property --cblue {
    syntax: "<color>";
    inherits: false;
    initial-value: #03c9ff;
  }
  @property --cgreen {
    syntax: "<color>";
    inherits: false;
    initial-value: #5ed241;
  }
  @property --cyellow {
    syntax: "<color>";
    inherits: false;
    initial-value: #cfe600;
  }
  @property --cpink {
    syntax: "<color>";
    inherits: false;
    initial-value: #f27ee3;
  }
  @property --cviolet {
    syntax: "<color>";
    inherits: false;
    initial-value: #d4b3ff;
  }
`;

const ColoredBoxContainer = styled.div`
  position: relative;
  transition: --p 0.5s ease-in, --l 0.5s ease-in, --a 0.5s ease-in,
    --cblue 0.5s ease-in, --cgreen 0.5s ease-in, --cyellow 0.5s ease-in,
    --cpink 0.5s ease-in, --cviolet 0.5s ease-in, all 0.5s ease-in;
  --p: 40%;
  --l: 10px;
  --a: 10deg;
  --cblue: #03c9ff;
  --cgreen: #5ed241;
  --cyellow: #cfe600;
  --cpink: #f27ee3;
  --cviolet: #d4b3ff;

  &:hover {
    --p: 0%;
    --l: 70px;
    --a: 180deg;
    --cblue: #03f2ff;
    --cgreen: #b7ff00;
    --cyellow: #fbff00;
    --cpink: #ff00dd;
    --cviolet: #9850f6;
  }

  clip-path: polygon(
    0% var(--notchSize),
    0px 0%,
    calc(100% - var(--notchSize)) 0%,
    100% var(--notchSize),
    100% calc(100%),
    calc(100% - var(--notchSize)) 100%,
    var(--notchSize) 100%,
    0% calc(100% - var(--notchSize))
  );
`;

const VerticalAndTopLine = styled.div`
  position: relative;
  left: 20px;
  top: 19px;
  height: 77px;
  border-left: 1px solid #1a1c22;
  border-top: 1px solid #1a1c22;
  transition: all 0.5s ease-in;
`;

const LeftDiagonalLine = styled.div`
  position: relative;
  border-bottom: 1px solid #1a1c22;
  width: 29px;
  transform: rotate(44deg);
  transform-origin: top left;
  transition: all 0.5s ease-in;
`;

const RightDiagonalLine = styled.div`
  position: absolute;
  border-bottom: 1px solid #1a1c22;
  width: 29px;
  transform: rotate(44deg);
  transform-origin: top left;
  top: 0px;
  transition: all 0.5s ease-in;
`;

const Stats = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  flex-grow: 3;
  justify-content: space-evenly;

  @media (max-width: 650px) {
    flex-direction: column;
    padding: 20px 0;
  }
`;

const StatsItem = styled.div`
  display: flex;
  flex-direction: column;
  align-self: center;

  @media (max-width: 650px) {
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
  }
`;
const StatsItemTitle = styled.div`
  font-weight: 400;
  font-size: 14px;
  color: #ceced8;
  @media (max-width: 650px) {
    align-self: end;
  }
`;

const StatsItemText = styled.div`
  font-family: "Recoleta";
  font-weight: 500;
  font-size: 25px;
  color: white;
  line-height: 1;

  @media (max-width: 650px) {
    line-height: 0.8; // Because this becomes a horizontal row
  }
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
`;

const UpArrow = styled.div`
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  align-self: center;
  margin-bottom: 2px;
  border-bottom: 10px solid #0cb03a;
`;

const DownArrow = styled.div`
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  align-self: center;
  margin-bottom: 2px;
  border-bottom: 0;
  border-top: 10px solid #ef3a25;
`;
