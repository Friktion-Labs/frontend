import { useTheme } from "@mui/material";
import { ListIcon } from "components/CustomIcon";
import GridViewIcon from "@mui/icons-material/GridView";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { ViewMode } from "features/volts-pages/types/ViewMode";

interface ViewOptionProps {
  viewMode: ViewMode;
  toggleViewMode: (mode: "grid" | "list") => void;
}
export const ViewOption = ({ viewMode, toggleViewMode }: ViewOptionProps) => {
  const theme = useTheme();
  const color = theme.palette.mode === "dark" ? "#CECED8" : "#5D5D64";

  return (
    <div
      css={(theme) => css`
        margin: 0;
        height: 42px;
        background: ${theme.palette.mode === "dark"
          ? "transparent"
          : "rgb(249, 247, 254)"};
        border: ${theme.palette.mode === "dark"
          ? "1px solid rgba(255, 255, 255, 0.15)"
          : "1px solid #8d94a01a"};
        border-radius: 8px;
        padding: 6px;
        display: flex;
        justify-content: center;
        flex-direction: row;
        gap: 8px;
        align-items: center;
        position: relative;
      `}
    >
      <div
        css={css`
          display: flex;
          justify-content: center;
          align-items: center;
          width: 32px;
          height: 32px;
          cursor: pointer;
          border-radius: 6px;
          &:hover {
            background: rgba(255, 255, 255, 0.1);
          }
        `}
        onClick={() => {
          toggleViewMode("grid");
        }}
      >
        <GridViewIcon
          css={css`
            color: ${color};
          `}
        />
      </div>
      <div
        css={css`
          display: flex;
          justify-content: center;
          align-items: center;
          width: 32px;
          height: 32px;
          cursor: pointer;
          border-radius: 6px;
          &:hover {
            background: rgba(255, 255, 255, 0.1);
          }
        `}
        onClick={() => {
          toggleViewMode("list");
        }}
      >
        <ListIcon
          css={css`
            & path {
              stroke: ${color};
            }
          `}
        />
      </div>

      <Highlight isFirstSelected={viewMode === "grid"} />
    </div>
  );
};

const Highlight = styled.div<{ isFirstSelected: boolean }>`
  position: absolute;
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  left: ${({ isFirstSelected }) => (isFirstSelected ? "6px" : "46px")};
  transition: left 0.3s;
  z-index: -1;
`;
