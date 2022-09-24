import { css, SerializedStyles } from "@emotion/react";
import styled from "@emotion/styled";
import { Popover } from "antd";
import {
  AlanGreenSpan,
  BlueSpan,
  PinkSpan,
  RedSpan,
  VioletSpan,
  YellowSpan,
} from "./glow09";
import {
  genericVoltNumExplanation,
  voltNumExplanations,
} from "./textForTooltipsOnly";

export const VoltNumber = (props: {
  voltNum: number;
  className?: string;
  css?: SerializedStyles;
}) => {
  const explanation = voltNumExplanations[props.voltNum];

  let ColorSpan: typeof BlueSpan;
  if (props.voltNum === 1) {
    ColorSpan = BlueSpan;
  } else if (props.voltNum === 2) {
    ColorSpan = AlanGreenSpan;
  } else if (props.voltNum === 3) {
    ColorSpan = YellowSpan;
  } else if (props.voltNum === 4) {
    ColorSpan = PinkSpan;
  } else if (props.voltNum === 5) {
    ColorSpan = VioletSpan;
  } else {
    ColorSpan = RedSpan;
  }

  return (
    <VoltNumberContainer
      className={"voltNumberContainer " + props.className ?? ""}
    >
      <VoltNumberWrapper className="voltNumberWrapper">
        <Popover
          destroyTooltipOnHide
          content={
            <span css={inlineDocPopoverStyles}>
              {explanation ?? genericVoltNumExplanation}
            </span>
          }
          placement="bottomLeft"
        >
          <GlowTextContainer>
            <ColorSpan
              className="colorSpan"
              css={css`
                display: inline-block;
                /* padding-right: 5px; // Fix for clipping issue */
              `}
            >
              <VoltNumberPixelSpacing>#</VoltNumberPixelSpacing>
              {props.voltNum.toString().padStart(2, "0")}
            </ColorSpan>
            <GlowVoltNum className="glowVoltNum">
              <ColorSpan>
                <VoltNumberPixelSpacing>#</VoltNumberPixelSpacing>
                {props.voltNum.toString().padStart(2, "0")}
              </ColorSpan>
            </GlowVoltNum>
          </GlowTextContainer>
        </Popover>
      </VoltNumberWrapper>
    </VoltNumberContainer>
  );
};

export const GlowAPYNumber = (props: {
  voltNum: number;
  apy: string;
  className?: string;
  css?: SerializedStyles;
}) => {
  let ColorSpan: typeof BlueSpan;
  if (props.voltNum === 1) {
    ColorSpan = BlueSpan;
  } else if (props.voltNum === 2) {
    ColorSpan = AlanGreenSpan;
  } else if (props.voltNum === 3) {
    ColorSpan = YellowSpan;
  } else if (props.voltNum === 4) {
    ColorSpan = PinkSpan;
  } else if (props.voltNum === 5) {
    ColorSpan = VioletSpan;
  } else {
    ColorSpan = RedSpan;
  }

  return (
    <VoltNumberContainer
      className={"voltNumberContainer " + props.className ?? ""}
    >
      <APYNumberWrapper className="voltNumberWrapper">
        <GlowTextContainer>
          <ColorSpan
            className="colorSpan"
            css={css`
              display: inline-block;
              /* padding-right: 5px; // Fix for clipping issue */
            `}
          >
            {props.apy}%
          </ColorSpan>
        </GlowTextContainer>
      </APYNumberWrapper>
    </VoltNumberContainer>
  );
};

// For the kemings
const VoltNumberPixelSpacing = styled.span`
  margin-right: 3px;
`;
const VoltNumberContainer = styled.div`
  opacity: 0.9;
`;

const VoltNumberWrapper = styled.div`
  -webkit-transform: translateZ(0);
  -webkit-backface-visibility: hidden;
  -webkit-perspective: 1000;

  font-size: 28px;
  line-height: 1;
  font-weight: bold;
  display: inline-block;
  letter-spacing: -2px;
  text-shadow: 0 0 4px rgba(255, 255, 255, 0.08);

  background: linear-gradient(
    50deg,
    hsla(230, 15%, 80%, 0.2) 16%,
    hsla(230, 15%, 80%, 0.32) 42%,
    hsla(230, 15%, 80%, 0.32) 58%,
    hsla(230, 15%, 80%, 0.2) 84%
  );
  background-size: 200% auto;

  color: #fff;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  animation: scrollshine 1.5s linear infinite reverse;
  animation-timing-function: steps(20);
  @keyframes scrollshine {
    to {
      background-position: 200% center;
    }
  }
  ::selection {
    -webkit-text-fill-color: #fff;
  }
`;

const APYNumberWrapper = styled.div`
  -webkit-transform: translateZ(0);
  -webkit-backface-visibility: hidden;
  -webkit-perspective: 1000;

  font-family: "Euclid Circular B";
  font-size: 36px;
  line-height: 1;
  font-weight: 500;
  display: inline-block;

  background: linear-gradient(
    50deg,
    hsla(230, 15%, 80%, 0.2) 16%,
    hsla(230, 15%, 80%, 0.32) 42%,
    hsla(230, 15%, 80%, 0.32) 58%,
    hsla(230, 15%, 80%, 0.2) 84%
  );
  background-size: 200% auto;

  color: #fff;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  animation: scrollshine 1.5s linear infinite reverse;
  animation-timing-function: steps(20);
  @keyframes scrollshine {
    to {
      background-position: 200% center;
    }
  }
  ::selection {
    -webkit-text-fill-color: #fff;
  }
`;

const GlowTextContainer = styled.div`
  position: relative;
  overflow: visible;
  min-width: 68px;
`;
// min width 68px is hardcoded. use transform scale and negative margin if you want to change things

const GlowVoltNum = styled.span`
  position: absolute;
  filter: blur(2px);
  left: 0;
  opacity: 0.5;
  min-width: 68px;
`;

const inlineDocPopoverStyles = css`
  max-width: 250px;
  display: inline-block;
  font-family: "Euclid Circular B";
`;
