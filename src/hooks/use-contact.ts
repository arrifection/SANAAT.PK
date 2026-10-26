import { useMutation } from '@tanstack/react-query';
import { useServices } from './use-services';
import type { ContactMessageInsert } from '../types';

export function useSubmitContact() {
  const services = useServices();
  return useMutation({
    mutationFn: (data: ContactMessageInsert) => services.contact.submitMessage(data),
  });
}
