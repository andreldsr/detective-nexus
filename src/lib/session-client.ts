"use client";

import { useEffect, useState } from 'react';

export type SessionUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
};

export async function getSessionUser(signal?: AbortSignal): Promise<SessionUser | null> {
  const res = await fetch('/api/auth/me', {
    method: 'GET',
    credentials: 'include',
    headers: { 'Accept': 'application/json' },
    signal,
  });
  if (!res.ok) return null;
  const data = await res.json();
  return (data?.user ?? null) as SessionUser | null;
}

export function useSessionUser() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    getSessionUser(controller.signal)
      .then(setUser)
      .catch((e) => setError(e instanceof Error ? e : new Error('Failed to load session user')))
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  return { user, loading, error };
}
