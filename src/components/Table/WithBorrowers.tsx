import { FunctionComponent } from "react";
import styled from "@emotion/styled";
import { Popover } from "antd";
import { TooltipPlacement } from "antd/lib/tooltip";
import { css } from "@emotion/react";
import { Typography } from "common/components/Typography";

interface WithBorrowersProps {
  borrowersIcon: string[];
  popoverContent?: string;
  popoverPosition?: TooltipPlacement;
}

export const WithBorrowers: FunctionComponent<WithBorrowersProps> = ({
  borrowersIcon,
  popoverContent = "Something here",
  popoverPosition = "top",
}) => {
  const isGreaterThan5 = borrowersIcon?.length > 5;

  return (
    <WithBorrowersWrapper>
      {borrowersIcon.slice(0, 5).map((borrowerIcon: string, idx: number) => (
        <Popover
          destroyTooltipOnHide
          key={idx}
          placement={popoverPosition}
          content={
            <div
              css={css`
                display: flex;
                flex-direction: column;
                align-items: center;
              `}
            >
              <Typography
                variant="bodyS"
                css={css`
                  margin-bottom: 0;
                `}
              >
                BORROWER
              </Typography>
              <Typography
                variant="bodyS"
                css={css`
                  font-weight: 500;
                  margin-bottom: 0;
                `}
              >
                {popoverContent}
              </Typography>
            </div>
          }
        >
          <BorrowerCycle>{borrowerIcon}</BorrowerCycle>
        </Popover>
      ))}
      {isGreaterThan5 && (
        <LastCycle>
          <div>+{borrowersIcon?.length - 5}</div>
        </LastCycle>
      )}
      {borrowersIcon?.length === 0 && <div>None</div>}
    </WithBorrowersWrapper>
  );
};

const WithBorrowersWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const BorrowerCycle = styled.div`
  height: 24px;
  width: 24px;
  border-radius: 50%;
  border: 1px solid #404355;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: -4px;
  background: #0b090e;
  &:first-child {
    margin-left: 0px;
  }
`;

const LastCycle = styled.div`
  height: 28px;
  width: 28px;
  border-radius: 50%;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: -4px;
  background: ${(props) => props.theme.palette.grey[400]};
  & div {
    font-family: "Inter";
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 18px;
    text-align: center;
    color: #475467;
  }
`;
