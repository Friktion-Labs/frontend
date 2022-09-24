import { css } from "@emotion/react";

export const LendingImage = () => (
  <div
    css={css`
      width: 50%;
      position: relative;
      @media only screen and (max-width: 900px) {
        display: none;
      }
    `}
  >
    <div
      css={css`
        max-height: 296px;
        max-width: 466px;
        width: 100%;
        height: 100%;
        background-color: #00ff0066;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%) rotate(6deg);
      `}
    />
  </div>
);
