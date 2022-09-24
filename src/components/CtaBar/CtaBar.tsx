import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { FunctionComponent } from "react";
import { Typography } from "common/components/Typography";
import { Button } from "common/components/Button";

const CtaContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 80px;
  padding: 16px 24px;
  border-radius: 8px;

  ${({ theme }) => {
    const isDarkMode = theme.palette.mode === "dark";

    return `
      background: ${
        isDarkMode
          ? `linear-gradient(
            180.27deg,
            #23242f 0.31%,
            #121317 99.84%
          )`
          : "#ffffffa6"
      };
      border: 1px solid ${isDarkMode ? "#ffffff12" : "#ffffff33"};
      box-shadow: ${isDarkMode ? "none" : "0px 4px 32px #fbf1f461"};
    `;
  }}
`;

const CtaWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const LogoWrapper = styled.div`
  height: 50px;
  width: 50px;
  margin-right: 16px;

  background-color: red;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const CtaLabel = styled(
  (props: { className?: string; children?: React.ReactNode }) => (
    <Typography {...props} variant="bodyM" />
  )
)`
  color: ${({ theme }) =>
    theme.palette.mode === "dark" ? "#FFFFFF" : "#000000"};
`;

const CtaValue = styled(
  (props: { className?: string; children?: React.ReactNode }) => (
    <Typography {...props} variant="bodyS" />
  )
)`
  color: ${({ theme }) =>
    theme.palette.mode === "dark" ? "#FFFFFF" : "#000000"};
`;

export const CtaBar: FunctionComponent<{
  logoPath: string;
  label: string;
  value: string;
  ctaLabel: string;
  onClick?: () => void;
}> = ({ logoPath, label, value, ctaLabel, onClick }) => {
  return (
    <CtaContainer>
      <CtaWrapper>
        <LogoWrapper>{logoPath}</LogoWrapper>
        <ContentWrapper>
          <CtaLabel>{label}</CtaLabel>
          <CtaValue>{value}</CtaValue>
        </ContentWrapper>
      </CtaWrapper>
      <div
        css={css`
          flex: 1;
        `}
      />
      <Button onClick={onClick}>{ctaLabel}</Button>
    </CtaContainer>
  );
};
