import { FunctionComponent } from "react";
import { RowTableData } from ".";

interface WithUSDCProps {
  amount: number;
  children?: React.ReactNode;
}

export const WithUSDC: FunctionComponent<WithUSDCProps> = ({
  amount,
  children,
}) => (
  <RowTableData>
    {children || (
      <>
        <img
          height="24"
          width="24"
          src={require("../../09/greatLogos/logos/USDC.png")}
          alt="usdc"
        />
        <div>{amount.toLocaleString("en-US")} USDC</div>
      </>
    )}
  </RowTableData>
);
