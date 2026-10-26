// ──────────────────────────────────────────────
// SANAAT — Mock Category Service
// ──────────────────────────────────────────────

import type { CategoryService } from '../interfaces';
import type { Category, CategoryInsert, CategoryUpdate } from '../../types';
import { generateId } from '../../utils';

const delay = () => new Promise<void>((r) => setTimeout(r, 60));

export function createMockCategoryService(categories: Category[]): CategoryService {
  const service: CategoryService = {
    async getActiveCategories() {
      await delay();
      return categories
        .filter((c) => c.is_active)
        .sort((a, b) => a.display_order - b.display_order);
    },

    async getAllCategories() {
      await delay();
      return [...categories].sort((a, b) => a.display_order - b.display_order);
    },

    async getCategoryBySlug(slug: string) {
      await delay();
      return categories.find((c) => c.slug === slug) ?? null;
    },

    async createCategory(data: CategoryInsert) {
      await delay();
      const category: Category = {
        id: generateId(),
        ...data,
        created_at: new Date().toISOString(),
      };
      categories.push(category);
      return category;
    },

    async updateCategory(id: string, data: CategoryUpdate) {
      await delay();
      const idx = categories.findIndex((c) => c.id === id);
      if (idx === -1) throw new Error(`Category not found: ${id}`);
      categories[idx] = { ...categories[idx], ...data };
      return categories[idx];
    },

    async deleteCategory(id: string) {
      await delay();
      const idx = categories.findIndex((c) => c.id === id);
      if (idx === -1) throw new Error(`Category not found: ${id}`);
      categories.splice(idx, 1);
    },
  };

  return service;
}
