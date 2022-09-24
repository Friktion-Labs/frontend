import { useCallback, useState } from "react";

export function useForceUpdate() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setValue] = useState(0);

  return useCallback(() => {
    setValue((value) => value + 1);
  }, []); // update state to force render
}
