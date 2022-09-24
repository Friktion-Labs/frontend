import styled from "@emotion/styled";
import { Typography } from "common/components/Typography";

export const DescriptionText = styled(Typography)`
  color: ${({ theme }) =>
    theme.palette.mode === "dark"
      ? theme.palette.grey[300]
      : theme.palette.grey[500]};
`;
