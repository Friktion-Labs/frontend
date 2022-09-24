import styled from "@emotion/styled";
import { Typography } from "common/components/Typography";

export const InfoCardHeader = styled(
  (props: { className?: string; children?: React.ReactNode }) => (
    <Typography {...props} variant="bodyXs" />
  )
)`
  margin-bottom: 4px;
  font-weight: 500;
`;
