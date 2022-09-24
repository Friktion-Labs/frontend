export const localhostAlertForTypescriptError = (message: string) => {
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    try {
      throw new Error(message);
    } catch (e) {
      if (e instanceof Error) {
        console.error(e);
        console.error(e.stack);
      }
      console.error(message);
      alert(
        "Typescript error! This happened when refactoring. Was trying to add type annotations but had to guess in some places. See console for stack. Message: " +
          message
      );
      throw e;
    }
  }
};

/**
 * When in localhost, will make a loud alert error if we are on localhost and condition is falsy
 */
export function softInvariant(
  condition: any,
  // Can provide a string, or a function that returns a string for cases where
  // the message takes a fair amount of effort to compute
  message?: string
): asserts condition {
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    if (condition) {
      return;
    }

    try {
      throw new Error(message);
    } catch (e) {
      if (e instanceof Error) {
        console.error(e);
        console.error(e.stack);
      }
      console.error(message);
      alert(
        "Typescript softInvariant error! This happened when refactoring. Was trying to add type annotations but had to guess in some places. See console for stack. Message: " +
          message
      );
      throw e;
    }
  }
}
