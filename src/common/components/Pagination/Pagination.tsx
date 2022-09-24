import { FunctionComponent } from "react";
import styled from "@emotion/styled";

import { Typography } from "common/components/Typography";
import { ArrowLeftIcon, ArrowRightIcon } from "components/Icons";
import { usePagination, DOTS } from "./usePagination";
import { getVoltGlowBorderStyles } from "09/glow09";
import { VoltNumber } from "09/registry10";

interface PaginationProps {
  voltNumber?: VoltNumber;
  onPageChange: (page: number | string) => void;
  totalCount: number;
  siblingCount?: number;
  currentPage: number;
  pageSize: number;
  className?: string;
  fullWidth?: boolean;
}

export const Pagination: FunctionComponent<PaginationProps> = ({
  onPageChange,
  totalCount,
  siblingCount = 1,
  currentPage,
  pageSize,
  className,
  voltNumber,
  fullWidth = false,
}) => {
  // I have set any type here for paginationRange because data list is not defined
  const paginationRange: any = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  let lastPage = paginationRange[paginationRange.length - 1];

  return (
    <PaginationContainer className={className} fullWidth={fullWidth}>
      <PaginationItem isArrow onClick={onPrevious} disabled={currentPage === 1}>
        <ArrowLeftIcon />
        <PaginationText>Previous</PaginationText>
      </PaginationItem>
      {paginationRange.map((pageNumber: number | string, idx: number) => {
        if (pageNumber === DOTS) {
          return <PaginationItem className="dots">&#8230;</PaginationItem>;
        }

        return (
          <PaginationItem
            selected={pageNumber === currentPage}
            voltNumber={voltNumber}
            onClick={() => onPageChange(pageNumber)}
            key={idx}
          >
            <PaginationText>{pageNumber}</PaginationText>
          </PaginationItem>
        );
      })}
      <PaginationItem
        isArrow
        onClick={onNext}
        disabled={currentPage === lastPage}
      >
        <PaginationText>Next</PaginationText>
        <ArrowRightIcon />
      </PaginationItem>
    </PaginationContainer>
  );
};

export const PaginationContainer = styled.ul<{ fullWidth: boolean }>`
  display: flex;
  list-style-type: none;
  gap: 2px;
  ${({ fullWidth, theme }) => {
    if (fullWidth) {
      return `
        padding: 0px 30px 16px 30px;
        border-radius: 8px;
        & li:first-of-type,
          li:last-child {
            flex: 2;
        }
        & li:first-of-type {
          justify-content: flex-start;
        }
        & li:last-child {
          justify-content: flex-end;
        } 
      `;
    }
  }}
`;

const PaginationItem = styled.li<{
  disabled?: boolean;
  selected?: boolean;
  isArrow?: boolean;
  voltNumber?: VoltNumber;
}>`
  cursor: pointer;
  display: flex;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
  ${({ isArrow, voltNumber = 5, selected, disabled }) => {
    if (!isArrow) {
      const itemSizeCommon = `
        height: 40px;
        width: 40px;
        padding: 0 12px;
      `;
      if (selected) {
        return `
          ${itemSizeCommon}
          ${getVoltGlowBorderStyles(voltNumber, { gradientAngle: "70deg" })}
          opacity: 1;
          pointer-events: none;
          &:hover {
            background-color: transparent;
            cursor: default;
          }
        `;
      }
      return (props) => `
        ${itemSizeCommon}
        &p {
          color: ${props.theme.palette.grey[400]};
        }
        &:hover {
          background: ${props.theme.palette.grey[400]};
          cursor: pointer;
          opacity: 0.8;
        }
      `;
    }
    if (disabled) {
      return `
        pointer-events: none;
        opacity: 0.4;
        &:hover {
          background-color: transparent;
          cursor: default;
        }
      `;
    }
  }}

  &.dots {
    background-color: transparent;
    cursor: default;
  }
`;

const PaginationText = styled(
  (props: { className?: string; children?: React.ReactNode }) => (
    <Typography {...props} variant="bodyS" />
  )
)`
  font-weight: 500;
  color: ${({ theme }) =>
    theme.palette.mode === "dark" ? "#FFFFFF" : "#000000"};
`;
