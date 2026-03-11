import { pb } from '../pocketbase/client';
import type { User } from './types';

const mapPbToUser = (record: any): User => ({
    id: record.id,
    email: record.email,
    name: record.name || null,
    full_name: record.name || null,
    phone: record.phone || null,
    address: record.address || null,
    role: record.role || 'customer',
    created_at: record.created,
});

export const pocketbaseUserService = {
    async getAll(): Promise<User[]> {
        try {
            const records = await pb.collection('users').getFullList({
                sort: '-created',
            });
            return records.map(mapPbToUser);
        } catch (error: any) {
            console.error('Error fetching users:', error);
            return [];
        }
    },

    async getById(id: string): Promise<User | null> {
        try {
            const record = await pb.collection('users').getOne(id);
            return mapPbToUser(record);
        } catch (error: any) {
            console.error(`Error fetching user ${id}:`, error);
            return null;
        }
    },

    async update(id: string, data: Partial<User>): Promise<boolean> {
        try {
            await pb.collection('users').update(id, data);
            return true;
        } catch (error: any) {
            console.error(`Error updating user ${id}:`, error);
            return false;
        }
    }
};
