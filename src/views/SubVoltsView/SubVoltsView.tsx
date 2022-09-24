import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { FunctionComponent } from "react";
import Select from "react-select";
import { useLocation } from "react-router-dom";

import { breakpoints } from "../../09/breakpoints09";
import { RedSpan } from "../../09/glow09";
import { BorrowLoanTable } from "../../components/BorrowLoanTable";
import {
  BoltIcon,
  InterestEarnedIcon,
  LoansOriginatedIcon,
  TopPoolIcon,
} from "../../components/CustomIcon";
import { LayoutSection } from "../../app/BaseLayout";
import { PoolUtilization } from "../../components/PoolUtilization";
import { StatisticBar } from "../../components/StatisticBar";
import { SubVoltCard } from "../../components/SubVoltCard";
import { Typography } from "common/components/Typography";
import {
  useManagementModal,
  ZeroNineManagementModal,
} from "09/ZeroNineManagementModal";

const Landing = styled.div`
  display: flex;
  max-width: 600px;
  flex-direction: column;
  justify-content: center;
`;

const Title = styled.div`
  font-family: "Inter";
  font-style: normal;
  font-weight: 500;
  font-size: 21px;
  line-height: 25px;
  color: #ffffff;
`;

export const ViewOption = styled.div`
  height: 40px;
  background: #282a35;
  border-radius: 4px;
  cursor: pointer;
  & span {
    font-family: "SF Pro";
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 21px;
    color: #ceced8;
  }

  .react-select__control {
    padding-left: 10px;
    cursor: pointer;

    border-color: transparent;

    display: flex;
    background: transparent;
    box-shadow: none;

    .react-select__single-value {
      color: #fff !important;
    }

    @media print {
      & {
        border-color: hsl(230, 15%, 60%);
        color: hsl(230, 15%, 60%);
      }
    }
    background: transparent;
    transition: 0.1s all ease-out;
  }
  .react-select__control:hover {
    background: hsl(230, 15%, 17%);
    /* animation: selectHoverAnim 0.3s ease-out forwards; */
  }
  .react-select__indicator-separator {
    background-color: transparent;
    /* first place to uncomment if we want the separator (second place below) */
    /* @keyframes colorAnim {
        from {
          background-color: transparent;
        }
        to {
          background-color: hsl(0, 0%, 80%);
        }
      } */
  }
  .react-select__control:hover {
    animation: selectHoverAnim 0.3s ease-out forwards;
  }
  /* second place to uncomment if we want the separator (first place above) */
  /* .react-select__control:hover .react-select__indicator-separator {
      animation: colorAnim 0.3s ease-out forwards;
    } */

  .react-select__menu {
    background: hsl(230, 15%, 18%);
    box-shadow: 0 0 16px rgba(0, 0, 0, 0.5);
  }
`;

export const SubVoltsView: FunctionComponent = () => {
  const location = useLocation();
  const subVoltName = location.pathname.split("/").pop()!; // alternative method.
  const apy = 19;
  const yourDeposits = 123;
  const { openModal, modalSesameBall } = useManagementModal();

  const handleSetGlobalId = () => {
    openModal("mainnet_income_call_ftt");
  };

  const data: { logo: JSX.Element; label: string; value: string }[] = [
    {
      logo: <LoansOriginatedIcon size={40} />,
      label: "Pool Utilization",
      value: "45%",
    },
    {
      logo: <InterestEarnedIcon size={40} />,
      label: "Loans originated",
      value: "$222,444",
    },
    {
      logo: <TopPoolIcon size={40} />,
      label: "Total interest earned",
      value: "$35,600",
    },
    {
      logo: <TopPoolIcon size={40} />,
      label: "Borrower Risk Score",
      value: "AAA",
    },
    {
      logo: <LoansOriginatedIcon size={40} />,
      label: "Current APY",
      value: `${apy}%`,
    },
  ];

  return (
    <>
      <LayoutSection>
        <div
          css={css`
            display: flex;
            flex-direction: row;
            width: 100%;
            align-items: flex-start;
            justify-content: space-between;

            ${breakpoints.medium} {
              flex-direction: column;
            }
          `}
        >
          <Landing>
            <RedSpan
              css={css`
                margin-bottom: 32px;
              `}
            >
              <p
                css={(theme) => css`
                  ${theme.typography.bodyM}
                  font-weight: 700;

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
                Volt #05 - Lending
              </p>
            </RedSpan>
            <div
              css={css`
                display: flex;
                flex-direction: row;
                align-items: center;
                margin-bottom: 24px;
              `}
            >
              <div
                css={css`
                  display: flex;
                  align-items: center;
                  margin-right: 16px;
                `}
              >
                <img
                  height="72"
                  src={require("./logos/1.png")}
                  alt="borrower's icon"
                  css={css`
                    margin-left: -12px;
                  `}
                />
                <img
                  height="72"
                  src={require("./logos/2.png")}
                  alt="borrower's icon"
                  css={css`
                    margin-left: -60px;
                  `}
                />
                <img
                  height="72"
                  src={require("./logos/3.png")}
                  alt="borrower's icon"
                  css={css`
                    margin-left: -60px;
                  `}
                />
                <img
                  height="72"
                  src={require("./logos/4.png")}
                  alt="borrower's icon"
                  css={css`
                    margin-left: -60px;
                  `}
                />
              </div>
              <Typography
                variant="h3"
                css={css`
                  font-weight: 700;
                `}
              >
                {subVoltName}
              </Typography>
            </div>
            <p
              css={(theme) => css`
                ${theme.typography.bodyM}
              `}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras
              neque magna, aliquam a est malesuada, gravida facilisis urna.
            </p>
          </Landing>
          <div>
            <SubVoltCard
              className="mainnet_income_call_ftt card_mainnet_income_call_ftt"
              yourDeposits={yourDeposits}
              projectedEarnings={280}
              apy={apy}
              onClick={handleSetGlobalId}
            />
            <ZeroNineManagementModal modalSesameBall={modalSesameBall} />
          </div>
        </div>
      </LayoutSection>
      <LayoutSection>
        <StatisticBar data={data} size="small" />
      </LayoutSection>
      <LayoutSection>
        <div
          css={css`
            margin-top: 32px;
            height: 100%;
            width: 100%;
          `}
        >
          <PoolUtilization />
        </div>
      </LayoutSection>
      <LayoutSection>
        <div
          css={css`
            margin-top: 32px;
            display: flex;
            flex-direction: column;
            width: 100%;
            gap: 26px;

            ${breakpoints.medium} {
              display: none;
            }
          `}
        >
          <div
            css={css`
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
            `}
          >
            <Title>All Loans for Apollo</Title>
            <ViewOption>
              <Select
                options={[{ value: "01", label: "Funding & Active (All)" }]}
                placeholder="No filter"
                value={{ value: "01", label: "Funding & Active (All)" }}
                classNamePrefix="react-select"
              />
            </ViewOption>
          </div>
          <BorrowLoanTable />
        </div>
      </LayoutSection>
    </>
  );
};
