// ──────────────────────────────────────────────
// SANAAT — Mock Contact Service
// ──────────────────────────────────────────────

import type { ContactService } from '../interfaces';
import type { ContactMessage, ContactMessageInsert } from '../../types';
import { generateId } from '../../utils';

const delay = () => new Promise<void>((r) => setTimeout(r, 100));

export function createMockContactService(): ContactService {
  const messages: ContactMessage[] = [];

  const service: ContactService = {
    async submitMessage(data: ContactMessageInsert) {
      await delay();
      const message: ContactMessage = {
        id: generateId(),
        ...data,
        created_at: new Date().toISOString(),
      };
      messages.push(message);

      // eslint-disable-next-line no-console
      console.log(
        '[Mock Contact] New message received:',
        `\n  From: ${data.name} <${data.email}>`,
        `\n  Subject: ${data.subject}`,
        `\n  Message: ${data.message}`,
      );
    },
  };

  return service;
}
