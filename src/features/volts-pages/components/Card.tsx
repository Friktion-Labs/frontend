import styled from "@emotion/styled";

export const Card = styled.div`
  border: ${({ theme }) =>
    `1px solid ${
      theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, 0.07)"
        : "rgba(0, 0, 0, 0.07)"
    }`};
  border-radius: 8px;
  background: ${({ theme }) => theme.palette.background.modal};
`;
