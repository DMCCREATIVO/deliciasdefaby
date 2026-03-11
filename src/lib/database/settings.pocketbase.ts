import { pb } from '../pocketbase/client';

export interface Setting {
    id: string;
    key: string;
    value: any;
    category: string;
}

export interface BusinessSettings {
    id?: string;
    business_name: string;
    business_address: string;
    logo?: string;
    whatsapp_number: string;
    email: string;
    phone: string;
    currency: "CLP" | "USD" | "EUR" | "BRL" | "ARS" | "MXN" | "COP" | "PEN";
    language: "es" | "en" | "pt";
    timezone: string;
    enable_online_payments: boolean;
    mercadopago_public_key: string;
    mercadopago_access_token: string;
    delivery_schedule_text: string;
    facebook_url: string;
    instagram_url: string;
    twitter_url: string;
    youtube_url: string;
    footer_text: string;
    maintenance_mode: boolean;
    allow_registration: boolean;
    min_order_amount: number;
    delivery_fee: number;
    free_delivery_threshold: number;
    created_at?: string;
    updated_at?: string;
}

export const pocketbaseSettingsService = {
    async getAll(): Promise<Setting[]> {
        try {
            const records = await pb.collection('settings').getFullList();
            return records.map(record => ({
                id: record.id,
                key: record.key,
                value: record.value,
                category: record.category,
            }));
        } catch (error: any) {
            console.error('Error fetching settings:', error);
            return [];
        }
    },

    async getByKey(key: string): Promise<Setting | null> {
        try {
            const record = await pb.collection('settings').getFirstListItem(`key="${key}"`);
            return {
                id: record.id,
                key: record.key,
                value: record.value,
                category: record.category,
            };
        } catch (error: any) {
            return null;
        }
    },

    async update(key: string, value: any): Promise<boolean> {
        try {
            const existing = await this.getByKey(key);
            if (existing) {
                await pb.collection('settings').update(existing.id, { value });
            } else {
                await pb.collection('settings').create({ key, value, category: 'general' });
            }
            return true;
        } catch (error: any) {
            console.error(`Error updating setting ${key}:`, error);
            return false;
        }
    },

    async getSettings(): Promise<BusinessSettings | null> {
        try {
            const allSettings = await this.getAll();
            if (allSettings.length === 0) return null;

            const settingsObj: any = {};
            allSettings.forEach(s => {
                settingsObj[s.key] = s.value;
            });

            return settingsObj as BusinessSettings;
        } catch (error) {
            console.error('Error in getSettings:', error);
            return null;
        }
    },

    async saveSettings(settings: Partial<BusinessSettings>): Promise<BusinessSettings> {
        try {
            const promises = Object.entries(settings).map(([key, value]) => {
                if (key === 'id' || key === 'created_at' || key === 'updated_at') return Promise.resolve();
                return this.update(key, value);
            });

            await Promise.all(promises);
            return settings as BusinessSettings;
        } catch (error) {
            console.error('Error in saveSettings:', error);
            throw error;
        }
    },

    async uploadLogo(file: File): Promise<string> {
        try {
            // For PocketBase, we can store files in a dedicated 'assets' collection or similar
            // For now, let's assume we have an 'assets' collection or we store it in 'settings' if possible
            // Actually, PocketBase file fields are per record.
            // Let's create an 'assets' collection for such things if not exists, 
            // or just use a specific setting record that can hold a file?
            // PocketBase doesn't support files in 'JSON' fields easily.
            // Let's use a dedicated 'media' collection.

            const formData = new FormData();
            formData.append('file', file);
            formData.append('title', 'logo');

            const record = await pb.collection('media').create(formData);
            const url = pb.files.getUrl(record, record.file);

            // Update the logo setting with the new URL
            await this.update('logo', url);

            return url;
        } catch (error) {
            console.error('Error uploading logo:', error);
            throw error;
        }
    },

    async ensureSettingsTable(): Promise<void> {
        // In PocketBase, we assume the collection exists or we create it via MCP/UI.
        // For now, just a placeholder.
        return Promise.resolve();
    }
};
