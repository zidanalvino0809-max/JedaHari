import { useCallback, useEffect, useState } from "react";
import { PROFILE_STORAGE_KEY, parseProfile, type Profile } from "@/lib/profile";

/** Profile saved in localStorage. `ready` turns true after the first client read. */
export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      setProfile(parseProfile(localStorage.getItem(PROFILE_STORAGE_KEY)));
    } catch {
      /* storage unavailable */
    }
    setReady(true);
  }, []);

  const save = useCallback((next: Profile) => {
    setProfile(next);
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  return { profile, ready, save };
}
