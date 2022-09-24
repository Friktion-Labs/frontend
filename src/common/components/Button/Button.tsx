import { FunctionComponent } from "react";
import { Interpolation } from "@emotion/react";
import styled from "@emotion/styled";
import { Button09 } from "../../../09/Button09";
import {
  BlueGradient,
  YellowGradient,
  AlanGreenGradient,
  PinkGradient,
  RedGradient,
  VioletGradient,
} from "../../../09/glow09";
import { VoltNumber } from "../../../09/registry10";
import { Theme } from "@mui/material";

type ButtonVariantProps = "primary" | "secondary" | "outline-primary" | "link";

interface ButtonProps extends React.PropsWithChildren {
  variant?: ButtonVariantProps;
  withIcons?: React.ReactNode;
  className?: string;
  css?: Interpolation<Theme>;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean | JSX.Element | string;
  voltNumber?: VoltNumber;
  fullWidth?: boolean;
}

export const Button: FunctionComponent<ButtonProps> = ({
  className,
  css,
  voltNumber = 5,
  variant = "primary",
  withIcons = null,
  onClick,
  children,
  fullWidth,
  ...props
}) => {
  return (
    <ButtonContainer
      className={className}
      css={css}
      variant={variant}
      voltNumber={voltNumber}
      onClick={onClick}
      fullWidth={fullWidth}
      {...props}
    >
      {withIcons}
      {children}
    </ButtonContainer>
  );
};

const ButtonContainer = styled(Button09)<{
  variant: ButtonVariantProps;
  voltNumber: number;
  fullWidth?: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  ${(props) => props.theme.typography.bodyS}
  font-weight: 500;
  width: 100%;
  min-width: auto;
  max-width: ${({ fullWidth }) => (fullWidth ? "100%" : "216px")};
  box-shadow: none !important;
  border-radius: 6px;
  &:hover {
    background: inherit;
    div {
      border-radius: 6px;
    }
  }
  transition: ${(props) =>
    props.theme.transitions.create(["filter"], {
      duration: props.theme.transitions.duration.short,
    })};

  ${({ variant, voltNumber, theme }) => {
    const isDark = theme.palette.mode === "dark";
    const bgByMode = isDark ? "#000000" : "transparent";
    const bgByTheme =
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
        : RedGradient;

    if (variant === "primary") {
      return `
        color: #000000 !important;
        background: ${bgByTheme} !important;
        border: none;

        :hover {
          filter: brightness(0.9);
        }
      `;
    }

    if (variant === "secondary") {
      return (props) => `
        background: ${bgByMode};
        border: 2px solid ${props.theme.palette.grey[500]};
        border-radius: 8px;
      `;
    }

    if (variant === "outline-primary") {
      return (props) => `
        color: ${
          props.theme.palette.mode === "dark" ? "#FFFFFF" : "#000000"
        } !important;
        border-radius: 8px;
        background: transparent;
        position: relative;
        :after {
          background: ${bgByTheme};
          position: absolute;
          inset: 0px;
          padding: 2px;
          content: "";
          border-radius: 8px;
          -webkit-mask: linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
        }
      `;
    }

    return `
      border: 2px solid #2A2A51;
      border-radius: 8px;
      background: transparent;
    `;
  }};
`;

export const ButtonWrapper = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: center;
`;
