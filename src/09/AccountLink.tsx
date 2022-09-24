import { useExplorerLink } from "../hooks/useExplorerLink";

export const AccountLink: React.FC<{
  address: string;
  network: string;
  digits?: number;
}> = ({ address, digits = 5 }) => {
  const { createExplorerLink } = useExplorerLink();

  if (address === undefined) {
    return <span>undefined</span>;
  }
  return (
    <a href={createExplorerLink(address)} target="_blank" rel="noreferrer">
      {address.substring(0, digits)}
      ..
      {address.substring(address.length - digits)}
    </a>
  );
};
