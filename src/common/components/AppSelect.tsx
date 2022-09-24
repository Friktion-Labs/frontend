import { useTheme } from "@mui/material";
import Select, { GroupBase, Props, StylesConfig } from "react-select";
import { darken } from "@mui/material";

export const AppSelect = <
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>({
  styles: stylesProp,
  ...rest
}: Props<Option, IsMulti, Group>) => {
  const theme = useTheme();

  const selectStyles: StylesConfig<Option, IsMulti, Group> = {
    ...stylesProp,
    control: (styles, state) => ({
      ...styles,
      background:
        theme.palette.mode === "dark"
          ? theme.palette.grey[800]
          : theme.palette.grey[200],
      border: "none",
      boxShadow: "none",
      ...(stylesProp?.control ? stylesProp?.control(styles, state) : {}),
    }),
    singleValue: (styles, state) => ({
      ...styles,
      ...theme.typography.bodyS,
      ...(stylesProp?.singleValue
        ? stylesProp?.singleValue(styles, state)
        : {}),
    }),
    indicatorSeparator: (styles, state) => ({
      ...styles,
      display: "none",
      ...(stylesProp?.indicatorSeparator
        ? stylesProp?.indicatorSeparator(styles, state)
        : {}),
    }),
    menu: (styles, state) => {
      return {
        ...styles,
        zIndex: theme.zIndex.modal,
        background:
          theme.palette.mode === "dark" ? "#1A1C22" : theme.palette.grey[200],
        // width: "80%",
        ...(stylesProp?.menu ? stylesProp.menu(styles, state) : {}),
      };
    },
    option: (styles, state) => {
      return {
        ...styles,
        ...theme.typography.bodyS,
        ...(state.isFocused || state.isSelected
          ? {
              background:
                theme.palette.mode === "dark"
                  ? darken("#1A1C22", 0.3)
                  : theme.palette.grey[300],
            }
          : {}),
        ...(stylesProp?.option ? stylesProp?.option(styles, state) : {}),
      };
    },
  };

  return <Select styles={selectStyles} {...rest} />;
};
