import { useNavigate } from "react-router-dom";
import { Navigate, useLocation, useMatch } from "react-router-dom";

let lastPage = window.location.pathname;

declare global {
  interface Window {
    /**
     * If true, the next one time the page wants to scroll to top, it will be nullified.
     */
    disableOneScrollTo: undefined | true;
  }
}

/**
 * Gets updated by the react router hook, and then sets the page title accordingly
 *
 * Also strips trailing slash
 */
export const ZeroNinePageTitleAndMiscMiddleware = () => {
  let navigate = useNavigate();
  //@ts-ignore
  window.navigate = navigate;

  const landingpage = useMatch("/");
  const homepage = useMatch("/volts");
  const portfolio = useMatch("/portfolio");
  const income = useMatch("/income");
  const stables = useMatch("/stables");
  const crab = useMatch("/crab");
  const basis = useMatch("/basis");
  const protection = useMatch("/protection");
  const circuits = useMatch("/circuits");
  const faucet = useMatch("/faucet");
  const analytics = useMatch("/analytics");
  const location = useLocation();

  if (landingpage) {
    document.title = "Friktion: Smarter returns on your crypto";
  } else if (homepage) {
    document.title = "Friktion Volts";
  } else if (portfolio) {
    document.title = "Friktion Portfolio";
  } else if (income) {
    document.title = "Friktion Volt #01: Income";
  } else if (stables) {
    document.title = "Friktion Volt #02: Stables";
  } else if (crab) {
    document.title = "Friktion Volt #03: Crab";
  } else if (basis) {
    document.title = "Friktion Volt #04: Basis Yield";
  } else if (protection) {
    document.title = "Friktion Volt #05: Capital Protection";
  } else if (circuits) {
    document.title = "Friktion Circuits";
  } else if (faucet) {
    document.title = "Friktion Devnet Faucet";
  } else if (analytics) {
    document.title = "Friktion Analytics";
  } else {
    if (
      window.location.hostname === "localhost" &&
      window.location.pathname.indexOf("/analytics") !== 0
    ) {
      console.log("Unable to find title match", location);
    }
  }

  // Scroll to the top on every page transition
  if (lastPage !== window.location.pathname) {
    if (window.location.hash === "#02") {
      setTimeout(() => {
        document.getElementById("02")?.scrollIntoView();
        navigate(window.location.pathname, { replace: true });
      }, 10);
    } else {
      if (window.disableOneScrollTo) {
        window.disableOneScrollTo = undefined;
      } else {
        window.scrollTo(0, 0);
      }
    }
  }
  lastPage = window.location.pathname;

  // If the last character of the url is '/'
  if (location.pathname.match("/.*/$")) {
    return (
      <Navigate
        replace
        to={{
          pathname: location.pathname.replace(/\/+$/, ""),
          search: location.search,
        }}
      />
    );
  } else return <></>;
};
