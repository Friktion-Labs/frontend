import { useOnResize } from "common/hooks/useOnResize";
import { SerializedStyles, css } from "@emotion/react";
import { CollapsedTabContent } from "features/app-bar/types/CollapsedTabContent";
import _ from "lodash";
import React, { useState, useMemo } from "react";

interface AppBarItemsProps<T> {
  // value: T;
  // showHighlight: boolean;
  setCollapsedItemsContent: React.Dispatch<
    React.SetStateAction<CollapsedTabContent[]>
  >;
  children?: React.ReactNode;
  onChange?: (value: T) => void;
  className?: string;
  css?: SerializedStyles;
}
export const AppBarItems = <T,>({
  // value,
  // showHighlight,
  setCollapsedItemsContent,
  children: childrenProp,
  onChange,
  ...rest
}: AppBarItemsProps<T>) => {
  const [itemsContainerRight, setItemsContainerRight] = useState<number>();
  // const [highlightStyle, setHighlightStyle] = useState<React.CSSProperties>({});

  const handleResize = (itemsContainer: HTMLElement) => {
    const boundingClientRect = itemsContainer.getBoundingClientRect();
    setItemsContainerRight(boundingClientRect.right);
  };
  const handleResizeThrottled = _.throttle(handleResize, 100);
  const { listeningElementRef } = useOnResize(handleResizeThrottled);

  const children = useMemo(
    () =>
      React.Children.map(childrenProp, (child, i) => {
        if (!React.isValidElement(child)) {
          return null;
        }

        const childValue =
          child.props.value === undefined ? i : child.props.value;
        // const selected = childValue === value;

        return React.cloneElement(child, {
          index: i,
          onChange,
          parentRight: itemsContainerRight,
          // selected,
          setCollapsedItemsContent,
          value: childValue,
          // setHighlightStyle,
        });
      }),
    [
      childrenProp,
      onChange,
      // value,
      itemsContainerRight,
      setCollapsedItemsContent,
    ]
  );

  return (
    <div
      {...rest}
      css={css`
        display: flex;
        height: 100%;
        position: relative;
        padding: 16px 0px;
      `}
      ref={listeningElementRef}
    >
      {children}
      {/* {showHighlight && <AppBarItemHighlight style={highlightStyle} />} */}
    </div>
  );
};

// const AppBarItemHighlight = (props: { style?: React.CSSProperties }) => (
//   <div
//     {...props}
//     css={(theme) => css`
//       top: 0;
//       position: absolute;
//       height: 100%;
//       transition: ${theme.transitions.create("all")};
//       padding: inherit;
//     `}
//   >
//     <div
//       css={(theme) => css`
//         background-color: ${theme.palette.mode === "dark"
//           ? theme.palette.darkBlue[600]
//           : theme.palette.grey[100]};
//         border-radius: 8px;
//         height: 100%;
//       `}
//     />
//   </div>
// );
