import styled from "@emotion/styled";
import { useOnResize } from "common/hooks/useOnResize";
import _ from "lodash";
import { useCallback, useEffect } from "react";

export interface TabProps<T> {
  children?: React.ReactNode;
  className?: string;
  index?: number;
  onChange?: (value: T | undefined) => void;
  selected?: boolean;
  setIndicatorStyle?: React.Dispatch<React.SetStateAction<React.CSSProperties>>;
  value?: T;
  component?: React.ElementType<any>;
  to?: string;
}
export const Tab = <T,>({
  children,
  index,
  onChange,
  selected,
  setIndicatorStyle,
  value,
  component,
  ...rest
}: TabProps<T>) => {
  // update indicator position on any resizing and mount
  const updateIndicatorPosition = useCallback(
    (element: HTMLElement) => {
      if (setIndicatorStyle && selected) {
        const boundingClientRect = element.getBoundingClientRect();

        setIndicatorStyle((styles) => ({
          ...styles,
          width: boundingClientRect.width + "px",
          left: element.offsetLeft + "px",
        }));
      }
    },
    [setIndicatorStyle, selected]
  );
  const updateIndicatorPositionDebounced = _.debounce(
    updateIndicatorPosition,
    100
  );
  const { listeningElementRef } = useOnResize(updateIndicatorPositionDebounced);

  useEffect(() => {
    if (selected && onChange) {
      onChange(value);
    }
  }, [selected, value, onChange]);

  return (
    <TabRoot
      {...rest}
      selected={selected}
      as={component ?? "button"}
      onClick={() => {
        if ((!component || component === "button") && onChange) {
          onChange(value);
        }
      }}
      ref={listeningElementRef}
    >
      {children}
    </TabRoot>
  );
};

const TabRoot = styled.div<{ selected?: boolean }>`
  outline: none !important;
  border: none;
  cursor: pointer;
  background: transparent;
  padding: 10px 20px;
  white-space: nowrap;
  color: ${({ theme, selected }) =>
    selected
      ? "inherit"
      : theme.palette.mode === "dark"
      ? theme.palette.grey[300]
      : theme.palette.grey[500]} !important;
`;
