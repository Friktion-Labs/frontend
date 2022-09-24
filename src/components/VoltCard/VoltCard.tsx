import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { useTheme } from "@mui/material";

import { Popover } from "antd";
import { FunctionComponent } from "react";
import { Link } from "react-router-dom";

import { ProgressBar } from "../ProgressBar";
import { formatUSDForPrice } from "../../09/format09";
import { Card } from "../../common/components/Card";
import { RedBar } from "../../09/glow09";
import { BoltIcon } from "../CustomIcon";

import { RedSpan } from "../../09/glow09";
import { Typography } from "common/components/Typography";
import { Button } from "common/components/Button";

export interface VoltCardProps {
  subVoltName: string;
  apy: number;
  yourDeposits: number;
  capacity: number;
  totalContributions: number;
  borrowersIcon: string[] | React.ReactNode[];
  onDeposit: () => void;
  onWithdraw?: (cardId: string) => void;
}

export const VoltCard: FunctionComponent<VoltCardProps> = ({
  subVoltName,
  apy,
  yourDeposits,
  capacity,
  totalContributions,
  borrowersIcon,
  onDeposit,
  onWithdraw,
}) => {
  const currentProgress = Math.max(
    5,
    Math.min(190, (totalContributions / capacity) ** 0.9 * 185 + 5)
  );
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  return (
    <Link
      css={(theme) => css`
        padding: 16px;
        width: calc(100% / 3);
        ${theme.breakpoints.down("lg")} {
          width: 50%;
        }
        ${theme.breakpoints.down("xs")} {
          width: 100%;
        }
      `}
      to={subVoltName}
      state={{
        subVoltName,
        apy,
        yourDeposits,
        capacity,
        totalContributions,
        borrowersIcon,
      }}
    >
      <Card glowDark={!!yourDeposits}>
        <VoltCardHeader>
          <BoltIcon
            css={(theme) => css`
              fill: ${theme.palette.mode === "dark"
                ? theme.palette.grey[400]
                : theme.palette.grey[500]};
            `}
            size="16"
          />
          <SubVolt>{subVoltName}</SubVolt>
        </VoltCardHeader>
        <VoltCardContent>
          <ApyContainer>
            <BoltIcon
              css={(theme) => css`
                fill: ${theme.palette.mode === "dark" ? "#000000" : "#CECED8"};
              `}
              height={128}
              width={98}
              className="logo"
            />
            <RedSpan>
              <ApyNumber>{apy}%</ApyNumber>
            </RedSpan>
            <ApyText>APY</ApyText>
          </ApyContainer>
          <YouDeposit>
            You deposited:{" "}
            <span
              css={css`
                font-weight: 600;
              `}
            >
              {yourDeposits.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </YouDeposit>
          <ProgressBar
            background={isDarkMode ? "#000000" : "#EBEBF2"}
            barComponent={<RedBar />}
            currentProgress={currentProgress}
          />
          <TotalContribution>
            Total contributions:{" "}
            <span
              css={css`
                font-weight: 600;
              `}
            >
              {formatUSDForPrice(totalContributions)}
            </span>
          </TotalContribution>{" "}
          <BorrowersWrapper>
            {borrowersIcon.map((borrowerIcon) => (
              <Popover
                destroyTooltipOnHide
                placement={"top"}
                css={css`
                  cursor: pointer;
                `}
                content={
                  <PopoverContent>
                    <p>Borrower</p>
                    <p>Alameda Research</p>
                  </PopoverContent>
                }
              >
                {borrowerIcon}
              </Popover>
            ))}
          </BorrowersWrapper>
          <Button
            css={css`
              min-width: 100%;
            `}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDeposit();
            }}
          >
            Deposit/Withdraw
          </Button>
        </VoltCardContent>
        {/** This is necessary for the bolt in the card to appear. */}
        <div
          css={css`
            position: absolute;
            height: 0;
            width: 0;
            pointer-events: none;
            opacity: 0;
            overflow: hidden;
          `}
        >
          <div
            css={css`
              position: absolute;
              left: -1000px;
            `}
          >
            <BoltIcon />
          </div>
        </div>
      </Card>
    </Link>
  );
};

const SubVolt = styled.div`
  font-weight: 500;
  font-size: 12px;
  line-height: 24px;
  letter-spacing: 0.04em;
  color: ${({ theme }) =>
    theme.palette.mode === "dark"
      ? theme.palette.grey[400]
      : theme.palette.grey[500]};
  text-transform: uppercase;
`;

const VoltCardHeader = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
  justify-content: center;
  align-items: center;
`;

const VoltCardContent = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 12px;
`;

export const ApyContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  flex-direction: column;
  z-index: 1;
  height: 128px;
  justify-content: center;

  .logo {
    position: absolute;
    opacity: 0.16;
    z-index: 0;
  }
`;

export const ApyNumber = styled(
  (props: { className?: string; children?: React.ReactNode }) => (
    <Typography {...props} variant="h2" />
  )
)`
  font-weight: 700;
  z-index: 1;
`;

export const ApyText = styled.div`
  font-size: 18px;
  line-height: 18px;
  z-index: 1;
  text-align: center;
`;

const YouDeposit = styled(
  (props: { className?: string; children?: React.ReactNode }) => (
    <Typography {...props} variant="bodyXs" />
  )
)`
  margin-bottom: 0;
  color: ${(props) =>
    props.theme.palette.mode === "dark"
      ? props.theme.palette.grey[400]
      : undefined};
`;

const TotalContribution = styled(
  (props: { className?: string; children?: React.ReactNode }) => (
    <Typography {...props} variant="bodyXs" />
  )
)`
  margin-bottom: 0;
`;

const BorrowersWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 24px;
  min-height: 56px;
  svg path {
    fill: ${({ theme }) =>
      theme.palette.mode === "dark" ? "#ffffff" : "#0B090E"};
  }
`;

const PopoverContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  & p:first-of-type {
    ${(props) => props.theme.typography.bodyXs}
    margin-bottom: 0;
    color: #5d5d64;
    text-transform: uppercase;
  }

  & p:last-child {
    ${(props) => props.theme.typography.bodyXs}
    font-weight: 500;
    margin-bottom: 0;
    color: ${(props) => props.theme.palette.grey[900]};
  }
`;
