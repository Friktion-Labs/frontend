import { useContext } from "react";
import {
  OwnedTokenAccountsContext,
  OwnedTokenAccountsContextT,
} from "../contexts/OwnedTokenAccounts";

const useOwnedTokenAccounts = (): OwnedTokenAccountsContextT =>
  useContext(OwnedTokenAccountsContext);

export default useOwnedTokenAccounts;
