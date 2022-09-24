import { Theme, Interpolation } from "@emotion/react";
import styled from "@emotion/styled";
import { DialogContent, DialogOverlay, DialogProps } from "@reach/dialog";

interface WalletDialogProps extends Pick<DialogProps, "isOpen" | "onDismiss"> {
  "aria-label": string;
  children: React.ReactNode;
  css?: Interpolation<Theme>;
  className?: string;
}

export const WalletDialog = ({
  children,
  isOpen,
  onDismiss,
  ...rest
}: WalletDialogProps) => {
  return (
    <DialogOverlay
      dangerouslyBypassScrollLock
      allowPinchZoom
      isOpen={isOpen}
      onDismiss={onDismiss}
    >
      <DialogContentContainer>
        <StyledDialogContent {...rest}>{children}</StyledDialogContent>
      </DialogContentContainer>
    </DialogOverlay>
  );
};

const DialogContentContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 48px;
  min-height: calc(100% - 48px - 48px);
  z-index: ${({ theme }) =>
    theme.zIndex.modal + 1}; // place wallet modal on top of all other modals
  ${({ theme }) => theme.breakpoints.down("sm")} {
    margin: 16px;
    min-height: calc(100% - 16px - 16px);
  }
`;

const StyledDialogContent = styled(DialogContent)`
  border-radius: 12px;
  overflow: hidden;
  height: 480px;
  cursor: auto;
  max-width: ${({ theme }) => theme.breakpoints.values.sm}px;
  width: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
  background-color: ${({ theme }) =>
    theme.palette.mode === "dark"
      ? // ? theme.palette.grey[950]
        theme.palette.grey[50]
      : theme.palette.grey[50]} !important;
`;
