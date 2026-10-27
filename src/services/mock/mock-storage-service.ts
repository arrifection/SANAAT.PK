// ──────────────────────────────────────────────
// SANAAT — Storage Service (Data URL & Persistence)
// Converts uploaded photos to Data URLs so actual photos show
// ──────────────────────────────────────────────

import type { StorageService } from '../interfaces';
import { generateId } from '../../utils';

export function createMockStorageService(): StorageService {
  const service: StorageService = {
    async uploadProductImage(file: File, productId: string) {
      // Read actual file as base64 data URL so owner's uploaded photo is genuinely displayed
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Failed to read image file'));
        reader.readAsDataURL(file);
      });

      const fakeId = generateId();
      const ext = file.name.split('.').pop() ?? 'jpg';
      const storagePath = `products/${productId}/${fakeId}.${ext}`;

      return { url: dataUrl, storage_path: storagePath };
    },

    async deleteProductImage(_storagePath: string) {
      // No-op for local mock storage
    },
  };

  return service;
}
