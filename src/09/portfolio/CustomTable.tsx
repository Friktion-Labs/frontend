import type { ColumnsType } from "antd/lib/table";
import styled from "@emotion/styled";
import { Table as TableAnt } from "antd";
import { FunctionComponent, useCallback } from "react";
import {
  useManagementModal,
  ZeroNineManagementModal,
} from "../ZeroNineManagementModal";
import { GlobalId } from "../registry10";

interface CustomTableProps {
  columns: ColumnsType<any>;
  dataSource: any[];
  disableClick: boolean;
}

export const CustomTable: FunctionComponent<CustomTableProps> = ({
  columns,
  dataSource,
  disableClick,
}) => {
  const { openModal, modalSesameBall } = useManagementModal();

  const onClick = useCallback(
    (globalId: GlobalId) => {
      if (!globalId || disableClick) return;
      openModal(globalId);
    },
    [openModal, disableClick]
  );

  return (
    <>
      <Table
        onRow={(record: any, rowIndex) => {
          return {
            onClick: () => {
              onClick(record.key as GlobalId);
            },
          };
        }}
        rowClassName={(record: any) => {
          return record.volt === 1
            ? "blue-table-row"
            : record.volt === 2
            ? "green-table-row"
            : record.volt === 3
            ? "yellow-table-row"
            : "pink-table-row";
        }}
        columns={columns}
        dataSource={dataSource}
        pagination={
          dataSource.length > 10 ? { position: ["bottomRight"] } : false
        }
        tableLayout="auto"
      />
      <ZeroNineManagementModal modalSesameBall={modalSesameBall} />
    </>
  );
};

const Table = styled(TableAnt)`
  width: 100%;
  font-family: "Euclid Circular B";
  & .ant-table {
    background: transparent;
  }
  & table {
    background: transparent;
    border-collapse: collapse;
    border-radius: 4px;
    border-style: hidden;
    box-shadow: 0 0 0 1px hsl(230, 15%, 20%);
    & thead {
      & tr:first-of-type th:first-of-type {
        border-top-left-radius: 8px;
      }
      & tr:first-of-type th:last-child {
        border-top-right-radius: 8px;
      }
      & th:first-of-type {
        padding-left: 24px;
        padding-right: 24px;
      }
      & th {
        padding: 10px 14px;
        background: transparent;
        text-align: left;
        border-bottom: 1px solid hsl(230, 15%, 20%);
        font-weight: 500;
        font-size: 12px;
        line-height: 24px;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        color: #a7a7b1;
        &::before {
          display: none;
        }
      }
    }
    & tbody {
      & tr:last-child td:first-of-type {
        border-bottom-left-radius: 8px;
      }
      & tr:last-child td:last-child {
        border-bottom-right-radius: 8px;
      }
      & tr {
        cursor: pointer;
        position: relative;
        &:hover {
          &.blue-table-row {
            box-shadow: 0px 0px 12px 1px rgba(54, 195, 255, 0.8);
          }
          &.green-table-row {
            box-shadow: 0px 0px 12px 1px rgba(60, 250, 82, 0.8);
          }
          &.yellow-table-row {
            box-shadow: 0px 0px 12px 1px rgba(252, 255, 73, 0.8);
          }
          &.pink-table-row {
            box-shadow: 0px 0px 12px 1px rgba(255, 92, 241, 0.8);
          }

          &:after {
            position: absolute;
            inset: 0;
            padding: 1px;
            content: "";

            border-radius: 8px;
            -webkit-mask: linear-gradient(#fff 0 0) content-box,
              linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask-composite: exclude;

            &.blue-table-row {
              background: linear-gradient(90deg, #17c9ff 30%, #637dff 100%);
            }
            &.green-table-row {
              background: linear-gradient(90deg, #5ded39 30%, #28edbf 100%);
            }
            &.yellow-table-row {
              background: linear-gradient(90deg, #cfe600 30%, #ffc003 100%);
            }
            &.pink-table-row {
              background: linear-gradient(90deg, #a695fc 30%, #f27ee3 100%);
            }
          }
        }
        & td:first-of-type {
          padding-left: 24px;
          padding-right: 24px;
        }
        & td {
          padding: 16px 14px;
          font-style: normal;
          font-size: 14px;
          line-height: 21px;
          color: #fdfdfe;
          cursor: pointer;
          border-bottom: 1px solid #1a1c22;
          background: transparent !important;
          & * {
            z-index: 1;
          }
        }
      }
    }
  }
`;
