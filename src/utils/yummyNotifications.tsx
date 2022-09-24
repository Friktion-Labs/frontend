import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { CircularProgress, circularProgressClasses } from "@mui/material";
import { toast, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const commonSettings: Partial<ToastOptions> = {
  position: "bottom-left",
  autoClose: 5000,
  hideProgressBar: false,
  pauseOnHover: true,
  draggable: false,
  closeOnClick: false,
  progress: undefined,
};

export const simpleToast = (message: string) => {
  toast(message, {
    ...commonSettings,
  });
};

/**
 * Examples for title:
 * - "Airdrop claim error"
 */
export const errorToast = (
  title: string,
  message: string | JSX.Element,
  options?: ToastOptions<{}> | undefined
) => {
  assertNotStartsWithError(title);
  assertCapitalized(message);

  return toast.error(
    <div>
      <Title>{title}</Title>
      {message}
    </div>,
    {
      ...commonSettings,
      autoClose: 10000,
      ...(options ?? {}),
    }
  );
};

/**
 * Title should say the action such as "Deposit 0.3 BTC"
 */
export const successToast = (title: string, message: string | JSX.Element) => {
  assertCapitalized(message);

  toast.success(
    <div>
      <Title>{title}</Title>
      {message}
    </div>,
    {
      ...commonSettings,
      autoClose: 10000,
    }
  );
};

/**
 * Info is not the final state.
 */
export const infoToast = (
  title: string,
  message: string | JSX.Element,
  options?: ToastOptions<{}> | undefined
) => {
  assertCapitalized(message);

  return toast.info(
    <div>
      <Title>{title}</Title>
      {message}
    </div>,
    {
      ...commonSettings,
      autoClose: 10000,
      ...(options ?? {}),
    }
  );
};
export const Title = styled.p`
  font-weight: bold;
  /* line-height: 1; */
  margin-bottom: 0;
`;

const assertCapitalized = (message: string | JSX.Element) => {
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    if (
      typeof message === "string" &&
      message.length &&
      /[a-z]/.test(message.charAt(0))
    ) {
      alert(
        "Please make first letter of error message capitalized. Message:" +
          message
      );
      // throw new Error("Please make first letter of error message capitalized.");
    }
  }
};
const assertNotStartsWithError = (title: string) => {
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    if (title.toLowerCase().startsWith("error")) {
      alert(
        "Please start your error title with a word that is not error. title:" +
          title
      );

      throw new Error(
        'Please don\'t start your title with "error" in errorToast. Be more specific.' +
          "Instead, say something like Deposit error:" +
          "Message passed in ```\n" +
          title
      );
    }
  }
};

export const ConfirmationSpinner = () => (
  <div
    css={css`
      position: relative;
      display: flex;
    `}
  >
    <CircularProgress
      variant="determinate"
      sx={{
        color: "#eeeeee",
      }}
      size={20}
      thickness={4}
      value={100}
    />
    <CircularProgress
      variant="indeterminate"
      disableShrink
      sx={{
        color: "#444444",
        animationDuration: "550ms",
        position: "absolute",
        left: 0,
        [`& .${circularProgressClasses.circle}`]: {
          strokeLinecap: "round",
        },
      }}
      size={20}
      thickness={4}
    />
  </div>
);
