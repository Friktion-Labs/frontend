import styled from "@emotion/styled";
import { css } from "@emotion/react";

import { FunctionComponent, useState } from "react";

import { useTabs, TabPanel, TabSelector } from "../Tabs";
import { LoanCard } from "../LoanCard";
import { ListView } from "../LendingOption";
import { ReviewLoanCard } from "../ReviewLoanCard";

import { RequestLoanForm } from "../Forms";

import { Typography } from "common/components/Typography";
import { Button } from "common/components/Button";

interface RequestLoanPageProps {}
const stepsDefault = [
  {
    name: "Pool Selection",
    status: 1,
  },
  {
    name: "Loan details",
    status: 0,
  },
  {
    name: "Review",
    status: 0,
  },
];
export const RequestLoanPage: FunctionComponent<RequestLoanPageProps> = (
  props
) => {
  const { selectedTab, setSelectedTab } = useTabs(
    stepsDefault.map((step) => step.name)
  );
  // We can use setSteps to update the status of step
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [steps, setSteps] = useState(stepsDefault);

  return (
    <RequestLoanContainer>
      <RequestTitle>Request a loan</RequestTitle>
      <RequestDesc>
        Pick a Pool to borrow from, provide loan details, submit for approval{" "}
      </RequestDesc>
      <RequestSteps>
        {stepsDefault.map(({ name, status }, idx) => (
          <StepSelector
            isActive={selectedTab === name}
            onClick={() => setSelectedTab(name)}
          >
            <StepNumber isActive={selectedTab === name}>
              {!!status ? (
                <img
                  height="18"
                  width="18"
                  src={require("../../09/greatLogos/logos/checked.svg")}
                  alt="checked"
                />
              ) : (
                idx + 1
              )}
            </StepNumber>
            {name}
          </StepSelector>
        ))}
      </RequestSteps>
      <TabPanelContainer>
        <TabPanel
          hidden={selectedTab !== steps[0].name}
          css={css`
            display: flex;
            width: 100%;
            flex-direction: column;
            gap: 26px;
          `}
        >
          <ListView>
            {[
              {
                subVoltName: "APOLLO",
                rank: 1,
                borrowersIconPath: [
                  require("../../09/greatLogos/logos/ALAMEDA.svg"),
                  require("../../09/greatLogos/logos/MAVEN11.svg"),
                ],
                capacity: 123443,
                totalContributions: 80000,
                target: {
                  from: 10,
                  to: 14,
                },
                rate: 80,
              },
              {
                subVoltName: "ATHENA",
                rank: 2,
                borrowersIconPath: [
                  require("../../09/greatLogos/logos/MAVEN11.svg"),
                ],

                capacity: 300000,
                totalContributions: 8430,
                target: {
                  from: 42,
                  to: 52,
                },
                rate: 7,
              },
              {
                subVoltName: "HERMES",
                rank: 3,
                borrowersIconPath: [],

                capacity: 10000,
                totalContributions: 2000,
                target: {
                  from: 3,
                  to: 10,
                },
                rate: 20,
              },
            ].map((props) => (
              <LoanCard
                {...props}
                onClick={() => setSelectedTab("Loan details")}
              />
            ))}
          </ListView>
        </TabPanel>
        <TabPanel hidden={selectedTab !== steps[1].name}>
          <RequestLoanForm
            handleSubmit={() => setSelectedTab("Review")}
            handleCancel={() => setSelectedTab("Pool Selection")}
          />
        </TabPanel>
        <TabPanel hidden={selectedTab !== steps[2].name}>
          <div
            css={css`
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              width: 100%;
              gap: 32px;
            `}
          >
            <ReviewLoanCard
              loanAmount={200000}
              collateralAmount={200}
              rate={14}
              term="1 Year"
              startDate="24 May 2022"
              endDate="23 May 2023"
              rePayments="Monthly"
              originationFee={5}
              totalRepayment={238000}
            />
            <div
              css={css`
                display: flex;
                flex-direction: row;
                gap: 26px;
                justify-content: center;
                align-items: center;
                width: 100%;
              `}
            >
              <Button variant="secondary">Back</Button>
              <Button>Submit request</Button>
            </div>
          </div>
        </TabPanel>
      </TabPanelContainer>
    </RequestLoanContainer>
  );
};

const RequestLoanContainer = styled.div`
  display: flex;
  flex-direction: column;
  font-family: "SF Pro";
  font-style: normal;
  text-align: center;
`;
const RequestTitle = styled(
  (props: { className?: string; children?: React.ReactNode }) => (
    <Typography {...props} variant="h3" />
  )
)`
  font-weight: 700;
  color: #fdfdfe;
  margin-bottom: 6px;
`;
const RequestDesc = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 21px;
  color: #ebebf2;
  margin-bottom: 38px;
`;
const RequestSteps = styled.div`
  display: flex;
  flex-direction: row;
  gap: 48px;
  justify-content: center;
  margin-bottom: 51px;
`;

const StepSelector = styled(TabSelector)`
  padding-bottom: 0;
  gap: 12px;
  display: flex;
  flex-direction: row;
  ${({ isActive }) => isActive && `color: #FDFDFE; font-weight: 400;`}
  &:after {
    display: none;
  }
`;

const StepNumber = styled.div<{ isActive: boolean }>`
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  height: 24px;
  width: 24px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  ${({ isActive, theme }) =>
    isActive
      ? `
        background: linear-gradient(90deg, #ff47c2 0%, #ffa18f 100%);
        color: ${theme.palette.grey[900]};
      
      `
      : `
        background: #404355;
        color: ${theme.palette.grey[400]};
      `};
`;

const TabPanelContainer = styled.div``;
