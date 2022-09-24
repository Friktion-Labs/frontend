import styled from "@emotion/styled";
import { Typography } from "common/components/Typography";

export const WalletDialogSectionHeader = styled(Typography)`
  font-weight: 600;
  color: ${({ theme }) =>
    theme.palette.mode === "dark"
      ? theme.palette.grey[900]
      : theme.palette.grey[900]};
  margin-bottom: 12px;
`;
