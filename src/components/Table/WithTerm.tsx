import { FunctionComponent } from "react";
import { ColTableData } from ".";
import { css } from "@emotion/react";
import moment from "moment";

interface WithTermProps {
  years: string;
  date: string;
  children?: React.ReactNode;
}

export const WithTerm: FunctionComponent<WithTermProps> = ({
  years,
  date,
  children,
}) => (
  <ColTableData>
    {children || (
      <>
        <div>{years}</div>
        <div
          css={(theme) => css`
            color: ${theme.palette.grey[400]};
          `}
        >
          {moment(date).format("DD MMM 'YY")}
        </div>
      </>
    )}
  </ColTableData>
);
