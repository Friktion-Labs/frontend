import React from "react";
import { useInView } from "react-intersection-observer";

/**
 * Useful for reducing lag. Always starts with .inView, until the first time we
 * go out of view.
 */
export const IntersectionInView = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [ref, inView] = useInView();
  const [inViewSeen, setInViewSeen] = React.useState(false);
  if (!inViewSeen && inView) {
    setInViewSeen(true);
  }

  return (
    <div className={inView || !inViewSeen ? "inView" : "outOfView"} ref={ref}>
      {children}
    </div>
  );
};
