import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { UserDepositStatus } from "./YourAssetsTable";
import { SubvoltDef10 } from "../registry10";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { useState } from "react";
import { AsyncButton09 } from "09/Button09";
import useOwnedTokenAccounts from "hooks/useOwnedTokenAccounts";
import {
  cancelPendingDepositForVolt,
  cancelPendingWithdrawalsForVolt,
} from "09/transactionHandler";

export const StatusButton: React.FC<{
  status: UserDepositStatus;
  formattedAmount: string;
  def: SubvoltDef10;
}> = ({ status, formattedAmount, def }) => {
  const [showCancel, setShowCancel] = useState(false);
  const ownedTokenAccountsContext = useOwnedTokenAccounts();

  const color =
    status === UserDepositStatus.PendingDeposit
      ? Yellow
      : status === UserDepositStatus.PendingWithdrawal
      ? Yellow
      : ActiveWidth;
  const dotColor =
    status === UserDepositStatus.PendingDeposit
      ? YellowDot
      : status === UserDepositStatus.PendingWithdrawal
      ? YellowDot
      : null;
  return showCancel ? (
    <AsyncButton09
      label={
        status === UserDepositStatus.PendingDeposit
          ? "Cancel Deposit"
          : "Cancel Withdraw"
      }
      onClick={async (goodies, event) => {
        if (event) {
          event.stopPropagation();
        }

        if (status === UserDepositStatus.PendingDeposit) {
          await cancelPendingDepositForVolt(
            goodies,
            def,
            ownedTokenAccountsContext
          );
        } else {
          await cancelPendingWithdrawalsForVolt(
            goodies,
            def,
            ownedTokenAccountsContext
          );
        }

        setShowCancel(false);
      }}
    />
  ) : (
    <Status
      css={css`
        ${color}
        justify-content: ${status === UserDepositStatus.ActivelyEarning
          ? "left"
          : "space-around"};
      `}
    >
      <Dot css={dotColor} />
      <Col>
        <PendingText>
          {status === UserDepositStatus.PendingDeposit
            ? "Pending deposit"
            : status === UserDepositStatus.PendingWithdrawal
            ? "Pending withdrawal"
            : "Actively earning"}
        </PendingText>
        {status !== UserDepositStatus.ActivelyEarning && (
          <PendingText>{formattedAmount}</PendingText>
        )}
      </Col>
      {status !== UserDepositStatus.ActivelyEarning && (
        <CancelOutlinedIcon
          onClick={(e) => {
            e.stopPropagation();
            setShowCancel(true);
          }}
          css={YellowCancelIcon}
        />
      )}
    </Status>
  );
};

const Status = styled.div`
  color: #00c137;
  display: flex;
  flex-direction: row;
  padding: 4px 10px;
  gap: 10px;
  justify-content: center;
  align-items: center;
  min-width: 127px;
  border: 1px solid #004d16;
  border-radius: 16px;
  white-space: nowrap;
  font-size: 12px;
  font-weight: 500;
`;

const Col = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: left;
`;
const PendingText = styled.div`
  line-height: 1.4;
`;
const Dot = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 6px;
  background: #00c137;
`;

const YellowDot = css`
  background: #f8cc3e;
`;

const YellowCancelIcon = css`
  color: #f8cc3e;
  cursor: pointer;
`;

const Yellow = css`
  color: #f8cc3e;
  border: 1px solid #776119;
  border-radius: 8px;
  justify-content: left;
`;

const ActiveWidth = css`
  width: 130px;
  gap: 6px;
`;
