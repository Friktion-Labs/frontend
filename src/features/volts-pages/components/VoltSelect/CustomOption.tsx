import { getVerticalVoltBar, getVoltBolt, getVoltSpan } from "09/glow09";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { components, GroupBase, OptionProps } from "react-select";
import { VoltOption } from "./VoltOption";

interface CustomOptionProps
  extends OptionProps<VoltOption, false, GroupBase<VoltOption>> {}

export const CustomOption = ({ children, ...rest }: CustomOptionProps) => {
  const theme = useTheme();
  const volt = rest.data.voltNumber;
  const Bolt = getVoltBolt(volt);
  const Span = getVoltSpan(volt);
  const GlowBar = getVerticalVoltBar(volt);

  return (
    <components.Option {...rest}>
      <OptionContainer
        to={rest.data.value}
        css={(theme) => css`
          font-weight: ${rest.isSelected ? 700 : 400};
          background: ${rest.isSelected || rest.isFocused
            ? theme.palette.mode === "dark"
              ? "rgba(0, 0, 0, 0.4)"
              : "rgba(255, 255, 255, 0.4)"
            : "none"};
        `}
      >
        <GlowBar
          css={css`
            visibility: ${rest.isSelected ? "visible" : "hidden"};
            align-self: stretch;
            margin-right: 8px;
            height: auto;
            border-radius: 0px;
            width: 6px;
          `}
        />
        <Bolt
          css={css({
            width: "18px",
            height: "24px",
            marginRight: "4px",
            ...(!rest.isSelected
              ? {
                  background:
                    theme.palette.mode === "dark"
                      ? theme.palette.grey[300]
                      : theme.palette.grey[500],
                }
              : {}),
          })}
        />
        <Span
          css={css({
            marginRight: "16px",
            display: "flex",
            ...(!rest.isSelected
              ? {
                  background: "none",
                  "-webkit-text-fill-color": "inherit",
                  color: "inherit",
                }
              : {}),
          })}
        >
          {volt}
        </Span>
        {children}
      </OptionContainer>
    </components.Option>
  );
};

const OptionContainer = styled(Link)`
  border-radius: 6px;
  overflow: hidden;
  height: 56px;
  display: flex;
  align-items: center;
  ${({ theme }) => theme.typography.bodyL};
  color: inherit !important;
  transition: ${({ theme }) =>
    theme.transitions.create("background", {
      duration: theme.transitions.duration.shorter,
    })};
`;
