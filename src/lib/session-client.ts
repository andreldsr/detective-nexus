"use client";

import { useEffect, useState } from 'react';
import { auth } from './firebase';

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

async function refreshCookieFromFirebase(): Promise<boolean> {
  try {
    const user = auth.currentUser;
    if (!user) return false;
    const idToken = await user.getIdToken();
    const res = await fetch('/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ idToken }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function useSessionUser() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    async function init() {
      setLoading(true);
      try {
        let sessionUser = await getSessionUser(controller.signal);
        // If no cookie-backed session but Firebase client has a user, try to establish cookie
        if (!sessionUser && auth.currentUser) {
          const ok = await refreshCookieFromFirebase();
          if (ok) {
            sessionUser = await getSessionUser(controller.signal);
          }
        }
        if (!cancelled) setUser(sessionUser);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e : new Error('Failed to load session user'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    init();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  return { user, loading, error };
}
