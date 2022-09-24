import { css } from "@emotion/react";
import styled from "@emotion/styled";

export const LendingStats = () => (
  <>
    <ItemRow
      css={(theme) => css`
        ${theme.typography.bodyL}
        font-weight: 500;
        margin-bottom: 0;
      `}
    >
      <Item withDotUnderline>Loans Originated</Item>
      <Item>
        <img
          height="28"
          width="28"
          src={require("09/greatLogos/logos/USDC.png")}
          alt="usdc"
        />
        $1,338,999,881 USDC
      </Item>
    </ItemRow>
    <ItemRow
      css={(theme) => css`
        ${theme.typography.bodyL}
        font-weight: 500;
        margin-bottom: 0;
      `}
    >
      <Item withDotUnderline>Interest earned</Item>
      <Item>
        <img
          height="28"
          width="28"
          src={require("09/greatLogos/logos/USDC.png")}
          alt="usdc"
        />
        $38,999,881 USDC
      </Item>
    </ItemRow>
    <ItemRow
      css={(theme) => css`
        ${theme.typography.bodyL}
        font-weight: 500;
        margin-bottom: 0;
      `}
      lastRow
    >
      <Item withDotUnderline>Top Pool</Item>
      <Item>6.2% APY</Item>
    </ItemRow>
  </>
);

const ItemRow = styled.div<{ lastRow?: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 16px 0;

  ${({ theme, lastRow }) =>
    !lastRow &&
    `border-bottom: 1px solid ${
      theme.palette.mode === "dark" ? "#404355" : "#EBEBF2"
    };`}
`;

const Item = styled.div<{
  withDotUnderline?: boolean;
  withDarkColor?: boolean;
}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  color: ${({ theme }) => (theme.palette.mode === "dark" ? "white" : "black")};
  ${({ withDotUnderline, theme }) =>
    withDotUnderline &&
    `
      text-decoration: dotted;
      text-decoration-line: underline;
      text-decoration-color: ${theme.palette.grey[400]};
      text-underline-position: under;
    `}
  ${({ withDarkColor, theme }) =>
    withDarkColor && `color: ${theme.palette.grey[400]};`};
`;
