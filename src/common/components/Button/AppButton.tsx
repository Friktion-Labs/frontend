import { css, Interpolation, Theme } from "@emotion/react";
import styled from "@emotion/styled";
import React from "react";

const buttonResets = css`
  border: none;
  cursor: pointer;
  margin: 0;
  outline: 0 !important;
`;

const buttonStyles = ({ color, theme }: { color: string; theme: Theme }) => css`
  ${buttonResets};
  position: relative;
  padding: 12px 16px;
  border-radius: 8px;
  font-weight: 500;
  ${theme.typography.bodyS};

  &::before {
    background: ${color};
    border-radius: 8px;
  }
`;

const containedButtonStyles = ({
  color,
  theme,
}: {
  color: string;
  theme: Theme;
}) => css`
  ${buttonStyles({ color, theme })}
  color: #ffffff;
  background: transparent;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transition: ${theme.transitions.create(["filter"], {
      duration: theme.transitions.duration.short,
    })};
  }

  &:hover::before {
    filter: brightness(0.9);
  }
`;

const outlinedButtonStyles = ({
  color,
  theme,
}: {
  color: string;
  theme: Theme;
}) => css`
  ${buttonStyles({ color, theme })}

  background: transparent;
  z-index: 0;
  transition: ${theme.transitions.create(["background"], {
    duration: theme.transitions.duration.short,
  })};
  &:hover {
    background: ${theme.palette.mode === "dark"
      ? "#111122"
      : "rgba(0, 0, 0, 0.1)"};
    .walletInfoChip {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }

  &::before {
    content: "";
    position: absolute;
    z-index: -1;
    inset: 0;
    padding: 2px;
    -webkit-mask: linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
  }
`;

type ButtonVariant = "contained" | "outlined";

interface AppButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color: string;
  forwardedRef?: React.ForwardedRef<HTMLButtonElement>;
  variant?: ButtonVariant;
  children?: React.ReactNode;
  css?: Interpolation<Theme>;
  as?: React.ElementType<any> | undefined;

  href?: string;
  target?: string;
  rel?: string;
}
const AppButtonInner = ({
  color,
  forwardedRef,
  variant,
  children,
  ...rest
}: AppButtonProps) => {
  return (
    <StyledButton ref={forwardedRef} variant={variant} color={color} {...rest}>
      <div
        css={css`
          position: relative;
        `}
      >
        {children}
      </div>
    </StyledButton>
  );
};

const StyledButton = styled("button", {
  shouldForwardProp: (prop) =>
    prop !== "color" && prop !== "variant" && prop !== "as",
})<{
  variant?: ButtonVariant;
  color: string;
}>`
  ${({ variant }) =>
    variant === "outlined" ? outlinedButtonStyles : containedButtonStyles}
`;
export const AppButton = React.forwardRef<
  HTMLButtonElement,
  Omit<AppButtonProps, "forwardedRef">
>((props, ref) => <AppButtonInner {...props} forwardedRef={ref} />);
