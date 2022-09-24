import { useAppWallet } from "features/wallet";
import { PublicKey } from "@solana/web3.js";
import { useState } from "react";
let addressChangeLogged = "";
/**
 * We can load info for wallet before even connected. Check wallet === null to
 * see if we are still loading.
 */
export const usePreloadAddress = ():
  | { preloadAddress: PublicKey | null; addressChange: false }
  | { preloadAddress: PublicKey; addressChange: true } => {
  const { publicKey } = useAppWallet();

  let [walletAddressToLoad, setAddressToLoad] = useState<PublicKey | null>(
    null
  );

  if (walletAddressToLoad === null) {
    // Fetch before the wallet is even connected
    try {
      let pubkey = localStorage.getItem("lastWallet");
      if (pubkey) {
        let maybeLastPubKey = new PublicKey(pubkey);
        setAddressToLoad(maybeLastPubKey);
        // console.log("Setting addy");
      }
    } catch (e) {
      console.error(e);
    }
  }
  if (
    publicKey &&
    (!walletAddressToLoad || !publicKey.equals(walletAddressToLoad))
  ) {
    const addressChange =
      walletAddressToLoad && !publicKey.equals(walletAddressToLoad);
    // console.log("Saving wallet");
    localStorage.setItem("lastWallet", publicKey.toBase58());
    setAddressToLoad(publicKey);
    walletAddressToLoad = publicKey;

    if (
      addressChange &&
      addressChangeLogged !== walletAddressToLoad.toBase58()
    ) {
      console.warn("Address changed! " + walletAddressToLoad.toBase58());
      addressChangeLogged = walletAddressToLoad.toBase58();
      return {
        preloadAddress: walletAddressToLoad,
        addressChange: true,
      };
    }
    return {
      preloadAddress: walletAddressToLoad,
      addressChange: false,
    };
  }

  return {
    /**
     * BE VERY CAREFUL. You must use addressChange or else you show stale info
     */
    preloadAddress: walletAddressToLoad,
    addressChange: false,
  };
};
