import { css, Interpolation, Theme } from "@emotion/react";
import { useTheme } from "@mui/material";
import { AppSelect } from "common/components/AppSelect";
import { useRouteMatch } from "common/hooks/useRouteMatch";
import { ROUTES } from "features/volts-pages/constants/routes";
import { CustomOption } from "./CustomOption";
import { CustomSingleValue } from "./CustomSingleValue";
import { VoltOption } from "./VoltOption";

const VOLT_OPTIONS: VoltOption[] = [
  { label: "Generate Income", value: "/income", voltNumber: 1 },
  { label: "Sustainable Stables", value: "/stables", voltNumber: 2 },
  { label: "Crab Strategy", value: "/crab", voltNumber: 3 },
  { label: "Basis Yield", value: "/basis", voltNumber: 4 },
  { label: "Capital Protection", value: "/protection", voltNumber: 5 },
];

interface VoltSelectProps {
  css?: Interpolation<Theme>;
  className?: string;
}
export const VoltSelect = (props: VoltSelectProps) => {
  const theme = useTheme();
  const routeMatch = useRouteMatch(ROUTES);
  const currentValue = VOLT_OPTIONS.find(
    (option) => routeMatch?.pattern?.path === option.value
  );

  return (
    <AppSelect
      {...props}
      css={css`
        width: fit-content;
      `}
      options={VOLT_OPTIONS}
      value={currentValue}
      isSearchable={false}
      components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
      styles={{
        control: () => ({
          background: "transparent",
          cursor: "pointer",
        }),
        singleValue: (styles) => ({
          ...styles,
          ...theme.typography.h3,
          fontWeight: 700,
        }),
        option: (styles) => ({
          ...styles,
          background: "none !important",
          padding: "2px 8px",
        }),
        valueContainer: (styles) => ({
          ...styles,
          paddingLeft: 0,
        }),
      }}
    />
  );
};
