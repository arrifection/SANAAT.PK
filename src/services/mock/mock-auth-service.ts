// ──────────────────────────────────────────────
// SANAAT — Mock Auth Service
// ──────────────────────────────────────────────
// MOCK ONLY: Accepts any email containing "admin" with password "admin123".
// This is NOT a real authentication system. For development/demo only.
// ──────────────────────────────────────────────

import type { AuthService } from '../interfaces';
import type { Profile } from '../../types';
import { generateId } from '../../utils';

const delay = () => new Promise<void>((r) => setTimeout(r, 50));

export function createMockAuthService(): AuthService {
  let currentProfile: Profile | null = null;
  const listeners: Set<(profile: Profile | null) => void> = new Set();

  function notifyListeners() {
    for (const cb of listeners) {
      cb(currentProfile);
    }
  }

  const service: AuthService = {
    async signIn(email: string, password: string) {
      await delay();

      // MOCK: Accept any email containing "admin" with password "admin123"
      if (!email.toLowerCase().includes('admin') || password !== 'admin123') {
        throw new Error('Invalid credentials. (Mock: use an email containing "admin" and password "admin123")');
      }

      currentProfile = {
        id: generateId(),
        email,
        role: 'admin',
        created_at: new Date().toISOString(),
      };

      notifyListeners();
      return { user: currentProfile };
    },

    async signOut() {
      await delay();
      currentProfile = null;
      notifyListeners();
    },

    async getSession() {
      await delay();
      return currentProfile;
    },

    onAuthStateChange(callback: (profile: Profile | null) => void) {
      listeners.add(callback);
      // Immediately call with current state
      callback(currentProfile);
      // Return unsubscribe function
      return () => {
        listeners.delete(callback);
      };
    },
  };

  return service;
}
