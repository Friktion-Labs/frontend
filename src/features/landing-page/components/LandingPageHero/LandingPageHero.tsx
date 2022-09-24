import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { Typography } from "common/components/Typography";
import { LayoutContainer } from "common/components/LayoutContainer";
import { APP_BAR_HEIGHT, APP_BAR_MARGIN_BOTTOM } from "features/app-bar";
import { TimeWithFriktionAnimation } from "./TimeWithFriktionAnimation";
import { DescriptionText } from "../DescriptionText";
import kudelskiLogo from "./kudelski-logo.png";
import { ButtonLink09 } from "09/Button09";
import { pinkCTAStyles } from "09/HeaderVoltsDropdown";

export const LandingPageHero = () => {
  return (
    <LayoutContainer
      fixed
      css={css`
        margin-bottom: 60px;
      `}
    >
      <LandingPageHeroLayout>
        <LandingPageText>
          <AuditContainer
            href="https://docs.friktion.fi/protocol/security"
            target="_blank"
            css={(theme) => css`
              ${theme.breakpoints.down("md")} {
                display: none;
              }
            `}
          >
            <Typography
              variant="bodyXs"
              css={(theme) => css`
                color: ${theme.palette.grey[500]};
                font-size: 10px !important;
                margin-right: 4px;
                user-select: none;
              `}
            >
              AUDITED BY
            </Typography>
            <KudelskiContainer
              css={css`
                user-select: none;
              `}
            >
              <img src={kudelskiLogo} alt="Kuldelski Logo" height="24px" />
            </KudelskiContainer>
          </AuditContainer>
          <Typography
            variant="h2"
            css={(theme) => css`
              font-weight: 500;
              user-select: none;
              line-height: 54px;
              ${theme.breakpoints.down("md")} {
                font-size: 40px;
                line-height: 38px;
              }
            `}
          >
            Smarter returns on your crypto
          </Typography>
          <DescriptionText variant="bodyL">
            Diversify your portfolio with strategies powered by Friktion.
          </DescriptionText>
          <ButtonLink09 to="/volts" css={ctaButton}>
            Get started
          </ButtonLink09>
          <AuditContainer
            href="https://docs.friktion.fi/protocol/security"
            target="_blank"
            css={(theme) => css`
              display: none;
              ${theme.breakpoints.down("md")} {
                display: flex;
              }
            `}
          >
            <Typography
              variant="bodyXs"
              css={(theme) => css`
                color: ${theme.palette.grey[500]};
                font-size: 10px !important;
              `}
            >
              AUDITED BY
            </Typography>
            <KudelskiContainer>
              <img src={kudelskiLogo} alt="Kuldelski Logo" height="20px" />
            </KudelskiContainer>
          </AuditContainer>
        </LandingPageText>
        <TimeWithFriktionAnimation />
      </LandingPageHeroLayout>
    </LayoutContainer>
  );
};

const LandingPageHeroLayout = styled.div`
  // allow mobile background overlay to stretch to app bar
  transform: translateY(-${APP_BAR_HEIGHT + APP_BAR_MARGIN_BOTTOM}px);
  margin-top: ${APP_BAR_HEIGHT + APP_BAR_MARGIN_BOTTOM}px;
  margin-bottom: -${APP_BAR_HEIGHT + APP_BAR_MARGIN_BOTTOM}px;

  display: flex;
  align-items: center;
  padding: 18px 22px;
  justify-content: space-between;

  ${({ theme }) => theme.breakpoints.down("md")} {
    padding: 18px 22px;
    justify-content: flex-start;
    flex-direction: column;
    gap: 47px;
  }
`;

const LandingPageText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 420px;
`;

const AuditContainer = styled.a`
  display: flex;
  gap: 6px;
  align-items: center;
`;

const KudelskiContainer = styled.div`
  opacity: 0.8;
`;

const ctaButton = (theme: any) => css`
  ${pinkCTAStyles(theme)}
  align-self: flex-start;
  padding: 12px 32px;
  margin-top: 16px;
  justify-content: center;
  width: min-content;
`;
