import { FunctionComponent } from "react";
import styled from "@emotion/styled";
import moment from "moment";
import { Card } from "../../common/components/Card";
import {
  dataDisplayWrapper,
  Item,
  ItemRow,
} from "common/components/DataDisplay/DataDisplay";

interface ReviewLoanCardProps {
  loanAmount: number;
  collateralAmount: number;
  rate: number;
  term: string;
  startDate: string;
  endDate: string;
  rePayments: string;
  originationFee: number;
  totalRepayment: number;
}

export const ReviewLoanCard: FunctionComponent<ReviewLoanCardProps> = ({
  loanAmount,
  collateralAmount,
  rate,
  term,
  startDate,
  endDate,
  rePayments,
  originationFee,
  totalRepayment,
}) => {
  return (
    <LoanCardWrapper>
      <ItemRow>
        <Item withDotUnderline>Loan Amount</Item>
        <Item>
          <img
            height="28"
            width="28"
            src={require("../../09/greatLogos/logos/USDC.png")}
            alt="usdc"
          />
          <div>{loanAmount.toLocaleString("en-US")} USDC</div>
        </Item>
      </ItemRow>
      <ItemRow>
        <Item withDotUnderline>Collateral Amount</Item>
        <Item>
          <img
            height="28"
            width="28"
            src={require("../../09/greatLogos/logos/BTC.png")}
            alt="btc"
          />
          <div>{collateralAmount} BTC</div>
        </Item>
      </ItemRow>
      <ItemRow>
        <Item withDotUnderline>Rate</Item>
        <Item>{rate}%</Item>
      </ItemRow>
      <ItemRow>
        <Item>Term</Item>
        <Item>{moment(term).fromNow(true)}</Item>
      </ItemRow>
      <ItemRow>
        <Item>Start Date</Item>
        <Item>{moment(startDate).format("DD MMM YYYY")}</Item>
      </ItemRow>
      <ItemRow>
        <Item>End Date</Item>
        <Item>{moment(endDate).format("DD MMM YYYY")}</Item>
      </ItemRow>
      <ItemRow>
        <Item>Repayments</Item>
        <Item>{rePayments}</Item>
      </ItemRow>
      <ItemRow>
        <Item withDotUnderline colored>
          Origination fee
        </Item>
        <Item colored>{originationFee}%</Item>
      </ItemRow>
      <ItemRow>
        <Item>Total repayment</Item>
        <Item>
          <img
            height="28"
            width="28"
            src={require("../../09/greatLogos/logos/USDC.png")}
            alt="usdc"
          />
          <div>{totalRepayment.toLocaleString("en-US")} USDC</div>
        </Item>
      </ItemRow>
    </LoanCardWrapper>
  );
};

const LoanCardWrapper = styled(Card)`
  ${dataDisplayWrapper}
  width: 530px;
  height: 100%;
  & > div:first-child {
    font-weight: 500;
    font-size: 18px;
    line-height: 28px;
    color: #f4f4f8;
    padding: 24px;
    gap: 0;
  }
`;
