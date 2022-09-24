import { css } from "@emotion/react";
import { RiskIcon } from "./RiskIcon";
import {
  InfoCardProps,
  InfoCard,
  InfoCardContent,
  InfoCardHeader,
  InfoCardDescription,
} from "./info-card";
import { VoltNumber } from "09/registry10";

export const RiskCard = ({
  children,
  voltNumber,
  ...rest
}: InfoCardProps & { voltNumber: VoltNumber }) => {
  return (
    <InfoCard {...rest}>
      <InfoCardContent>
        <RiskIcon
          voltNumber={voltNumber}
          css={css`
            margin-right: 18px;
            flex: 0 0 auto;
          `}
        />
        <div>
          <InfoCardHeader>
            {voltNumber === 5 ? "PRINCIPAL PROTECTION + HEDGE" : "RISK"}
          </InfoCardHeader>
          <InfoCardDescription>{children}</InfoCardDescription>
        </div>
      </InfoCardContent>
    </InfoCard>
  );
};
