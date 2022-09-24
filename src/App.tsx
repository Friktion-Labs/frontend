import React from "react";
import "./App.less";
import "focus-visible"; // https://css-tricks.com/keyboard-only-focus-styles/
import { Routes } from "./app/routes";
import { AppProviders } from "app/AppProviders";
import "@reach/dialog/styles.css";

// const isLocalhost = Boolean(
//   window.location.hostname === "localhost" ||
//     // [::1] is the IPv6 localhost address.
//     window.location.hostname === "[::1]" ||
//     // 127.0.0.0/8 are considered localhost for IPv4.
//     window.location.hostname.match(
//       /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
//     )
// );
// if (isLocalhost) {
if (window.location.hostname === "wdyr") {
  const whyDidYouRender = require("@welldone-software/why-did-you-render");
  whyDidYouRender(React, {
    // trackAllPureComponents: true,
  });
}

function App() {
  return (
    <AppProviders>
      <Routes />
    </AppProviders>
  );
}

export default App;
