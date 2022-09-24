import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { GroupBase, SingleValueProps, components } from "react-select";
import { HeaderTag } from "../HeaderTag";
import { VoltOption } from "./VoltOption";

interface CustomSingleValueProps
  extends SingleValueProps<VoltOption, false, GroupBase<VoltOption>> {}

export const CustomSingleValue = ({
  children,
  ...rest
}: CustomSingleValueProps) => {
  return (
    <components.SingleValue {...rest}>
      <SingleValueContainer>
        <HeaderTag
          css={css`
            margin-right: 16px;
          `}
          voltNumber={rest.data.voltNumber}
        />
        <span
          css={css`
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;

            @media (max-width: 600px) {
              font-size: 25px;
            }

            @media (max-width: 500px) {
              font-size: 23px;
            }

            @media (max-width: 450px) {
              font-size: 20px;
            }
          `}
        >
          {children}
        </span>
      </SingleValueContainer>
    </components.SingleValue>
  );
};

const SingleValueContainer = styled.div`
  display: flex;
  align-items: center;
`;
