import { FunctionComponent } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { Popover } from "antd";
import { useTheme } from "@mui/material";

import { ProgressBar } from "../ProgressBar";
import { formatUSDForPrice } from "../../09/format09";
import { Card } from "../../common/components/Card";
import { RedBar } from "../../09/glow09";
import { BoltIcon } from "../CustomIcon";
import { Button as ButtonCommon } from "common/components/Button";
import { VerifiedIcon } from "../CustomIcon";

interface LoanCardProps {
  subVoltName: string;
  rank: number;
  borrowersIconPath: string[];
  capacity: number;
  totalContributions: number;
  target: {
    from: number;
    to: number;
  };
  rate: number;
  onClick?: () => void;
}

export const LoanCard: FunctionComponent<LoanCardProps> = ({
  subVoltName,
  capacity,
  totalContributions,
  borrowersIconPath,
  target,
  rate,
  rank,
  onClick,
}) => {
  const theme = useTheme();
  const currentProgress = Math.max(
    5,
    Math.min(190, (totalContributions / capacity) ** 0.9 * 185 + 5)
  );

  return (
    <Card>
      <LoanCardHeader>
        <VerifiedLenders>
          <Popover
            destroyTooltipOnHide
            placement="bottom"
            css={css`
              cursor: pointer;
            `}
            content={
              <PopoverContent>
                <div>Verified Lenders</div>
                <div>Click to view</div>
              </PopoverContent>
            }
          >
            <div>
              <VerifiedIcon />
            </div>
          </Popover>
        </VerifiedLenders>

        <BoltIcon fill={theme.palette.grey[400]} size="16" />
        <SubVolt>{subVoltName}</SubVolt>
        <Rank>#{rank}</Rank>
      </LoanCardHeader>
      <BorrowersWrapper>
        {borrowersIconPath.length > 0 ? (
          borrowersIconPath.map((borrowerIcon) => (
            <Popover
              destroyTooltipOnHide
              placement="bottom"
              css={css`
                cursor: pointer;
              `}
              content={
                <PopoverBorrowContent>
                  <div>Borrower</div>
                  <div>Alameda Research</div>
                </PopoverBorrowContent>
              }
            >
              <img height="34" src={borrowerIcon} alt="borrower's icon" />
            </Popover>
          ))
        ) : (
          <NewButton>New</NewButton>
        )}
      </BorrowersWrapper>
      <LoanCardContent>
        <CapacityInVolt>
          <div
            css={css`
              align-self: flex-start;
            `}
          >
            {`${formatUSDForPrice(capacity)}`} in Volt
          </div>
          <ProgressBar
            barComponent={<RedBar />}
            currentProgress={currentProgress}
          />
        </CapacityInVolt>
        <TargetContainer>
          <Target>
            <div>
              {target?.from}-{target?.to}%
            </div>
            <div>Target ARP</div>
          </Target>
          <TargetLine />
          <Target>
            <div>{rate}%</div>
            <div>Utilization Rate</div>
          </Target>
        </TargetContainer>
      </LoanCardContent>
      <Button onClick={onClick}>Select</Button>
    </Card>
  );
};

const SubVolt = styled.div`
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0.2em;
  color: ${(props) => props.theme.palette.grey[400]};
  text-transform: uppercase;
`;

const Rank = styled.div`
  font-weight: 700;
  font-size: 12px;
  line-height: 18px;
  color: ${(props) => props.theme.palette.grey[400]};
`;

const LoanCardHeader = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const VerifiedLenders = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
`;

const LoanCardContent = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 54px;
`;

const CapacityInVolt = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  & div:first-child {
    font-size: 14px;
    line-height: 21px;
    color: #ffffff;
  }
`;

const TargetContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 12px;
`;

const Target = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 15px 18px;

  & div:first-child {
    font-weight: 700;
    font-size: 24px;
    line-height: 30px;
    background: linear-gradient(90deg, #ff47c2 0%, #ffa18f 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
  }
  & div:last-child {
    font-weight: 500;
    font-size: 14px;
    line-height: 21px;
    color: #ffffff;
  }
`;

const TargetLine = styled.div`
  height: 48px;
  width: 1px;
  color: ${(props) => props.theme.palette.grey[400]};
  opacity: 0.5;
`;

const BorrowersWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 24px;
  min-height: 74px;
`;

const Button = styled(ButtonCommon)`
  background: ${(props) => props.theme.palette.grey[900]};
  color: ${(props) => props.theme.palette.grey[400]};
  border-radius: 4px;
  border: none;
  min-width: 100%;
  :hover {
    background: ${(props) => props.theme.palette.grey[900]};
    color: ${(props) => props.theme.palette.grey[400]};
  }
`;

const NewButton = styled(ButtonCommon)`
  color: ${(props) => props.theme.palette.grey[900]};
  border-radius: 4px;
  font-weight: 500;
  font-size: 20px;
  line-height: 30px;
  min-width: 60px;
  padding: 4px 13px;
`;

const PopoverContent = styled.div`
  text-align: center;
  & div:first-child {
    font-weight: 500;
    font-size: 12px;
    line-height: 18px;
    color: ${(props) => props.theme.palette.grey[900]};
  }
  & div:last-child {
    font-weight: 600;
    font-size: 10px;
    line-height: 24px;
    text-transform: uppercase;
    color: ${(props) => props.theme.palette.grey[600]};
  }
`;

const PopoverBorrowContent = styled.div`
  & div:first-child {
    font-weight: 600;
    font-size: 10px;
    line-height: 24px;
    text-align: center;
    color: ${(props) => props.theme.palette.grey[600]};
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  & div:last-child {
    font-weight: 500;
    font-size: 12px;
    line-height: 18px;
    color: ${(props) => props.theme.palette.grey[900]};
  }
`;
