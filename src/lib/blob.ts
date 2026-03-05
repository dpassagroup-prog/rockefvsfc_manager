import { put } from '@vercel/blob';

export async function uploadPaymentProof(file: File, invoiceId: string) {
  const filename = `payments/${invoiceId}/${Date.now()}-${file.name}`;
  const blob = await put(filename, file, {
    access: 'public',
  });
  return blob.url;
}