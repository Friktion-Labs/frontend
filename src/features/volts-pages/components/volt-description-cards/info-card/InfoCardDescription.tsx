import styled from "@emotion/styled";
import { Typography } from "common/components/Typography";

export const InfoCardDescription = styled(
  (props: { className?: string; children?: React.ReactNode }) => (
    <Typography {...props} variant="bodyM" />
  )
)`
  margin-bottom: 0px;
`;
