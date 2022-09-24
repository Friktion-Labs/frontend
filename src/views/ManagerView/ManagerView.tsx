import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { Typography } from "common/components/Typography";
import { Button as ButtonCommon } from "common/components/Button";
import { AllLoanTable } from "../../components/AllLoanTable";
import { Calendar } from "common/components/Calendar";
import { CtaBar } from "../../components/CtaBar";
import { LayoutSection } from "../../app/BaseLayout";
import { SubVoltLoansTable } from "../../components/SubVoltLoansTable";
import {
  TabContainer,
  TabPanel,
  TabSelector,
  useTabs,
  useTabAnimation,
} from "../../components/Tabs";
import { useState } from "react";
import {
  ActiveLoanWarningModal,
  ChooseSubvoltModal,
  RejectWithCommentModal,
  ReviewBorrowRequestModal,
} from "../../components/Modals";
import { useNavigate } from "react-router";
import { BorrowRequestDropdown } from "components/Dropdown";
import { AlamedaIcon } from "components/CustomIcon";
import { Usdc } from "components/Icons";

const TABS = ["Apollo", "Athena", "All"]; // need to be dynamic

export const ManagerView = () => {
  const navigate = useNavigate();

  const [showChooseSubvoltModal, setShowChooseSubvoltModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showBorrowRequestModal, setShowBorrowRequestModal] = useState(false);
  const [showLoanReviewModal, setShowLoanReviewModal] = useState(false);
  const [showRejectWithCommentModal, setShowRejectWithCommentModal] =
    useState(false);

  const { selectedTab, setSelectedTab } = useTabs(TABS);

  const { handleSelectTab, currentWidth, transform, tabContainerRef } =
    useTabAnimation(56, 24, setSelectedTab);

  return (
    <>
      <ReviewBorrowRequestModal
        applicationType="borrow"
        isModalVisible={showBorrowRequestModal}
        handleCancel={() => setShowBorrowRequestModal(false)}
        handleOk={() => setShowBorrowRequestModal(false)}
      />
      <ReviewBorrowRequestModal
        isModalVisible={showLoanReviewModal}
        handleCancel={() => {
          setShowLoanReviewModal(false);
          setShowRejectWithCommentModal(true);
        }}
        handleOk={() => setShowLoanReviewModal(false)}
      />
      <RejectWithCommentModal
        isModalVisible={showRejectWithCommentModal}
        handleCancel={() => setShowRejectWithCommentModal(false)}
        handleOk={() => setShowRejectWithCommentModal(false)}
      />
      <ChooseSubvoltModal
        isModalVisible={showChooseSubvoltModal}
        handleCancel={() => setShowChooseSubvoltModal(false)}
        handleOk={() => navigate("create/subvolt")} // navigate to create a subvolt form
      />
      <ActiveLoanWarningModal
        isModalVisible={showReminderModal}
        handleCancel={() => setShowReminderModal(false)}
      />
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
            <VoltName>Welcome, Subvolt Manager</VoltName>
            <Typography variant="bodyM">
              Manage loans, applications and loan subvolts here.
            </Typography>
            <div
              css={css`
                display: flex;

                gap: 8px;
              `}
            >
              <BorrowRequestDropdown
                menuItems={[
                  {
                    href: "",
                    onClick: () => setShowBorrowRequestModal(true),
                    issuer: {
                      name: "Alameda Research",
                      icon: <AlamedaIcon />,
                    },
                    value: {
                      amount: "120,000,000",
                      currency: <Usdc />,
                    },
                  },
                  {
                    href: "",
                    onClick: () => setShowBorrowRequestModal(true),

                    issuer: {
                      name: "3 Arrows Capital",
                      icon: <AlamedaIcon />,
                    },
                    value: {
                      amount: "1,000,000",
                      currency: <Usdc />,
                    },
                  },
                ]}
              />
              <Button
                variant="outline-primary"
                voltNumber={4}
                onClick={() => setShowChooseSubvoltModal(true)}
              >
                Issue a new loan
              </Button>
            </div>
          </Landing>
          <Calendar activeDate={new Date("2022-06-30")} />
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
          label="New loan application"
          value="2 hours ago from Alameda Labs"
          ctaLabel="Review loan"
          onClick={() => setShowLoanReviewModal(true)}
        />
        <CtaBar
          logoPath="path"
          label="A repayment is late"
          value="Alameda Labs payment of 1150 USDC was due 5 days ago" // Alameda Labs, 1150 USDC, 5 days ago to be made variable instead
          ctaLabel="Send a reminder"
          onClick={() => setShowReminderModal(true)}
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
          <TabHeader>Your Subvolts</TabHeader>
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
          </div>
          <div>
            <TabPanel hidden={selectedTab !== "Apollo"}>
              <SubVoltLoansTable />
            </TabPanel>
            <TabPanel hidden={selectedTab !== "Athena"}>
              <SubVoltLoansTable />
            </TabPanel>
            <TabPanel hidden={selectedTab !== "All"}>
              <AllLoanTable />
            </TabPanel>
          </div>
        </div>
      </LayoutSection>
    </>
  );
};

const Button = styled(ButtonCommon)`
  width: 144px;
`;

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

const TabHeader = styled(
  (props: { className?: string; children?: React.ReactNode }) => (
    <Typography {...props} variant="h4" />
  )
)`
  font-weght: 500;
`;
