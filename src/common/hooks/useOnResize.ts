import { useCallback, useEffect, useState } from "react";

export function useOnResize(
  handleResize: (element: HTMLElement) => void,
  options?: {
    enableOnScrollListener?: boolean;
  }
) {
  const [listeningElement, setListeningElement] = useState<HTMLElement>();
  const listeningElementRef = useCallback((node: HTMLElement | null) => {
    if (node) {
      setListeningElement(node);
    }
  }, []);

  useEffect(() => {
    if (listeningElement) {
      const resizeCallback = () => {
        handleResize(listeningElement);
      };
      resizeCallback();

      const resizeObserver = new ResizeObserver(resizeCallback);
      resizeObserver.observe(listeningElement);

      window.addEventListener("resize", resizeCallback);

      if (options?.enableOnScrollListener) {
        window.addEventListener("scroll", resizeCallback);
      }

      return () => {
        resizeObserver.disconnect();
        window.removeEventListener("resize", resizeCallback);

        if (options?.enableOnScrollListener) {
          window.removeEventListener("scroll", resizeCallback);
        }
      };
    }
  }, [listeningElement, handleResize, options?.enableOnScrollListener]);

  return { listeningElement, listeningElementRef };
}
