import { css, Interpolation, Theme } from "@emotion/react";
import React, { useCallback, useRef } from "react";

interface DraggableDivProps {
  forwardedRef?: (node: HTMLDivElement | null) => void;
  onMouseDrag: (clientXAfterDrag: number, clientXBeforeDrag: number) => void;
  translateX: number;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onEndDrag?: () => void;
  css?: Interpolation<Theme>;
  className?: string;
  children: React.ReactNode;
}

export const DraggableDiv = ({
  forwardedRef,
  onMouseDrag: onMouseDragProp,
  translateX,
  onEndDrag: onEndDragProp,
  onMouseEnter: onMouseEnterProp,
  onMouseLeave: onMouseLeaveProp,
  children,
  ...rest
}: DraggableDivProps) => {
  const clientXBeforeDrag = useRef<number>();
  const isMouseDown = useRef(false);
  const hasMouseMoved = useRef(false);

  const onMouseEnter = useCallback(() => {
    if (onMouseEnterProp) {
      onMouseEnterProp();
    }
  }, [onMouseEnterProp]);

  const onMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      clientXBeforeDrag.current = e.clientX;
      isMouseDown.current = true;
    },
    []
  );
  const onTouchDown = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    clientXBeforeDrag.current = e.touches[0].clientX;
    isMouseDown.current = true;
  }, []);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (isMouseDown.current && clientXBeforeDrag.current !== undefined) {
        hasMouseMoved.current = true;
        onMouseDragProp(e.clientX, clientXBeforeDrag.current);
        clientXBeforeDrag.current = e.clientX;
      }
    },
    [onMouseDragProp]
  );
  const onTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (isMouseDown.current && clientXBeforeDrag.current !== undefined) {
        hasMouseMoved.current = true;
        onMouseDragProp(e.touches[0].clientX, clientXBeforeDrag.current);
        clientXBeforeDrag.current = e.touches[0].clientX;
      }
    },
    [onMouseDragProp]
  );

  const onMouseUp = useCallback(() => {
    if (onEndDragProp) {
      onEndDragProp();
    }
    isMouseDown.current = false;
    setTimeout(() => {
      hasMouseMoved.current = false;
    }, 10);
  }, [onEndDragProp]);

  const onMouseLeave = useCallback(() => {
    if (onEndDragProp) {
      onEndDragProp();
    }
    if (onMouseLeaveProp) {
      onMouseLeaveProp();
    }
    isMouseDown.current = false;
    hasMouseMoved.current = false;
  }, [onEndDragProp, onMouseLeaveProp]);

  const onClickCapture = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (hasMouseMoved.current) {
        e.stopPropagation();
        e.preventDefault();
        hasMouseMoved.current = false;
      }
    },
    []
  );

  return (
    <div
      onMouseEnter={onMouseEnter}
      onClickCapture={onClickCapture}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchDown}
      onMouseMove={onMouseMove}
      onTouchMove={onTouchMove}
      onMouseUp={onMouseUp}
      onTouchEnd={onMouseUp}
      onMouseLeave={onMouseLeave}
      onTouchCancel={onMouseLeave}
      css={css`
        transform: translateX(${translateX}px);
      `}
      ref={(node) => {
        if (forwardedRef) {
          forwardedRef(node);
        }
      }}
      {...rest}
    >
      {children}
    </div>
  );
};
