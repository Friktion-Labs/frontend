import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Typography } from "common/components/Typography";

export const OurProductsSectionText = () => (
  <OurProductsSectionLayout>
    <Typography
      variant="h3"
      css={css`
        font-weight: 600;
        margin: auto;
        margin-bottom: 32px;
      `}
    >
      Volts are Friktion's native structured products
    </Typography>
  </OurProductsSectionLayout>
);

const OurProductsSectionLayout = styled.div`
  max-width: 600px;
  margin: auto;
  text-align: center;
`;
