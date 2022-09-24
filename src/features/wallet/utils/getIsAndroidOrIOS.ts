export const getIsAndroidOrIos = () =>
  typeof window !== "undefined" &&
  window.isSecureContext &&
  typeof document !== "undefined" &&
  /android|iPhone.*Mobile|iPod|iPad/i.test(navigator.userAgent);
