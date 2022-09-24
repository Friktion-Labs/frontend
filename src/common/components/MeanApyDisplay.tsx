import { VoltNumber } from "09/registry10";
import { css } from "@emotion/react";
import { Typography } from "./Typography";
import styled from "@emotion/styled";

export const MeanApyDisplay = ({
  voltNumber,
  children,
  parentWidth,
}: {
  voltNumber: VoltNumber;
  children: React.ReactNode;
  parentWidth?: number;
}) => (
  <div
    css={css`
      display: flex;
      align-items: center;
    `}
  >
    <Typography
      variant="h4"
      css={(theme) => css`
        text-align: right;
        color: ${theme.palette[
          voltNumber === 1
            ? "sky"
            : voltNumber === 2
            ? "electricity"
            : voltNumber === 3
            ? "neon"
            : voltNumber === 4
            ? "pink"
            : "lavender"
        ][theme.palette.mode === "dark" ? 500 : 800]};
        font-weight: 600;
        margin-bottom: 0;
      `}
    >
      {children}
    </Typography>
    <Typography
      component="div"
      variant="bodyXs"
      css={(theme) => css`
        color: ${theme.palette.mode === "dark"
          ? theme.palette.grey[400]
          : theme.palette.grey[600]};
        margin-left: 8px;
        margin-bottom: 0px;
        font-weight: 500;

        font-size: ${parentWidth !== undefined && parentWidth <= 400
          ? "10px"
          : parentWidth !== undefined && parentWidth < 550
          ? "12px"
          : "inherit"};
      `}
    >
      <div
        css={css`
          line-height: 1;
        `}
      >
        %
      </div>
      <div
        css={css`
          line-height: 1;
        `}
      >
        AVG APY
      </div>
    </Typography>
  </div>
);

export const Volt5MeanApyAndHedgeDisplay = ({
  children,
  parentWidth,
}: {
  children: React.ReactNode;
  parentWidth?: number;
}) => (
  <div
    css={css`
      display: flex;
      align-items: center;
      gap: 16px;
    `}
  >
    <div
      css={css`
        display: flex;
        align-items: center;
        gap: 8px;
      `}
    >
      <Typography
        variant="h4"
        css={(theme) => css`
          text-align: right;
          color: ${theme.palette["lavender"][
            theme.palette.mode === "dark" ? 500 : 800
          ]};
          font-weight: 600;
          margin-bottom: 0;
          font-size: ${parentWidth !== undefined && parentWidth <= 400
            ? "20px"
            : parentWidth !== undefined && parentWidth < 550
            ? "25px"
            : "30px"};
        `}
      >
        25
      </Typography>
      <Typography
        component="div"
        variant="bodyXs"
        css={(theme) => css`
          color: ${theme.palette.mode === "dark"
            ? theme.palette.grey[400]
            : theme.palette.grey[600]};
          margin-bottom: 0px;
          font-weight: 500;
          font-size: ${parentWidth !== undefined && parentWidth <= 400
            ? "10px"
            : parentWidth !== undefined && parentWidth < 550
            ? "12px"
            : "inherit"};
        `}
      >
        <div
          css={css`
            line-height: 1;
          `}
        >
          {parentWidth !== undefined && parentWidth <= 530 ? "% Price" : "%"}
        </div>
        <div
          css={css`
            line-height: 1;
          `}
        >
          {parentWidth !== undefined && parentWidth <= 530
            ? "Hedge"
            : "Price Hedge"}
        </div>
      </Typography>
    </div>
    <Divider />
    <div
      css={css`
        display: flex;
        align-items: center;
        gap: 8px;
      `}
    >
      <Typography
        variant="h4"
        css={(theme) => css`
          text-align: right;
          color: ${theme.palette["lavender"][
            theme.palette.mode === "dark" ? 500 : 800
          ]};
          font-weight: 600;
          margin-bottom: 0;
          font-size: ${parentWidth !== undefined && parentWidth <= 400
            ? "20px"
            : parentWidth !== undefined && parentWidth < 550
            ? "25px"
            : "30px"};
        `}
      >
        +{children}
      </Typography>
      <Typography
        component="div"
        variant="bodyXs"
        css={(theme) => css`
          color: ${theme.palette.mode === "dark"
            ? theme.palette.grey[400]
            : theme.palette.grey[600]};
          margin-bottom: 0px;
          font-weight: 500;
          font-size: ${parentWidth !== undefined && parentWidth <= 400
            ? "10px"
            : parentWidth !== undefined && parentWidth < 550
            ? "12px"
            : "inherit"};
        `}
      >
        <div
          css={css`
            line-height: 1;
          `}
        >
          {parentWidth !== undefined && parentWidth <= 530 ? "% Interest" : "%"}
        </div>
        <div
          css={css`
            line-height: 1;
          `}
        >
          {parentWidth !== undefined && parentWidth <= 530
            ? "Rate (APY)"
            : "Interest Rate (APY)"}
        </div>
      </Typography>
    </div>
  </div>
);

const Divider = styled.div`
  display: flex;
  width: 1px;
  height: 61%;
  background: rgba(255, 255, 255, 0.3);
`;
