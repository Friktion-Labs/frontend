import styled from "@emotion/styled";
import { useOnResize } from "common/hooks/useOnResize";
import { CollapsedTabContent } from "features/app-bar/types/CollapsedTabContent";
import _ from "lodash";
import React, { useCallback } from "react";
import { useState, useEffect } from "react";
import { usePrevious } from "react-use";

interface AppBarItemProps<T> {
  collapsedContent?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  index?: number;
  onChange?: (value: T | undefined) => void;
  parentRight?: number;
  selected?: boolean;
  setCollapsedItemsContent?: React.Dispatch<
    React.SetStateAction<CollapsedTabContent[]>
  >;
  setHighlightStyle?: React.Dispatch<React.SetStateAction<React.CSSProperties>>;
  value?: T;
}
export const AppBarItem = <T,>({
  children,
  collapsedContent,
  index,
  onChange,
  parentRight,
  selected,
  setCollapsedItemsContent,
  setHighlightStyle,
  value,
  ...rest
}: AppBarItemProps<T>) => {
  const [hide, setHide] = useState(true);
  const [loaded, setLoaded] = useState(false);

  // update highlight position on any resizing and mount
  const updateIndicatorPosition = useCallback(
    (itemElement: HTMLElement) => {
      if (setHighlightStyle && selected) {
        const boundingClientRect = itemElement.getBoundingClientRect();

        setHighlightStyle((styles) => ({
          ...styles,
          width: boundingClientRect.width + "px",
          left: itemElement.offsetLeft + "px",
        }));
      }
    },
    [setHighlightStyle, selected]
  );
  const updateHighlightPositionDebounced = _.debounce(
    updateIndicatorPosition,
    100
  );
  const { listeningElement: itemElement, listeningElementRef } = useOnResize(
    updateHighlightPositionDebounced
  );

  // hide tab item if item does not fit in viewport
  useEffect(() => {
    if (itemElement && parentRight) {
      const boundingClientRect = itemElement.getBoundingClientRect();
      if (boundingClientRect.right > parentRight && collapsedContent) {
        setHide(true);
      } else {
        setHide(false);
      }

      setLoaded(true);
    }
  }, [parentRight, itemElement, collapsedContent]);

  // populate/depopulate mobile dropdown
  const prevHide = usePrevious(hide);
  const prevLoaded = usePrevious(loaded);
  useEffect(() => {
    if (
      setCollapsedItemsContent &&
      collapsedContent &&
      index !== undefined &&
      loaded
    ) {
      if (hide && (!prevHide || !prevLoaded)) {
        setCollapsedItemsContent((collapsedTabsContent) => {
          const newCollapsedContent = [
            ...collapsedTabsContent,
            {
              content: collapsedContent,
              index,
            },
          ];
          newCollapsedContent.sort(
            (content1, content2) => content1.index - content2.index
          );
          return newCollapsedContent;
        });
      } else if (!hide && prevHide) {
        setCollapsedItemsContent((collapsedTabsContent) =>
          collapsedTabsContent.slice(1)
        );
      }
    }
  }, [
    hide,
    prevHide,
    setCollapsedItemsContent,
    collapsedContent,
    index,
    loaded,
    prevLoaded,
  ]);

  useEffect(() => {
    if (selected) {
      if (onChange) {
        onChange(value);
      }
    }
  }, [selected, value, onChange]);

  return (
    <AppBarItemContainer hide={hide} ref={listeningElementRef}>
      {children}
    </AppBarItemContainer>
  );
};

const AppBarItemContainer = styled.div<{ hide: boolean }>`
  visibility: ${({ hide }) => (hide ? "hidden" : "visible")};
  margin: 0 8px;
  z-index: 1;
  display: flex;
  align-items: center;
  cursor: pointer;
  border-radius: 8px;
  & > :first-of-type {
    ${({ theme }) => theme.typography.bodyS};
    font-weight: 400;
    height: 100%;
    display: flex;
    justify-content: center;
    padding: 0px 8px;
  }
`;
