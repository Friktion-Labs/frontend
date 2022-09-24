import { Card09Props } from "09/Card10";
import { Interpolation, css, Theme } from "@emotion/react";
import { useMediaQuery } from "@mui/material";
import { PerformanceIcon } from "./PerformanceIcon";
import { SmallHeader } from "../SmallHeader";
import { Link } from "react-router-dom";
import styled from "@emotion/styled";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import {
  InfoCardProps,
  InfoCard,
  InfoCardContent,
  InfoCardHeader,
  InfoCardDescription,
} from "./info-card";
import { VoltNumber } from "09/registry10";
import {
  useVoltMeanApyAndIcons,
  ValidIcon,
} from "common/hooks/useVoltMeanApyAndIcons";
import {
  MeanApyDisplay,
  Volt5MeanApyAndHedgeDisplay,
} from "common/components/MeanApyDisplay";
import { useElementSize } from "usehooks-ts";
import { ImportantAssetLogos } from "09/greatLogos/assetLogos";

export const PerformanceCard = ({
  cards,
  children,
  voltNumber,
  ...rest
}: InfoCardProps & { cards: Card09Props[]; voltNumber: VoltNumber }) => {
  return (
    <InfoCard {...rest}>
      <InfoCardContent>
        <PerformanceIcon
          voltNumber={voltNumber}
          css={css`
            margin-right: 18px;
            flex: 0 0 auto;
          `}
        />
        <div>
          <InfoCardHeader>PERFORMANCE</InfoCardHeader>
          <InfoCardDescription>{children}</InfoCardDescription>
        </div>
      </InfoCardContent>
      <PerformanceSummary
        voltNumber={voltNumber}
        showAnalyticsLink={voltNumber !== 5}
      />
    </InfoCard>
  );
};

interface PerformanceSummaryIconsProps {
  allValidIcons: ValidIcon[];
  parentWidth?: number;
}
export const PerformanceSummaryIcons = ({
  allValidIcons,
  parentWidth,
}: PerformanceSummaryIconsProps) => {
  const areInfoCardsSideBySide = useMediaQuery(
    "(max-width: 1030px) and (min-width: 785px)"
  );
  const isSmall = useMediaQuery("(max-width: 530px)");
  const isShowLessIcons = areInfoCardsSideBySide || isSmall;
  const iconCount = isShowLessIcons ? 3 : 5;

  const andMoreCount = allValidIcons.length - iconCount;

  return (
    <div
      css={css`
        display: flex;
        align-items: center;
      `}
    >
      <div
        css={css`
          padding-right: 10px;
        `}
      >
        {allValidIcons.slice(0, iconCount).map(({ src, card }) => (
          <img
            key={src}
            css={css`
              width: 32px;
              height: 32px;
              margin-right: -10px;
            `}
            src={src}
            alt={card.underlyingAssetSymbol}
          />
        ))}
      </div>
      {allValidIcons.length > iconCount && (
        <SmallHeader
          css={(theme) => css`
            color: ${theme.palette.mode === "dark"
              ? "#A7A7B1"
              : theme.palette.grey[500]};
            margin-left: 6px;
            flex: 1 0 auto;
            display: flex;
            flex-direction: column;
            font-size: ${parentWidth !== undefined && parentWidth <= 355
              ? "10px"
              : parentWidth !== undefined && parentWidth < 400
              ? "12px"
              : "inherit"};
          `}
        >
          <span>&amp; {andMoreCount}</span>
          <span>MORE</span>
        </SmallHeader>
      )}
    </div>
  );
};

export const Volt5PerformanceSummaryIcons = () => {
  const usdc = ImportantAssetLogos["USDC"];
  const sol = ImportantAssetLogos["SOL"];
  return (
    <div
      css={css`
        display: flex;
        align-items: center;
      `}
    >
      <div
        css={css`
          padding-right: 10px;
        `}
      >
        <img
          key={sol}
          css={css`
            width: 32px;
            height: 32px;
            margin-right: -10px;
          `}
          src={sol}
          alt={"SOL"}
        />
        <img
          key={usdc}
          css={css`
            width: 32px;
            height: 32px;
            margin-right: -10px;
          `}
          src={usdc}
          alt={"USDC"}
        />
      </div>
    </div>
  );
};

interface PerformanceSummaryProps {
  voltNumber: VoltNumber;
  css?: Interpolation<Theme>;
  showAnalyticsLink?: boolean;
}
export const PerformanceSummary = ({
  voltNumber,
  showAnalyticsLink,
  ...rest
}: PerformanceSummaryProps) => {
  const { allValidIcons, meanApy, cards } = useVoltMeanApyAndIcons(voltNumber);
  const [wrapperRef, { width: wrapperWidth }] = useElementSize();

  //#TODO: jaso add volt 5 path
  const voltAnalyticsLinkPath =
    voltNumber === 2
      ? "/analytics/fpSOL"
      : voltNumber === 3
      ? "/analytics/fcrabBTC"
      : voltNumber === 4
      ? "/analytics/fbasisSOL"
      : "/analytics/fcSOL";

  return (
    <div
      ref={wrapperRef}
      css={(theme) => css`
        background: ${theme.palette.mode === "dark"
          ? "#000000"
          : theme.palette.grey[100]};
        display: flex;
        justify-content: space-between;
        padding: ${showAnalyticsLink && wrapperWidth <= 355
          ? "8px 12px"
          : showAnalyticsLink && wrapperWidth < 400
          ? "8px 14px"
          : "8px 24px"};
      `}
      {...rest}
    >
      {voltNumber === 5 ? (
        <Volt5MeanApyAndHedgeDisplay parentWidth={wrapperWidth}>
          {meanApy}
        </Volt5MeanApyAndHedgeDisplay>
      ) : (
        cards.length > 0 && (
          <MeanApyDisplay voltNumber={voltNumber} parentWidth={wrapperWidth}>
            {meanApy}
          </MeanApyDisplay>
        )
      )}
      {wrapperWidth > 345 && showAnalyticsLink && <Divider />}
      {wrapperWidth > 345 &&
        (voltNumber === 5 ? (
          <Volt5PerformanceSummaryIcons />
        ) : (
          <PerformanceSummaryIcons
            allValidIcons={allValidIcons}
            parentWidth={wrapperWidth}
          />
        ))}
      {showAnalyticsLink && <Divider />}
      {showAnalyticsLink && (
        <Link
          to={voltAnalyticsLinkPath}
          css={(theme) => css`
            display: flex;
            flex-direction: row;
            gap: 2px;
            align-self: center;
            font-family: "Euclid Circular B";
            font-size: 14px;
            color: ${theme.palette[
              voltNumber === 1
                ? "sky"
                : voltNumber === 2
                ? "electricity"
                : voltNumber === 3
                ? "neon"
                : voltNumber === 4
                ? "pink"
                : "lavender"
            ][theme.palette.mode === "dark" ? 500 : 800]};
            font-weight: 500;
            &:hover {
              color: #a7a7b1;
            }
            font-size: ${wrapperWidth <= 390
              ? "10px"
              : wrapperWidth < 450
              ? "12px"
              : "16px"};
          `}
        >
          Analytics
          <KeyboardArrowRightIcon
            css={css`
              width: 16px;
              height: 16px;
              align-self: center;
            `}
          />
        </Link>
      )}
    </div>
  );
};

const Divider = styled.div`
  display: flex;
  width: 1px;
  margin: 8px 0;
  background: rgba(255, 255, 255, 0.3);
`;
