import "react-app-polyfill/stable";
import React from "react";
import { createRoot } from "react-dom/client";
import "@dialectlabs/react-ui/index.css";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import invariant from "tiny-invariant";

// import "core-js/stable";

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById("root")
// );

const container = document.getElementById("root");
invariant(container);
const root = createRoot(container);
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

if (navigator.vendor.includes("Apple")) {
  container.classList.add("AppleWebKit");
}

root.render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
