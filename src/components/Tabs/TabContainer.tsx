import { FunctionComponent } from "react";
import styled from "@emotion/styled";
import {
  BlueGradient,
  YellowGradient,
  AlanGreenGradient,
  PinkGradient,
  VioletGradient,
} from "../../09/glow09";

interface TabContainerProps {
  children: React.ReactNode;
  className?: string;
  transform?: number;
  currentWidth?: number;
  voltNumber?: number;
}

export const TabContainer: FunctionComponent<TabContainerProps> = ({
  children,
  className,
  currentWidth = 0,
  transform = 0,
  voltNumber = null,
}) => (
  <TabWrapper
    transform={transform}
    currentWidth={currentWidth}
    voltNumber={voltNumber}
    className={className}
  >
    {children}
  </TabWrapper>
);

const TabWrapper = styled.div<{
  currentWidth: number;
  transform: number;
  voltNumber: number | null;
}>`
  display: flex;
  flex-direction: row;
  gap: 36px;
  position: relative;
  ${({ currentWidth, transform, voltNumber }) => {
    const gradient =
      voltNumber === 1
        ? BlueGradient
        : voltNumber === 2
        ? AlanGreenGradient
        : voltNumber === 3
        ? YellowGradient
        : voltNumber === 4
        ? PinkGradient
        : voltNumber === 5
        ? VioletGradient
        : "#CE56C2";

    const height = voltNumber ? 3 : 1;

    if (!currentWidth) {
      return ``;
    }
    return `
        &:after {
          position: absolute;
          bottom: -1px;
          right: 0;
          left: 0;
          height: ${height}px;
          width: ${currentWidth}px;
          border-radius: 8px;
          content: "";
          background: ${gradient};
          transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, background 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
          transform: translateX(${transform}px);
        }
      `;
  }}
`;
