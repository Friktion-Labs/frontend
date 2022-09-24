import { FunctionComponent } from "react";
import styled from "@emotion/styled";

export enum ChipColors {
  Success = "success",
  Danger = "danger",
  Warning = "warning",
  Primary = "primary",
}
interface ChipLabelProps {
  children?: React.ReactNode;
  color: ChipColors;
}

export const ChipLabel: FunctionComponent<ChipLabelProps> = ({
  children,
  color,
}) => {
  return (
    <ChipLabelContainer color={color}>
      <span></span>
      {children}
    </ChipLabelContainer>
  );
};

const ChipLabelContainer = styled.div<{ color: ChipColors }>`
  ${(props) => props.theme.typography.bodyXs}
  font-weight: 500;
  padding: 4px 10px;
  width: fit-content;
  border-radius: 16px;
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid;
  gap: 8px;
  ${({ color }) => {
    let bg = "";
    let borderColor = "";
    switch (color) {
      case ChipColors.Danger:
        bg = "#FF4443";
        borderColor = "#590E0D";
        break;
      case ChipColors.Warning:
        bg = "#F8CC3E";
        borderColor = "#776119";
        break;
      case ChipColors.Success:
        bg = "#00C137";
        borderColor = "#004D16";
        break;
      default:
        bg = "#ebebf2";
        borderColor = "#74747d";
        break;
    }
    return `
       color: ${bg};
       border-color: ${borderColor};
       span {
          background: ${bg};
       }
    `;
  }}
  span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }
`;
