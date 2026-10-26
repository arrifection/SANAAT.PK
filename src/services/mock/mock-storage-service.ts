// ──────────────────────────────────────────────
// SANAAT — Mock Storage Service
// ──────────────────────────────────────────────

import type { StorageService } from '../interfaces';
import { generateId } from '../../utils';

const delay = () => new Promise<void>((r) => setTimeout(r, 150));

export function createMockStorageService(): StorageService {
  const service: StorageService = {
    async uploadProductImage(file: File, productId: string) {
      await delay();
      const fakeId = generateId();
      const ext = file.name.split('.').pop() ?? 'jpg';
      const storagePath = `products/${productId}/${fakeId}.${ext}`;
      const url = `https://placehold.co/600x800/f5f5f5/999999?text=${encodeURIComponent(file.name)}`;

      return { url, storage_path: storagePath };
    },

    async deleteProductImage(_storagePath: string) {
      await delay();
      // Mock: no-op — nothing to actually delete
    },
  };

  return service;
}
