"use client";

import { ParaModal, useModal } from "@getpara/react-sdk";

export function ParaButton() {
  const { openModal } = useModal();

  return (
    <>
      <button onClick={() => openModal()}>
        Sign in with Para
      </button>

      <ParaModal
        appName="TradeTalk"
        logo="https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png"
      />
    </>
  );
}