import { useSearchParams } from "react-router-dom";
import { ViewMode } from "../types/ViewMode";

export const useViewMode = () => {
  const storedViewMode = localStorage.getItem("assetViewMode");
  const [searchParams, setSearchParams] = useSearchParams();
  const viewMode = (
    storedViewMode !== null
      ? storedViewMode
      : searchParams.get("viewMode") || "grid"
  ) as ViewMode;

  const toggleViewMode = (mode: "grid" | "list") => {
    if (viewMode === mode) return;
    const newViewMode = viewMode === "list" ? "grid" : "list";
    localStorage.setItem("assetViewMode", newViewMode);
    setSearchParams({ viewMode: newViewMode });
  };

  return { viewMode, toggleViewMode };
};
