import { css } from "@emotion/react";
import { Typography } from "common/components/Typography";
import {
  AssetsHeader,
  AssetsSectionContainer,
  GridContainer,
  ViewOption,
} from "../components/assets-section";
import {
  // Header,
  StrategyContainer,
  StrategyDescription,
  VoltInformation,
} from "../components/volt-description";
import { LendingStats } from "../components/LendingStats";
import { LendingImage } from "../components/LendingImage";
import { columns, lendingData } from "../constants/lendingData";
import { VoltCard as OldVoltCard } from "components/VoltCard";
import {
  useManagementModal,
  ZeroNineManagementModal,
} from "09/ZeroNineManagementModal";
import { Table } from "components/Table";
import { useNavigate } from "react-router-dom";
// import { VoltsSelect } from "components/VoltsSelect";
import { breakpoints } from "09/breakpoints09";
import { VoltsNavigationBar } from "components/VoltsNavigationBar";
import { useViewMode } from "../hooks/useViewMode";

export const Lending = () => {
  const navigate = useNavigate();
  const { openModal, modalSesameBall } = useManagementModal();

  const handleSetGlobalId = () => {
    openModal("mainnet_income_call_ftt");
  };
  const { toggleViewMode, viewMode } = useViewMode();

  return (
    <>
      <VoltsNavigationBar
        css={css`
          margin-bottom: 32px;

          ${breakpoints.small} {
            display: none;
          }
        `}
      />
      {/* <VoltPageLayout> */}
      {/* <Header voltNumber={5}>
        Lending
        <VoltsSelect
          css={css`
            display: none;
            ${breakpoints.small} {
              display: block;
            }
          `}
          options={[
            {
              value: "Generate Income",
              label: "Generate Income",
              voltNumber: 1,
            },
            { value: "Lending", label: "Lending", voltNumber: 5 },
          ]}
          value={{ value: "Lending", label: "Lending", voltNumber: 5 }}
        />
      </Header> */}

      <VoltInformation
        css={css`
          flex-wrap: nowrap;
        `}
      >
        <StrategyContainer>
          <StrategyDescription>
            Deploy your crypto into a less risky strategy and begin earning a
            stable yield today! Lorem ipsum dolor sit amet, consectetur
            adipiscing elit. Cras neque magna, aliquam a est malesuada, gravida
            facilisis urna. Aliquam nec lacus Cras neque magna, aliquam a est
            malesuada, gravida facilisis urna. Aliquam nec lacus
          </StrategyDescription>
          <LendingStats />
        </StrategyContainer>
        <LendingImage />
      </VoltInformation>

      <AssetsSectionContainer>
        <AssetsHeader>
          <Typography
            variant="bodyXl"
            css={css`
              font-weight: 500;
            `}
          >
            Assets
          </Typography>
          <ViewOption viewMode={viewMode} toggleViewMode={toggleViewMode} />
        </AssetsHeader>
        <GridContainer>
          {viewMode === "grid" ? (
            lendingData.map((data, i) => (
              <OldVoltCard {...data} key={i} onDeposit={handleSetGlobalId} />
            ))
          ) : (
            <Table
              css={css`
                width: 100%;
                margin-top: 16px;
              `}
              columns={columns(handleSetGlobalId)}
              dataSource={lendingData}
              onRow={(record) => {
                return {
                  onClick: () =>
                    navigate(record.subVoltName, {
                      state: {
                        ...record,
                      },
                    }),
                };
              }}
            />
          )}
        </GridContainer>
      </AssetsSectionContainer>
      {/* </VoltPageLayout> */}
      <ZeroNineManagementModal modalSesameBall={modalSesameBall} />
    </>
  );
};
