import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { FunctionComponent } from "react";

import { breakpoints } from "../../09/breakpoints09";
import {
  getVoltBolt,
  getVoltGlowBorderStyles,
  getVoltSpan,
} from "../../09/glow09";
import { Typography } from "common/components/Typography";
import { LayoutSection } from "../../app/BaseLayout";
import { LendingOption } from "../../components/LendingOption";
import { VoltsNavigationBar } from "../../components/VoltsNavigationBar";
import { VoltNumber } from "../../09/registry10";
import {
  dataDisplayWrapper,
  Item,
  ItemRow,
} from "common/components/DataDisplay/DataDisplay";
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

export const VoltsView: FunctionComponent<{
  voltNumber: VoltNumber;
}> = ({ voltNumber }) => {
  const Bolt = getVoltBolt(voltNumber);
  const Span = getVoltSpan(voltNumber);
  const border = getVoltGlowBorderStyles(voltNumber);
  const { openModal, modalSesameBall } = useManagementModal();

  const handleSetGlobalId = () => {
    openModal("mainnet_income_call_ftt");
  };

  return (
    <>
      <VoltsNavigationBar />
      <LayoutSection>
        <div
          css={css`
            display: flex;
            flex-direction: row;
            width: 100%;
            justify-content: space-between;
            align-items: center;
          `}
        >
          <Landing>
            <div
              css={css`
                display: flex;
                flex-direction: row;
              `}
            >
              <Typography
                variant="h3"
                css={css`
                  font-weight: 700;
                `}
              >
                Lending
              </Typography>
              <div
                css={css`
                  margin-left: 16px;
                  display: flex;
                  align-items: center;
                  height: fit-content;
                  padding: 6px 12px;
                  ${border}
                  opacity: 1;
                `}
              >
                <Bolt
                  css={css`
                    width: 18px;
                    height: 23px;
                  `}
                />
                <Span
                  css={css`
                    margin-left: 8px;
                    font-weight: bold;
                    font-size: 18px;
                    font-family: "Euclid Circular B";
                    font-weight: 700;
                  `}
                >
                  Volt {voltNumber}
                </Span>
              </div>
            </div>
            <Typography variant="bodyM">
              Deploy your crypto into a less risky strategy and begin earning a
              stable yield today! Lorem ipsum dolor sit amet, consectetur
              adipiscing elit. Cras neque magna, aliquam a est malesuada,
              gravida facilisis urna. Aliquam nec lacus Cras neque magna,
              aliquam a est malesuada, gravida facilisis urna. Aliquam nec lacus
            </Typography>
            <div
              css={css`
                ${dataDisplayWrapper}
              `}
            >
              <ItemRow
                css={(theme) => css`
                  ${theme.typography.bodyL}
                  font-weight: 500;
                  margin-bottom: 0;
                `}
              >
                <Item withDotUnderline>Loans Originated</Item>
                <Item>
                  <img
                    height="28"
                    width="28"
                    src={require("../../09/greatLogos/logos/USDC.png")}
                    alt="usdc"
                  />
                  $1,338,999,881 USDC
                </Item>
              </ItemRow>
              <ItemRow
                css={(theme) => css`
                  ${theme.typography.bodyL}
                  font-weight: 500;
                  margin-bottom: 0;
                `}
              >
                <Item withDotUnderline>Interest earned</Item>
                <Item>
                  <img
                    height="28"
                    width="28"
                    src={require("../../09/greatLogos/logos/USDC.png")}
                    alt="usdc"
                  />
                  $38,999,881 USDC
                </Item>
              </ItemRow>
              <ItemRow
                css={(theme) => css`
                  ${theme.typography.bodyL}
                  font-weight: 500;
                  margin-bottom: 0;
                `}
              >
                <Item withDotUnderline>Top Pool</Item>
                <Item>6.2% APY</Item>
              </ItemRow>
            </div>
          </Landing>
          <div
            css={css`
              height: 296px;
              width: 466px;
              background-color: #00ff0066;
              transform: rotate(6deg);
              ${breakpoints.medium} {
                display: none;
              }
            `}
          />
        </div>
      </LayoutSection>
      <LayoutSection>
        <div
          css={css`
            width: 100%;
            padding-top: 18px; // additional padding for the section.
          `}
        >
          <LendingOption onClick={handleSetGlobalId} />
        </div>
      </LayoutSection>
      <ZeroNineManagementModal modalSesameBall={modalSesameBall} />
    </>
  );
};
