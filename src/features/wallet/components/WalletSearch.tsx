import { Theme, Interpolation, css } from "@emotion/react";
import styled from "@emotion/styled";
import SearchIcon from "@mui/icons-material/Search";
import { useTheme } from "@mui/material";

interface WalletSearchProps {
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  css?: Interpolation<Theme>;
}
export const WalletSearch = ({
  value,
  onChange,
  ...rest
}: WalletSearchProps) => {
  const theme = useTheme();

  return (
    <WalletSearchContainer {...rest}>
      <SearchIcon
        htmlColor={theme.palette.grey[500]}
        css={css`
          width: 16px;
          height: 16px;
        `}
      />
      <StyledInput
        value={value}
        onChange={onChange}
        placeholder="Search for a wallet..."
      />
    </WalletSearchContainer>
  );
};

const WalletSearchContainer = styled.div`
  height: 54px;
  width: 100%;
  border-width: 0;
  border-style: solid;
  border-color: ${({ theme }) => theme.palette.grey[200]};
  border-bottom-width: 1px;
  padding: 0px 24px;
  display: flex;
  align-items: center;
  gap: 8px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    border-right-width: 0px;
  }
`;

const StyledInput = styled.input`
  outline: none;
  padding: 0;
  height: 100%;
  width: 100%;
  border: none;
  ${({ theme }) => theme.typography.bodyS};
  color: ${({ theme }) =>
    theme.palette.mode === "dark"
      ? theme.palette.grey[900]
      : theme.palette.grey[900]};
`;
