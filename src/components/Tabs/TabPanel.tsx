import { useState, useEffect } from "react";

export const TabPanel = ({
  children,
  render = "idle",
  unmount = "never",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  hidden: boolean;
} & (
    | {
        render?: "always" | "idle";
        unmount?: "never";
      }
    | {
        render?: "lazy";
        unmount?: "always" | "idle" | "never";
      }
  )) => {
  const [shouldRender, setShouldRender] = useState(
    !props.hidden || render === "always"
  );

  useEffect(() => {
    if (!props.hidden || render === "always") {
      setShouldRender(true);
    } else if (render === "idle") {
      ("requestIdleCallback" in window ? requestIdleCallback : setTimeout)(() =>
        setShouldRender(true)
      );
    } else if (unmount === "always") {
      setShouldRender(false);
    } else if (unmount === "idle") {
      ("requestIdleCallback" in window ? requestIdleCallback : setTimeout)(() =>
        setShouldRender(false)
      );
    }
  }, [props.hidden, render, unmount]);

  return <div {...props}>{shouldRender ? children : null}</div>;
};
