import { FunctionComponent } from "react";
import styled from "@emotion/styled";
import { formatUSDForPrice } from "../../09/format09";
import { RedSpan } from "../../09/glow09";
import { Card } from "../../common/components/Card";
import {
  ApyContainer as ApyContainerVolt,
  ApyNumber,
  ApyText,
} from "../VoltCard";
import { Button as ButtonCommon } from "common/components/Button";
import { BoltIcon } from "components/CustomIcon";
import { css } from "@emotion/react";

interface SubVoltCardProps {
  className: string;
  yourDeposits: number;
  projectedEarnings: number;
  apy: number;
  onClick: () => void;
}

export const SubVoltCard: FunctionComponent<SubVoltCardProps> = ({
  yourDeposits,
  projectedEarnings,
  apy,
  onClick,
  className,
}) => {
  return (
    <SubVoltCardWapper className={className} onClick={onClick}>
      <SubVoltContainer>
        <LeftSideContainer>
          <LeftSide>
            <div>Your deposits</div>
            <div>{formatUSDForPrice(yourDeposits)}</div>
          </LeftSide>
          <LeftSide>
            <div>Projected earnings</div>
            <div>{formatUSDForPrice(projectedEarnings)}</div>
          </LeftSide>
        </LeftSideContainer>
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
          <ApyText>Current APY</ApyText>
        </ApyContainer>
      </SubVoltContainer>
      <Button fullWidth>Deposit/Withdraw</Button>
    </SubVoltCardWapper>
  );
};

const SubVoltCardWapper = styled(Card)`
  width: 353px;
  height: 100%;
  & > div:first-of-type {
    padding: 32px 32px 24px;
    gap: 32px;
  }
`;

const SubVoltContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 24px;
  justify-content: space-between;
`;

const LeftSideContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const LeftSide = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  & div:first-of-type {
    font-size: 12px;
    line-height: 12px;
    color: ${(props) => props.theme.palette.grey[400]};
  }
  & div:last-child {
    font-weight: 700;
    font-size: 16px;
    line-height: 16px;
  }
`;

const ApyContainer = styled(ApyContainerVolt)`
  height: 100%;
  padding: 0 16px;

  &:after {
    display: none;
  }

  .logo {
    position: absolute;
    opacity: 0.16;
    z-index: 0;
  }
`;
const Button = styled(ButtonCommon)`
  padding: 16px 75px;
  font-size: 16px;
`;
