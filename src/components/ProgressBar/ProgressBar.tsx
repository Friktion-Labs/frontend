import { FunctionComponent } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import React from "react";
import { BarComponentType } from "../../09/glow09";
import { useTheme } from "@mui/material";

interface ProgressBarProps extends React.ComponentProps<typeof BarPositioner> {
  currentProgress: number;
  barComponent: React.ReactElement<React.ComponentProps<BarComponentType>>;
  progressHeight?: number;
  background?: string;
  BarSharpCropperProps?: React.ComponentProps<typeof BarSharpCropper>;
  BarGlowCropperProps?: React.ComponentProps<typeof BarGlowCropper>;
}

export const ProgressBar: FunctionComponent<ProgressBarProps> = ({
  currentProgress,
  barComponent,
  progressHeight = 8,
  background: backgroundProp,
  BarSharpCropperProps = {},
  BarGlowCropperProps = {},
  ...rest
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const background =
    backgroundProp ||
    (isDarkMode ? theme.palette.grey[800] : theme.palette.grey[200]);
  return (
    <BarPositioner
      css={css`
        height: ${progressHeight}px;
        background: ${background};
      `}
      {...rest}
    >
      <BarContainer
        css={css`
          height: ${progressHeight}px;
          width: ${currentProgress}%;
        `}
      >
        <BarSharpCropper {...BarSharpCropperProps}>
          {React.cloneElement(barComponent, { className: "phaseShiftable" })}
        </BarSharpCropper>
        <BarGlowCropper {...BarGlowCropperProps}>
          {React.cloneElement(barComponent, { className: "phaseShiftable" })}
        </BarGlowCropper>
      </BarContainer>
    </BarPositioner>
  );
};

export const BarPositioner = styled.div`
  border-radius: 32px;
  overflow: hidden;
`;

const BarContainer = styled.div`
  width: 50px;
  transition: width 2s cubic-bezier(0.165, 0.84, 0.44, 1); // easeOutQuart
  position: relative;
`;

const BarSharpCropper = styled.div`
  -webkit-transform: translateZ(0);
  -webkit-backface-visibility: hidden;
  -webkit-perspective: 1000;

  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  border-radius: 32px;
  & > div {
    height: 8px;
  }
`;
const BarGlowCropper = styled.div`
  -webkit-transform: translateZ(0);
  -webkit-backface-visibility: hidden;
  -webkit-perspective: 1000;

  position: absolute;
  top: -1px;
  left: -2px;
  right: -2px;
  bottom: -1px;
  height: 7px;
  position: absolute;
  filter: blur(3px);
  opacity: 0.6;
  overflow: hidden;
  border-radius: 32px;
  & > div {
    height: 8px;
  }
  -webkit-backface-visibility: hidden;
  -moz-backface-visibility: hidden;
  -webkit-transform: translate3d(0, 0, 0);
  -moz-transform: translate3d(0, 0, 0);
`;
