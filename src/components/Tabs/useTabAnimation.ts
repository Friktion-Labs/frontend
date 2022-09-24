import { useRef, useState, useCallback } from "react";

export const useTabAnimation = (
  defaultWidth: number,
  gap: number,
  setSelectedTab: (tab: string) => void
) => {
  const [currentWidth, setCurrentWidth] = useState(defaultWidth);
  const [transform, setTransform] = useState(0);
  const tabContainerRef: React.RefObject<HTMLInputElement> = useRef(null);

  const handleSelectTab = useCallback(
    (tab: string, activeIndex: number, e: React.SyntheticEvent | Event) => {
      const collection = tabContainerRef?.current?.children[0]?.children;
      var arr = collection && Array.from(collection);
      const tranform =
        arr &&
        arr
          .slice(0, activeIndex)
          .reduce((prev: number, cur: any) => prev + cur?.clientWidth + gap, 0);
      setCurrentWidth((e.target as HTMLDivElement).clientWidth);
      setTransform(tranform || 0);
      setSelectedTab(tab);
    },
    [setSelectedTab, gap]
  );
  return {
    handleSelectTab,
    currentWidth,
    transform,
    tabContainerRef,
  };
};
