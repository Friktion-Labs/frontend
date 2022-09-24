import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { Popover, Switch } from "antd";
import { useState } from "react";
import Select from "react-select";

import { ViewOption } from "../SubVoltsView";

import { RedSpan } from "../../09/glow09";
import { ApplicationsTable } from "../../components/ApplicationsTable";
import { Calendar } from "common/components/Calendar";
import { CtaBar } from "../../components/CtaBar";
import { BoltIcon } from "../../components/CustomIcon";
import { LoanTable } from "../../components/LoanTable";
import { LayoutSection } from "../../app/BaseLayout";
import { PaymentHistoryTable } from "../../components/PaymentHistoryTable";
import {
  TabPanel,
  TabSelector,
  useTabs,
  TabContainer,
  useTabAnimation,
} from "../../components/Tabs";
import { Typography } from "common/components/Typography";
import { Button as ButtonCommon } from "common/components/Button";
import { Item, ItemRow } from "common/components/DataDisplay/DataDisplay";

const sampleData: {
  label: string;
  value: string;
  logo?: string;
  popover?: string;
}[] = [
  {
    label: "Outstanding Loans",
    value: "$1,338,999",
    logo: "USDC",
    popover: "Something here",
  },
  {
    label: "Total Loans",
    value: "$222,444,333",
    logo: "BTC",
    popover: "Something here",
  },
  {
    label: "Active Loans",
    value: "3",
  },
];

const Landing = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 600px;

  gap: 8px;
`;

const VoltName = styled(
  (props: { className?: string; children?: React.ReactNode }) => (
    <Typography {...props} variant="h3" />
  )
)`
  font-weight: 700;
  color: #fff;
  width: fit-content;
  margin-bottom: 0;

  @media (max-width: 490px) {
    font-size: 20px;
  }
`;

const Button = styled(ButtonCommon)`
  width: 132px;
  min-width: 132px;
  border-radius: 8px;
`;

const TABS = ["Active loans", "Applications", "Payment history"];

export const LoansView = () => {
  const { selectedTab, setSelectedTab } = useTabs(TABS);
  const [hideMature, setHideMature] = useState(true);

  const { handleSelectTab, currentWidth, transform, tabContainerRef } =
    useTabAnimation(94, 24, setSelectedTab);

  return (
    <>
      <LayoutSection>
        <div
          css={css`
            display: flex;
            flex-direction: row;
            width: 100%;
            justify-content: space-between;
          `}
        >
          <Landing>
            <RedSpan>
              <p
                css={css`
                  font-size: 18px;
                  font-weight: bold;
                  line-height: 24px;

                  display: flex;
                  align-items: center;
                  margin-bottom: 0;
                `}
              >
                <BoltIcon
                  fill="url(#volt5)"
                  height={18}
                  width={14}
                  css={css`
                    margin-right: 8px;
                  `}
                />
                Volt #05
              </p>
            </RedSpan>
            <VoltName>Your Loans</VoltName>
            <p
              css={css`
                font-size: 16px;
                line-height: 24px;
              `}
            >
              Welcome back, lameda Research. Create and manage loans funded by
              the Friktion company.
            </p>
            <Button>Create a Loan</Button>
            <div
              css={(theme) => css`
                ${theme.typography.bodyL}
                margin-top: 16px;

                & ${ItemRow}:last-child {
                  border-bottom: none;
                  padding-bottom: 0;
                }
              `}
            >
              {sampleData.map(({ label, value, logo, popover }) => (
                <ItemRow
                  css={css`
                    margin-bottom: 0;
                  `}
                >
                  {popover ? (
                    <Popover
                      destroyTooltipOnHide
                      placement="bottom"
                      css={css`
                        cursor: pointer;
                      `}
                      content={popover}
                    >
                      <Item withDotUnderline>{label}</Item>
                    </Popover>
                  ) : (
                    <Item>{label}</Item>
                  )}
                  <Item>
                    {logo && (
                      <img
                        height="28"
                        width="28"
                        src={require(`../../09/greatLogos/logos/${logo}.png`)}
                        alt={logo}
                      />
                    )}
                    {value}
                  </Item>
                </ItemRow>
              ))}
            </div>
          </Landing>
          <CardContainer>
            {/* 6.048e8 = 1 week from today */}
            <Calendar activeDate={new Date(Date.now() + 6.048e8)} />
            <CalendarCard>
              <CardHeading>24 May 2023</CardHeading>
              <CardDescription>$5,235,000 due on Apollo Loan</CardDescription>
            </CalendarCard>
          </CardContainer>
        </div>
      </LayoutSection>
      <LayoutSection
        css={css`
          gap: 30px;
          margin-bottom: 62px;
        `}
      >
        <div
          css={css`
            width: 100%;
            padding-top: 18px; // additional padding for the section.
          `}
        />
        <CtaBar
          logoPath="path"
          label="You have been offered a loan"
          value="Please review the terms."
          ctaLabel="Review loan offer"
        />
      </LayoutSection>
      <LayoutSection>
        <div
          css={css`
            display: flex;
            flex-direction: column;
            width: 100%;
          `}
        >
          <TabHeader>All Loans</TabHeader>
          <div
            css={css`
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
              padding-bottom: 4px;
            `}
            ref={tabContainerRef}
          >
            <TabContainer transform={transform} currentWidth={currentWidth}>
              {TABS.map((tab, idx) => (
                <TabSelector
                  isActive={selectedTab === tab}
                  onClick={(e: React.SyntheticEvent | Event) =>
                    handleSelectTab(tab, idx, e)
                  }
                  key={idx}
                >
                  {tab}
                </TabSelector>
              ))}
            </TabContainer>
            <div
              css={css`
                flex: 1;
              `}
            />
            {selectedTab !== "Payment history" && (
              <MaturityToggleWrapper>
                <MaturityToggleLabel>Hide mature</MaturityToggleLabel>
                <div
                  css={css`
                    display: block;
                  `}
                >
                  <Switch
                    checked={hideMature}
                    onClick={() => setHideMature(!hideMature)}
                  />
                </div>
              </MaturityToggleWrapper>
            )}
            <SortBySelectionWrapper>
              <SortBySelectionLabel>Sort by</SortBySelectionLabel>
              <ViewOption
                css={css`
                  padding-bottom: 21px;
                `}
              >
                <Select
                  className="invisibleSelector"
                  options={[{ value: "01", label: "Due date" }]}
                  placeholder="No filter"
                  value={{ value: "01", label: "Due date" }}
                  classNamePrefix="react-select"
                />
              </ViewOption>
            </SortBySelectionWrapper>
          </div>
          <div>
            <TabPanel hidden={selectedTab !== "Active loans"}>
              <LoanTable />
            </TabPanel>
            <TabPanel hidden={selectedTab !== "Applications"}>
              <ApplicationsTable />
            </TabPanel>
            <TabPanel hidden={selectedTab !== "Payment history"}>
              <PaymentHistoryTable />
            </TabPanel>
          </div>
        </div>
      </LayoutSection>
    </>
  );
};

const SortBySelectionWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: center;
  gap: 16px;
  padding-bottom: calc(
    21px - 1em
  ); // 21px is the TabSelector padding bottom. 1em is "p" default margin-bottom
`;

const SortBySelectionLabel = styled.p`
  line-height: 24px;
`;

const MaturityToggleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: center;
  gap: 16px;
  margin-right: 32px;
  padding-bottom: 21px - 1em;

  .ant-switch-checked {
    background: linear-gradient(90deg, #ff47c2 0%, #ffa18f 100%);
  }
`;

const MaturityToggleLabel = styled.p`
  line-height: 24px;
`;

const TabHeader = styled(
  (props: { className?: string; children?: React.ReactNode }) => (
    <Typography {...props} variant="h4" />
  )
)`
  font-weight: 500;
`;

const CardContainer = styled.div`
  display: flex;
  gap: 16px;
  flex-direction: column;
`;

const CalendarCard = styled.div`
  text-align: left;
  width: 100%;
  font-weight: 500;
  font-size: 14px;
  line-height: 21px;
  background: linear-gradient(180.27deg, #23242f 0.31%, #121317 99.84%);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 8px;
  padding: 16px;
`;

const CardHeading = styled.p`
  color: ${(props) => props.theme.palette.grey[400]};
  margin-bottom: 8px;
`;

const CardDescription = styled.p`
  color: #ffffff;
  margin-bottom: 0px;
`;
