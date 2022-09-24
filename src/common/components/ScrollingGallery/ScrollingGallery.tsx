import {
  css,
  Interpolation,
  keyframes,
  SerializedStyles,
  Theme,
} from "@emotion/react";
import _ from "lodash";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { usePrevious } from "react-use";
import { useOnResize } from "common/hooks/useOnResize";
import { DraggableDiv } from "./DraggableDiv";

function resetNumberInRange(n: number, min: number, max: number): number {
  if (min > max) {
    throw new Error("resetNumberInRange: min cannot be more than max");
  }

  if (n < min) {
    const diff = Math.abs(min - n);
    return resetNumberInRange(max - diff, min, max);
  }

  if (n > max) {
    const diff = Math.abs(max - n);
    return resetNumberInRange(min + diff, min, max);
  }

  return n;
}

function getTranslateXsToResumeFrom(
  childrenContainer: HTMLElement | undefined,
  draggedTranslateX: number | undefined
) {
  const childrenContainerWidth =
    childrenContainer?.getBoundingClientRect().width;
  let translateXStart = draggedTranslateX;
  let translateXEnd =
    translateXStart !== undefined && childrenContainerWidth
      ? translateXStart - childrenContainerWidth * 0.3333
      : undefined;
  if (
    childrenContainerWidth &&
    translateXStart !== undefined &&
    translateXEnd !== undefined
  ) {
    translateXEnd = resetNumberInRange(
      translateXEnd,
      -childrenContainerWidth * 0.66666,
      -childrenContainerWidth * 0.33333
    );
    translateXStart = translateXEnd + childrenContainerWidth * 0.3333;
  }

  return { translateXStart, translateXEnd };
}

const renderChildren = (children: React.ReactNode[], spaceBetween: number) =>
  children.map((child, i) => {
    if (!React.isValidElement(child)) {
      return null;
    }

    return (
      <div
        key={i}
        css={css`
          margin: 0 ${spaceBetween / 2}px;
        `}
      >
        {child}
      </div>
    );
  });

interface ScrollingGalleryProps {
  spaceBetween?: number;
  loopDuration?: number;
  disableDrag?: boolean;
  children: React.ReactNode;
  css?: Interpolation<Theme>;
  className?: string;
  containerStyles?: (
    theme: Theme,
    isContainerLargerThanChildren: boolean
  ) => SerializedStyles;
}

export const ScrollingGallery = ({
  spaceBetween: spaceBetweenProp,
  loopDuration: loopDurationProp,
  children: childrenProp,
  disableDrag,
  containerStyles,
  ...rest
}: ScrollingGalleryProps) => {
  const spaceBetween = useMemo(() => spaceBetweenProp ?? 0, [spaceBetweenProp]);
  const speed = useMemo(() => loopDurationProp ?? 10, [loopDurationProp]);

  const [childrenInitialWidth, setChildrenInitialWidth] = useState<number>();
  const [children, setChildren] = useState<React.ReactNode[]>(
    React.Children.toArray(childrenProp)
  );
  const [childrenContainer, setChildrenContainer] = useState<HTMLElement>();
  const [parentContainer, setParentContainer] = useState<HTMLElement>();

  const [draggedTranslateX, setDraggedTranslateX] = useState<number>();
  const [isDragging, setIsDragging] = useState(false);
  const [pauseAnimation, setPauseAnimation] = useState(false);

  const childrenDuplicateCount =
    parentContainer && childrenInitialWidth !== undefined
      ? Math.ceil(
          parentContainer.getBoundingClientRect().width / childrenInitialWidth
        ) * 3
      : 3;
  const prevChildrenProp = usePrevious(childrenProp);
  const handleChildrenChange = useCallback(() => {
    if (parentContainer && childrenInitialWidth !== undefined) {
      const hasChildrenExceededScreenWidth =
        React.Children.count(childrenProp) * childrenDuplicateCount >
        children.length;
      const hasChildrenPropsChanged = childrenProp !== prevChildrenProp;
      if (hasChildrenPropsChanged || hasChildrenExceededScreenWidth) {
        setChildren(
          Array.from({ length: childrenDuplicateCount }, () =>
            React.Children.toArray(childrenProp)
          ).reduce((acc, curr) => [...acc, ...curr], []) // reduce is used to flatten the array
        );
      }
    }
  }, [
    children.length,
    childrenProp,
    childrenInitialWidth,
    parentContainer,
    prevChildrenProp,
    childrenDuplicateCount,
  ]);
  useEffect(() => {
    handleChildrenChange();
  }, [handleChildrenChange]);
  const handleChildrenChangeThrottled = _.throttle(handleChildrenChange, 100);
  const { listeningElementRef } = useOnResize(handleChildrenChangeThrottled);

  const { translateXStart, translateXEnd } = useMemo(
    () => getTranslateXsToResumeFrom(childrenContainer, draggedTranslateX),
    [childrenContainer, draggedTranslateX]
  );
  const scroll = useMemo(
    () => keyframes`
    0% {
      transform: translateX(${
        translateXStart !== undefined ? translateXStart + "px" : "-33.333%"
      });
    }
    100% {
      transform: translateX(${
        translateXEnd !== undefined ? translateXEnd + "px" : "-66.666%"
      });
    }
  `,
    [translateXStart, translateXEnd]
  );

  const isContainerLargerThanChildren = !!(
    parentContainer &&
    childrenInitialWidth !== undefined &&
    parentContainer.getBoundingClientRect().width > childrenInitialWidth
  );

  return (
    <div
      css={(theme) => css`
        overflow: hidden;
        display: flex;
        user-select: none;
        ${containerStyles
          ? containerStyles(theme, isContainerLargerThanChildren)
          : ""};
      `}
      ref={(node) => {
        listeningElementRef(node);

        if (node) {
          setParentContainer(node);
        }
      }}
      {...rest}
    >
      {isContainerLargerThanChildren ? (
        renderChildren(React.Children.toArray(childrenProp), spaceBetween)
      ) : (
        <DraggableDiv
          forwardedRef={(node) => {
            if (node) {
              setChildrenInitialWidth((oldValue) =>
                oldValue === undefined
                  ? node.getBoundingClientRect().width
                  : oldValue
              );
              setChildrenContainer(node);
            }
          }}
          onMouseEnter={() => {
            if (!disableDrag && childrenContainer) {
              const newDraggableTranslateX = new DOMMatrixReadOnly(
                window.getComputedStyle(childrenContainer).transform
              ).e;
              setDraggedTranslateX(newDraggableTranslateX);
              setPauseAnimation(true);
            }
          }}
          onMouseLeave={() => {
            setPauseAnimation(false);
          }}
          onMouseDrag={(clientXAfterDrag, clientXBeforeDrag) => {
            if (!disableDrag) {
              setDraggedTranslateX((oldValue) => {
                if (childrenContainer && oldValue !== undefined) {
                  const newValue =
                    oldValue + (clientXAfterDrag - clientXBeforeDrag);
                  const childrenContainerWidth =
                    childrenContainer.getBoundingClientRect().width;

                  const normalizedValue = resetNumberInRange(
                    newValue,
                    -childrenContainerWidth * 0.66666,
                    -childrenContainerWidth * 0.33333
                  );

                  return normalizedValue;
                } else if (childrenContainer) {
                  const newDraggableTranslateX = new DOMMatrixReadOnly(
                    window.getComputedStyle(childrenContainer).transform
                  ).e;

                  return newDraggableTranslateX;
                }

                return oldValue;
              });
              setIsDragging(true);
            }
          }}
          translateX={draggedTranslateX ?? 0}
          onEndDrag={() => {
            setIsDragging(false);
          }}
          css={css({
            visibility:
              childrenInitialWidth === undefined ? "hidden" : "visible",
            display: "flex",
            flex: "0 0 auto",
            animation:
              isDragging || pauseAnimation
                ? undefined
                : `${
                    (speed * childrenDuplicateCount) / 3
                  }s linear 0s infinite normal none running ${scroll}`,
          })}
        >
          {renderChildren(children, spaceBetween)}
        </DraggableDiv>
      )}
    </div>
  );
};
