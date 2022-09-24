import { Theme } from "@emotion/react";
import styled, { Interpolation } from "@emotion/styled";

interface CardHeaderProps {
  children?: React.ReactNode;
  css?: Interpolation<Theme>;
  className?: string;
}

export const CardHeader = ({ children, ...rest }: CardHeaderProps) => (
  <CardHeaderLayout {...rest}>{children}</CardHeaderLayout>
);

const CardHeaderLayout = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 600;
  color: ${({ theme }) =>
    theme.palette.mode === "dark"
      ? theme.palette.grey[300]
      : theme.palette.grey[700]};
`;
