import { getVoltGlowBorderStyles, getVoltSpan, getVoltBolt } from "09/glow09";
import { VoltNumber } from "09/registry10";
import { css, Interpolation, Theme } from "@emotion/react";
import { Typography } from "common/components/Typography";
import { useMemo } from "react";

export const HeaderTag = ({
  voltNumber,
  ...rest
}: {
  voltNumber: VoltNumber;
  css?: Interpolation<Theme>;
  className?: string;
}) => {
  const voltGlowBorderStyles = useMemo(
    () => getVoltGlowBorderStyles(voltNumber),
    [voltNumber]
  );

  const TagSpan = useMemo(() => getVoltSpan(voltNumber), [voltNumber]);
  const Bolt = useMemo(() => getVoltBolt(voltNumber), [voltNumber]);

  return (
    <div
      css={css`
        padding: 6px 12px;
        height: 36px;
        position: relative;
        ${voltGlowBorderStyles}
        opacity: 1;
      `}
      {...rest}
    >
      <div
        css={css`
          display: flex;
          align-items: center;
        `}
      >
        <Bolt
          css={css`
            width: 15px;
            height: 20px;
            margin-right: 4px;
          `}
        />
        <Typography
          variant="bodyM"
          css={css`
            white-space: nowrap;
            font-weight: 500;
          `}
        >
          <TagSpan
            css={css`
              display: inline !important;
              @media (max-width: 420px) {
                display: none !important;
              }
            `}
          >
            Volt&nbsp;
          </TagSpan>
          <TagSpan>{voltNumber}</TagSpan>
        </Typography>
      </div>
    </div>
  );
};
