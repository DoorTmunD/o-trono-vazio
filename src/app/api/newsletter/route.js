import { subscribeToNewsletter } from '@/server/newsletter';

export const runtime = 'nodejs';

export async function POST(request) {
  return subscribeToNewsletter(request);
}
