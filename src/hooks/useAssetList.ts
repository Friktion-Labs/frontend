import { useContext } from "react";
import { AssetListContext } from "../contexts/AssetListContext";

const useAssetList = () => useContext(AssetListContext);

export default useAssetList;
