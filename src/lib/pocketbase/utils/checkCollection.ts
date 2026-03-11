import { pb } from '../client';
import { ClientResponseError } from 'pocketbase';

export const checkCollection = async (name: string) => {
  try {
    const collections = await pb.collections.getList(1, 50, {
      filter: `name = "${name}"`,
    });
    return collections.items.length > 0 ? collections.items[0] : null;
  } catch (error) {
    if (error instanceof ClientResponseError && error.status === 404) {
      return null;
    }
    console.error(`Error checking collection ${name}:`, error);
    throw error;
  }
};