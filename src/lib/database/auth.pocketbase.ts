import { pb } from '../pocketbase/client';
import type { User, AuthService } from './types';

export const pocketbaseAuthService: AuthService = {
    async login(email: string, password: string): Promise<User> {
        try {
            const authData = await pb.collection('users').authWithPassword(email, password);
            const user = authData.record;

            return {
                id: user.id,
                email: user.email,
                name: user.name || null,
                phone: user.phone || null,
                address: user.address || null,
                role: user.role || 'customer',
                created_at: user.created,
            };
        } catch (error: any) {
            console.error('Error logging in:', error);
            throw new Error(error.message || 'Error al iniciar sesión');
        }
    },

    async register(email: string, password: string, name?: string): Promise<User> {
        try {
            const data = {
                email,
                password,
                passwordConfirm: password,
                name: name || '',
            };
            const record = await pb.collection('users').create(data);

            return {
                id: record.id,
                email: record.email,
                name: record.name || null,
                phone: record.phone || null,
                address: record.address || null,
                role: record.role || 'customer',
                created_at: record.created,
            };
        } catch (error: any) {
            console.error('Error registering:', error);
            throw new Error(error.message || 'Error al registrarse');
        }
    },

    async logout(): Promise<void> {
        pb.authStore.clear();
    },

    getCurrentUser(): User | null {
        const user = pb.authStore.model;
        if (!user) return null;

        return {
            id: user.id,
            email: user.email,
            name: user.name || null,
            phone: user.phone || null,
            address: user.address || null,
            role: user.role || 'customer',
            created_at: user.created,
        };
    },

    isAdmin(): boolean {
        const user = pb.authStore.model;
        return user?.role === 'admin';
    },
};
