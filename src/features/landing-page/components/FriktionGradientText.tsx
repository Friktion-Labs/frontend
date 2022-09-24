import styled from "@emotion/styled";

export const FriktionGradientText = styled.span`
  background: ${({ theme }) => theme.palette.friktion.radial};
  background-clip: text;
  -webkit-text-fill-color: transparent;
`;
