import styled from "@emotion/styled";

export const ItemRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px 0;

  ${({ theme }) =>
    `border-bottom: 1px solid ${
      theme.palette.mode === "dark"
        ? theme.palette.grey[700]
        : theme.palette.grey[200]
    };`}
`;

export const Item = styled.div<{
  withDotUnderline?: boolean;
  colored?: boolean;
}>`
  display: flex;
  align-items: center;
  gap: 12px;
  color: ${({ colored, theme }) =>
    colored
      ? theme.palette.grey[400]
      : theme.palette.mode === "dark"
      ? "white"
      : "black"};
  ${({ withDotUnderline, theme }) =>
    withDotUnderline &&
    `
      text-decoration: dotted;
      text-decoration-line: underline;
      text-decoration-color: ${theme.palette.grey[400]};
      text-underline-position: under;
    `}
`;

export const dataDisplayWrapper = `
  height: 100%;
  & ${ItemRow}:first-child {
    padding-top: 0;
  }
  & ${ItemRow}:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;
