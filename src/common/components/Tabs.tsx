import { css, Interpolation, Theme } from "@emotion/react";
import styled from "@emotion/styled";
import React, { useMemo } from "react";
import { useState } from "react";

interface TabsInnerProps<T> {
  forwardedRef: React.ForwardedRef<HTMLDivElement>;
  value: T;
  TabIndicatorProps?: React.ComponentProps<typeof TabIndicator> & {
    css?: Interpolation<Theme>;
  };
  children?: React.ReactNode;
  onChange?: (value: T) => void;
  className?: string;
  css?: Interpolation<Theme>;
}
const TabsInner = <T,>({
  forwardedRef,
  value,
  TabIndicatorProps,
  children: childrenProp,
  onChange,
  ...rest
}: TabsInnerProps<T>) => {
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});

  const children = useMemo(
    () =>
      React.Children.map(childrenProp, (child, i) => {
        if (!React.isValidElement(child)) {
          return null;
        }

        const childValue: T =
          child.props.value === undefined ? i : child.props.value;
        const selected = childValue === value;

        return React.cloneElement(child, {
          index: i,
          onChange,
          selected,
          setIndicatorStyle,
          value: childValue,
        });
      }),
    [childrenProp, onChange, value]
  );

  // hide indicator if no tabs were selected
  React.useEffect(() => {
    if (children) {
      const hasSelected = children.some((child) => child.props?.selected);
      if (!hasSelected) {
        setIndicatorStyle((styles) => ({
          ...styles,
          display: "none",
        }));
      }
    } else {
      setIndicatorStyle((styles) => ({
        ...styles,
        display: "none",
      }));
    }
  }, [children]);

  return (
    <div
      {...rest}
      ref={forwardedRef}
      css={css`
        display: flex;
        position: relative;
      `}
    >
      {children}
      <TabIndicator style={indicatorStyle} {...TabIndicatorProps} />
    </div>
  );
};

export const Tabs = React.forwardRef<
  HTMLDivElement,
  Omit<TabsInnerProps<any>, "forwardedRef">
>((props, ref) => <TabsInner forwardedRef={ref} {...props} />);

const TabIndicator = styled.div`
  position: absolute;
  height: 1px;
  bottom: 0px;
  display: flex;
  justify-content: center;
  transition: ${({ theme }) => theme.transitions.create("all")};
`;
