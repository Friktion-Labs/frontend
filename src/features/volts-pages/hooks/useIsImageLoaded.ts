import React, { useCallback, useState } from "react";

export const useIsImageLoaded = () => {
  const [loaded, setLoaded] = useState(false);

  const onLoad = useCallback(() => {
    setLoaded(true);
  }, []);

  const imgRef: React.LegacyRef<HTMLImageElement> = (node) => {
    if (node) {
      node.onload = onLoad;

      if (node.complete) {
        onLoad();
      }
    }
  };

  return { loaded, imgRef };
};
