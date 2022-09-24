import styled from "@emotion/styled";
import { To } from "react-router-dom";

export const CardFooter = styled.div`
  border: none !important;
  cursor: pointer;
  margin: 0;
  outline: 0 !important;
  background: transparent;

  align-items: center;
  display: flex;
  align-self: flex-start;
  gap: 12px;
  font-weight: 500;
  ${({ theme }) => theme.typography.bodyM};
  transition: all 0.2s ease-in;

  &:hover {
    color: #a7a7b1;
  }
`;

export const CardFooterLink = styled.button<{ to?: To }>`
  border: none !important;
  cursor: pointer;
  margin: 0;
  outline: 0 !important;
  background: transparent;

  align-items: center;
  display: flex;
  align-self: flex-start;
  gap: 12px;
  font-weight: 500;
  ${({ theme }) => theme.typography.bodyM};
  transition: all 0.2s ease-in;

  &:hover {
    color: #a7a7b1;
  }
`;
