import { Interpolation, Theme, css } from "@emotion/react";

export const AspectRatioBox = ({
  children,
  paddingTop,
  ...rest
}: {
  children?: React.ReactNode;
  paddingTop?: string;
  css?: Interpolation<Theme>;
}) => (
  <div
    css={css`
      position: relative;
      overflow: hidden;
    `}
    {...rest}
  >
    <div
      css={css`
        height: 0;
        padding-top: ${paddingTop ?? "56.25%"}; // 16:9 by default
      `}
    >
      <div
        css={css`
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        `}
      >
        {children}
      </div>
    </div>
  </div>
);
