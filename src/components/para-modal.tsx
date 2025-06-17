import { useModal, useAccount, useWallet, useClient } from "@getpara/react-sdk";
import { useMemo } from "react";

function ellipsify(address?: string, start = 4, end = 4) {
  if (!address) return '';
  if (address.length <= start + end) return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}

export function ParaButton() {
  const { openModal } = useModal();
  const { data: account } = useAccount();
  const { data: wallet } = useWallet();
  const para = useClient();

  const displayAddress = useMemo(() => {
    if (!wallet || !para) return '';
    return para.getDisplayAddress(wallet.id, {
      truncate: false,
      addressType: wallet.type,
    });
  }, [wallet, para]);

  return (
    <>
      <button onClick={openModal}>
        {account?.isConnected ? 'Connected' : 'Sign in with Para'}
      </button>
      {account?.isConnected && displayAddress && (
        <div style={{ marginTop: 8, fontSize: 14, color: '#666' }}>
          Wallet: <code>{ellipsify(displayAddress)}</code>
        </div>
      )}
    </>
  );
}
