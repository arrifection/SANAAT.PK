// ──────────────────────────────────────────────
// SANAAT — Mock Auth Service
// Persists admin session in localStorage
// ──────────────────────────────────────────────

import type { AuthService } from '../interfaces';
import type { Profile } from '../../types';
import { generateId } from '../../utils';

const STORAGE_KEY = 'sanaat_admin_session_v2';
const delay = () => new Promise<void>((r) => setTimeout(r, 60));

export function createMockAuthService(): AuthService {
  let currentProfile: Profile | null = null;
  const listeners: Set<(profile: Profile | null) => void> = new Set();

  // Initialize from localStorage
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      currentProfile = JSON.parse(saved);
    }
  } catch {
    currentProfile = null;
  }

  function notifyListeners() {
    for (const cb of listeners) {
      cb(currentProfile);
    }
  }

  const service: AuthService = {
    async signIn(email: string, password: string) {
      await delay();

      // Verify authorized owner account
      const normalizedEmail = email.trim().toLowerCase();
      const validEmail = normalizedEmail === 'arrifection@gmail.com' || normalizedEmail.endsWith('@sanaat.pk');
      
      if (!validEmail || !password || password.length < 6) {
        throw new Error('Invalid email or password.');
      }

      currentProfile = {
        id: generateId(),
        email: normalizedEmail,
        role: 'admin',
        created_at: new Date().toISOString(),
      };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentProfile));
      } catch {
        // ignore storage errors
      }

      notifyListeners();
      return { user: currentProfile };
    },

    async signOut() {
      await delay();
      currentProfile = null;
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
      notifyListeners();
    },

    async getSession() {
      await delay();
      return currentProfile;
    },

    onAuthStateChange(callback: (profile: Profile | null) => void) {
      listeners.add(callback);
      // Immediately invoke with current state
      callback(currentProfile);

      return () => {
        listeners.delete(callback);
      };
    },
  };

  return service;
}
