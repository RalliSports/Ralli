"use client";

import { useModal } from "@getpara/react-sdk";

export function ParaButton() {
  const { openModal } = useModal();

  return (
    <>
      <button onClick={openModal}>
        Sign in with Para
      </button>
    </>
  );
}