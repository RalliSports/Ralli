"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useModal, useAccount } from "@getpara/react-sdk";
import { toast } from "sonner";

export default function SignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { openModal } = useModal();
  const account = useAccount();
  const [hasShownInitialModal, setHasShownInitialModal] = useState(false);
  const modalOpenedRef = useRef(false);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const callbackUrl = searchParams.get("callbackUrl") || "/main";

  // Check if modal is open by looking for Para modal elements in DOM
  const isModalOpen = () => {
    return document.querySelector('[data-testid="para-modal"]') !== null ||
           document.querySelector('.para-modal') !== null ||
           document.querySelector('[class*="modal"]') !== null;
  };

  // Start monitoring for modal close
  const startModalMonitoring = () => {
    if (checkIntervalRef.current) return;
    
    checkIntervalRef.current = setInterval(() => {
      if (modalOpenedRef.current && !isModalOpen() && !account?.isConnected) {
        // Modal was open but is now closed, and user is not connected
        modalOpenedRef.current = false;
        toast.error("Please sign in to continue", {
          duration: 3000,
          action: {
            label: "Try Again",
            onClick: () => {
              setTimeout(() => {
                openModal();
                modalOpenedRef.current = true;
              }, 500);
            }
          }
        });
        
        // Automatically reopen modal after a short delay
        setTimeout(() => {
          if (!account?.isConnected) {
            openModal();
            modalOpenedRef.current = true;
          }
        }, 3000);
      }
    }, 1000);
  };

  // Stop monitoring
  const stopModalMonitoring = () => {
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current);
      checkIntervalRef.current = null;
    }
  };

  useEffect(() => {
    // If user is already logged in, redirect to callback URL or main
    if (account?.isConnected) {
      stopModalMonitoring();
      router.push(callbackUrl);
      return;
    }

    // If not logged in and haven't shown modal yet, open it
    if (!hasShownInitialModal) {
      setTimeout(() => {
        openModal();
        modalOpenedRef.current = true;
        setHasShownInitialModal(true);
        startModalMonitoring();
      }, 500);
    }
  }, [account?.isConnected, router, openModal, hasShownInitialModal, callbackUrl]);

  // Monitor account changes and redirect when logged in
  useEffect(() => {
    if (account?.isConnected) {
      stopModalMonitoring();
      router.push(callbackUrl);
    }
  }, [account?.isConnected, router, callbackUrl]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopModalMonitoring();
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-stone-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00CED1] mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#00CED1] to-[#FFAB91] bg-clip-text text-transparent mb-2">
          Welcome to Ralli
        </h1>
        <p className="text-gray-600">
          {account?.isConnected ? "Redirecting to main..." : "Opening wallet connection..."}
        </p>
      </div>
    </div>
  );
}
