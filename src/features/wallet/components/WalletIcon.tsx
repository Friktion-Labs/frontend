import type { DetailedHTMLProps, ImgHTMLAttributes } from "react";

export interface WalletIconProps
  extends DetailedHTMLProps<
    ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > {
  alt: string;
}

export const WalletIcon = ({ alt, ...rest }: WalletIconProps) => (
  <img width="20px" height="20px" alt={alt} {...rest} />
);
