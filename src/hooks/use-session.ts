'use client';
import { useIssueJwt } from '@getpara/react-sdk';
import { useEffect, useState } from 'react';

export function useSessionToken() {
  const { issueJwtAsync, isPending, error } = useIssueJwt();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const res = await issueJwtAsync(); // ✅ await the promise
        setToken(res?.token || null);
        //console.log('[useSessionToken] issued token:', res?.token);
      } catch (err) {
        //console.error('[useSessionToken] failed to issue JWT:', err);
        setToken(null);
      }
    };

    fetchToken();
  }, [issueJwtAsync]);

  return { token, loading: isPending, error };
}
