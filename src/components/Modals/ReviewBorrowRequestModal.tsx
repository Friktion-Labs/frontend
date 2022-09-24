import { FunctionComponent } from "react";
import styled from "@emotion/styled";
import { Button } from "common/components/Button";
import { Modal, ModalTitle } from "common/components/Modal";
import { CloseOutlined } from "@ant-design/icons";
import { Typography } from "common/components/Typography";
import { CheckOutlined, DeleteOutlined } from "@ant-design/icons";
import { Btc, Usdc } from "../Icons";

type ReviewBorrowRequestModalProps = {
  handleOk: () => void;
  handleCancel: () => void;
  isModalVisible: boolean;
  applicationType?: "borrow" | "loan";
  data?: {
    borrower: {
      name: string;
      logo: React.ReactNode;
    };
    loanAmount: {
      amount: string;
      currency: string;
    };
    collateralAmount: {
      amount: string;
      currency: string;
    };
    rate: string;
    term: string;
    startDate: string;
    endDate: string;
    repayments: string;
    originationFee: string;
    totalRepayment: {
      amount: string;
      currency: string;
    };
  };
};

export const ReviewBorrowRequestModal: FunctionComponent<
  ReviewBorrowRequestModalProps
> = ({ handleOk, handleCancel, isModalVisible, applicationType }) => {
  return (
    <Modal
      width={532}
      visible={isModalVisible}
      footer={[
        <Button
          onClick={handleCancel}
          variant="outline-primary"
          voltNumber={4}
          fullWidth
          withIcons={<DeleteOutlined />}
        >
          {applicationType === "borrow" ? "Cancel request" : "Reject"}
        </Button>,
        <Button onClick={handleOk} fullWidth withIcons={<CheckOutlined />}>
          {applicationType === "borrow" ? "Done" : "Accept"}
        </Button>,
      ]}
      onOk={handleOk}
      onCancel={handleCancel}
      closeIcon={
        <CloseOutlined
          style={{ color: "#5D5D64", width: "12px", height: "12px" }}
        />
      }
    >
      <ModalContent>
        <Title>
          {applicationType === "borrow"
            ? "Review borrow request"
            : "Review loan"}
        </Title>
        <ModalRow>
          <RowLabel>Borrower</RowLabel>
          <RowValue>Alameda labs</RowValue>
        </ModalRow>
        <ModalRow>
          <RowLabel dotted>Loan Amount</RowLabel>
          <RowValue>
            <Usdc />
            200,000 USDC
          </RowValue>
        </ModalRow>
        <ModalRow>
          <RowLabel dotted>Collateral Amount</RowLabel>
          <RowValue>
            <Btc />
            200 BTC
          </RowValue>
        </ModalRow>
        <ModalRow>
          <RowLabel dotted>Rate</RowLabel>
          <RowValue>14%</RowValue>
        </ModalRow>
        <ModalRow>
          <RowLabel>Term</RowLabel>
          <RowValue>1 Year</RowValue>
        </ModalRow>
        <ModalRow>
          <RowLabel>Start Date</RowLabel>
          <RowValue>24 May 2022</RowValue>
        </ModalRow>
        <ModalRow>
          <RowLabel>End Date</RowLabel>
          <RowValue>23 May 2023</RowValue>
        </ModalRow>
        <ModalRow>
          <RowLabel>Repayments</RowLabel>
          <RowValue>Monthly</RowValue>
        </ModalRow>
        <ModalRow>
          <RowLabel dotted light>
            Origination fee
          </RowLabel>
          <RowValue>5%</RowValue>
        </ModalRow>
        <ModalRow noBorder>
          <RowLabel>Total repayment</RowLabel>
          <RowValue>
            <Usdc />
            238,000 USDC
          </RowValue>
        </ModalRow>
      </ModalContent>
    </Modal>
  );
};

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0px;
  width: 100%;
`;

const ModalRow = styled.span<{ noBorder?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: ${({ noBorder }) => (noBorder ? "none" : "1px solid #404355")};
  padding-top: 12px;
  padding-bottom: ${({ noBorder }) => (noBorder ? "0px" : "12px")};
`;

const RowLabel = styled(
  (props: { className?: string; children?: React.ReactNode }) => (
    <Typography {...props} variant="bodyL" />
  )
)<{
  dotted?: boolean;
  light?: boolean;
}>`
  margin: 0px;
  text-decoration: ${({ dotted }) => (dotted ? "underline dotted" : "none")};
  color: ${({ theme }) => theme.palette.text.primary};
`;

const RowValue = styled(
  (props: { className?: string; children?: React.ReactNode }) => (
    <Typography {...props} variant="bodyL" />
  )
)`
  margin: 0px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.palette.text.primary};
`;

const Title = styled(ModalTitle)`
  align-self: flex-start;
  margin-bottom: 8px;
`;
