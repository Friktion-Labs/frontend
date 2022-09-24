import { FunctionComponent, useState, useMemo, useCallback } from "react";
import styled from "@emotion/styled";
import { Table as TableAnt, TableProps as TablePropsAnt } from "antd";
import type { ColumnsType } from "antd/lib/table";
import { css, SerializedStyles } from "@emotion/react";
import { Pagination } from "common/components/Pagination";
import { GlowTableRow } from "./GlowTableRow";
import { GlobalId, VoltNumber } from "09/registry10";
import {
  useManagementModal,
  ZeroNineManagementModal,
} from "09/ZeroNineManagementModal";

interface TableProps extends TablePropsAnt<any> {
  columns: ColumnsType<any>;
  dataSource: any[];
  className?: string;
  css?: SerializedStyles;
  voltGlowNumber?: VoltNumber;
}

let pageSize = 10;
export const Table: FunctionComponent<TableProps> = ({
  columns,
  dataSource,
  className,
  voltGlowNumber,
  ...rest
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const { openModal, modalSesameBall } = useManagementModal();

  const onClick = useCallback(
    (globalId: GlobalId) => {
      if (!globalId) return;
      openModal(globalId);
    },
    [openModal]
  );

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * pageSize;
    const lastPageIndex = firstPageIndex + pageSize;
    return dataSource.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, dataSource]);

  return (
    <>
      <TableContainer className={className}>
        <AnotherContainer>
          <TableAntWrapper
            {...rest}
            columns={columns}
            dataSource={currentTableData}
            pagination={false}
            tableLayout="auto"
            components={{
              body: {
                row: GlowTableRow,
              },
            }}
            onRow={(record: any) => {
              return {
                voltNumber: voltGlowNumber ?? 1,
                onClick: () => {
                  if (record.def && record.def.globalId)
                    onClick(record.def.globalId as GlobalId);
                },
              } as any; // casted to any as antd table typings doesn't support custom props for row. However, this works.
            }}
            css={css`
              width: 100%;
              overflow: auto;
            `}
          />
          <ZeroNineManagementModal modalSesameBall={modalSesameBall} />
        </AnotherContainer>
      </TableContainer>
      {dataSource.length > pageSize && (
        <Pagination
          currentPage={currentPage}
          totalCount={dataSource.length}
          pageSize={pageSize}
          onPageChange={(page: number | string) => setCurrentPage(Number(page))}
          fullWidth
          voltNumber={1}
        />
      )}
    </>
  );
};

const TableContainer = styled.div`
  max-width: 1180px;
`;
const AnotherContainer = styled.div`
  overflow: auto;
`;

const TableAntWrapper = styled(TableAnt)`
  width: 100%;
  ${(props) => props.theme.typography.bodyS}

  & .ant-table {
    background: transparent;
  }

  & .ant-spin-nested-loading {
    padding: 1px 30px;
  }

  & table {
    background: transparent;
    border-collapse: collapse !important;
    border-radius: 8px !important;
    border-style: hidden;
    box-shadow: 0 0 0 1px
      ${({ theme }) =>
        theme.palette.mode === "dark"
          ? theme.palette.grey[900]
          : theme.palette.grey[200]};

    & thead {
      & tr:first-of-type th:first-of-type {
        border-top-left-radius: 8px !important;
      }

      & tr:first-of-type th:last-child {
        border-top-right-radius: 8px !important;
      }

      & th {
        ${(props) => props.theme.typography.bodyXs}
        font-weight: 500;
        text-transform: uppercase;
        padding: 12px 24px;
        background: transparent;
        text-align: left;
        border-bottom: 1px solid
          ${({ theme }) =>
            theme.palette.mode === "dark" ? "#323441" : "#EBEBF2"};
        color: ${({ theme }) =>
          theme.palette.mode === "dark"
            ? theme.palette.grey[400]
            : theme.palette.grey[500]};

        &::before {
          display: none;
        }
      }
    }
    & tbody {
      & tr:last-child td:first-of-type {
        border-bottom-left-radius: 8px !important;
      }
      & tr:last-child td:last-child {
        border-bottom-right-radius: 8px !important;
      }
      & td {
        ${(props) => props.theme.typography.bodyS}
        padding: 16px 24px;
        color: ${({ theme }) =>
          theme.palette.mode === "dark" ? "#fdfdfe" : "#000000"};
        cursor: pointer;
        border-bottom: 1px solid
          ${({ theme }) =>
            theme.palette.mode === "dark"
              ? theme.palette.grey[900]
              : theme.palette.grey[200]};
        white-space: nowrap;
        background: transparent;
        & * {
          z-index: 1;
        }
      }
    }
  }
`;

export const RowTableData = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

export const ColTableData = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;
