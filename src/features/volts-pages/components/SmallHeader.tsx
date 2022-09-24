import styled from "@emotion/styled";
import { Typography } from "common/components/Typography";
import React from "react";

export const SmallHeader = styled(
  (props: {
    className?: string;
    children?: React.ReactNode;
    component?: React.ElementType<any>;
  }) => <Typography {...props} variant="bodyXs" />
)`
  font-weight: 500;
  margin-bottom: 0px;
`;
