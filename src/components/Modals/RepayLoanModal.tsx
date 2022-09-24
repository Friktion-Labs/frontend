import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { FunctionComponent } from "react";
import { Modal, ModalTitle } from "common/components/Modal";
import { Button } from "common/components/Button";
import { Item, ItemRow } from "common/components/DataDisplay/DataDisplay";

type RepayloanModalProps = {
  handleOk: () => void;
  handleCancel: () => void;
  isModalVisible: boolean;
  setIsCompletedModalVisible: (e: boolean) => void;

  payment: string;
  apy: number;
  loanAmount: number;
  currentInstalment: number;
  dueDate: string;
  walletBalance: number;
};

export const RepayLoanModal: FunctionComponent<RepayloanModalProps> = ({
  handleOk,
  handleCancel,
  isModalVisible,
  setIsCompletedModalVisible,
  payment,
  apy,
  loanAmount,
  currentInstalment,
  dueDate,
  walletBalance,
}) => {
  const handlePayNow = () => {
    handleCancel();
    setIsCompletedModalVisible(true);
  };

  return (
    <Modal
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={false}
      closable={false}
      width={530}
      zeroPadding
    >
      <RepayLoanWrapper>
        <RepayLoanContainer>
          <Title>Repay loan</Title>
          <RepayLoanContent>
            <ItemRow>
              <Item>Payment</Item>
              <Item>{payment}</Item>
            </ItemRow>
            <ItemRow>
              <Item>APY</Item>
              <Item>{apy}%</Item>
            </ItemRow>
            <ItemRow>
              <Item>Loan Amount</Item>
              <Item>
                <img
                  height="28"
                  width="28"
                  src={require("../../09/greatLogos/logos/USDC.png")}
                  alt="usdc"
                />
                <div>{loanAmount?.toLocaleString("en-US")} USDC</div>
              </Item>
            </ItemRow>
            <ItemRow>
              <Item>Current Instalment</Item>
              <Item>
                <img
                  height="28"
                  width="28"
                  src={require("../../09/greatLogos/logos/USDC.png")}
                  alt="usdc"
                />
                <div>{currentInstalment?.toLocaleString("en-US")} USDC</div>
              </Item>
            </ItemRow>
            <ItemRow>
              <Item>Due Date</Item>
              <Item>{dueDate}</Item>
            </ItemRow>
          </RepayLoanContent>
          <Button
            css={css`
              min-width: 100%;
            `}
            onClick={handlePayNow}
          >
            Pay now
          </Button>
        </RepayLoanContainer>
        <WalletBalance>
          <div>Wallet balance</div>
          <div>{walletBalance} SOL</div>
        </WalletBalance>
      </RepayLoanWrapper>
    </Modal>
  );
};

const Title = styled(ModalTitle)`
  margin-bottom: 0;
  text-align: left;
`;

const RepayLoanContent = styled.div``;

const RepayLoanContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  font-size: 18px;
  line-height: 28px;
`;
const WalletBalance = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 16px;
  line-height: 24px;
  color: ${({ theme }) =>
    theme.palette.mode === "dark"
      ? "#ceced8 !important"
      : "#5D5D64 !important"};
`;

const RepayLoanWrapper = styled.div`
  width: 530px;
  height: 100%;
  padding: 32px;
  font-family: "SF Pro";
  font-style: normal;
  font-weight: 500;
  color: ${({ theme }) => theme.palette.text.primary};
  gap: 24px;
  display: flex;
  flex-direction: column;
  & ${ItemRow}:first-child {
    padding-top: 0;
  }
  & ${ItemRow}:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;
