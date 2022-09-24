import {
  BlueSpan,
  AlanGreenSpan,
  YellowSpan,
  PinkSpan,
  RedSpan,
  getVoltSpan,
  VioletSpan,
} from "09/glow09";
import { VoltNumber } from "09/registry10";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Tab, TabProps } from "common/components/Tab";
import { Link } from "react-router-dom";

interface VoltTabProps<T> extends TabProps<T> {
  voltNumber: VoltNumber;
}
export const VoltTab = <T,>({
  voltNumber,
  children,
  ...rest
}: VoltTabProps<T>) => {
  const Span = getVoltSpan(voltNumber);
  let ColorSpan: typeof BlueSpan;
  if (voltNumber === 1) {
    ColorSpan = BlueSpan;
  } else if (voltNumber === 2) {
    ColorSpan = AlanGreenSpan;
  } else if (voltNumber === 3) {
    ColorSpan = YellowSpan;
  } else if (voltNumber === 4) {
    ColorSpan = PinkSpan;
  } else if (voltNumber === 5) {
    ColorSpan = VioletSpan;
  } else {
    ColorSpan = RedSpan;
  }

  return (
    <Tab
      css={css`
        padding: 0;
        padding-top: 10px;
        padding-bottom: 14px;
      `}
      component={Link}
      {...rest}
    >
      <Span
        css={(theme) =>
          css({
            ...theme.typography.bodyM,
            fontWeight: 500,
            display: "flex",
            ...(!rest.selected
              ? {
                  background: "none",
                  WebkitTextFillColor: "inherit",
                  color: "inherit",
                  fontWeight: 400,
                }
              : {}),
          })
        }
      >
        <TabAdornment>
          {rest.selected ? (
            <ColorSpan
              className="colorSpan"
              css={css`
                display: inline-block;
                font-weight: 500;
                /* padding-right: 5px; // Fix for clipping issue */
              `}
            >
              #{voltNumber.toString().padStart(2, "0")}
            </ColorSpan>
          ) : (
            <span
              css={css`
                display: inline-block;
                font-weight: 500;
                color: inherit;
                /* padding-right: 5px; // Fix for clipping issue */
              `}
            >
              #{voltNumber.toString().padStart(2, "0")}
            </span>
          )}
        </TabAdornment>
        {children}
      </Span>
    </Tab>
  );
};

const TabAdornment = styled.div`
  display: inherit;
  margin-right: 6px;
`;
