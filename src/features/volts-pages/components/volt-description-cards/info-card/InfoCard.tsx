import { Interpolation, css, Theme } from "@emotion/react";
import { Card } from "../../Card";

export interface InfoCardProps {
  children: React.ReactNode;
  css?: Interpolation<Theme>;
}
export const InfoCard = ({ children, ...rest }: InfoCardProps) => (
  <div
    css={css`
      flex: 1 0 auto;

      @media only screen and (max-width: 1030px) and (min-width: 785px) {
        width: 50%;
      }
    `}
    {...rest}
  >
    <Card
      css={css`
        overflow: hidden;
      `}
    >
      {children}
    </Card>
  </div>
);
