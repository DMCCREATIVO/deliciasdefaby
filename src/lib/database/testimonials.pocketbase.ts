import { pb } from '../pocketbase/client';
import type { Testimonial, TestimonialService } from './types';

const mapPbToTestimonial = (record: any): Testimonial => ({
    id: record.id,
    name: record.name,
    comment: record.comment,
    rating: record.rating || 0,
    avatar: record.avatar ? pb.files.getURL(record, record.avatar) : undefined,
    status: record.status || 'pending',
    created_at: record.created,
    updated_at: record.updated,
});

export const pocketbaseTestimonialService: TestimonialService = {
    async getAll(): Promise<Testimonial[]> {
        try {
            const records = await pb.collection('testimonials').getFullList({
                filter: 'status = "approved"',
                sort: '-created',
            });
            return records.map(mapPbToTestimonial);
        } catch (error: any) {
            console.error('Error fetching testimonials:', error);
            return [];
        }
    },

    async getAllAdmin(page: number = 0, pageSize: number = 10): Promise<Testimonial[]> {
        try {
            const resultList = await pb.collection('testimonials').getList(page + 1, pageSize, {
                sort: '-created',
            });
            return resultList.items.map(mapPbToTestimonial);
        } catch (error: any) {
            console.error('Error fetching admin testimonials:', error);
            return [];
        }
    },

    async create(data: Omit<Testimonial, 'id' | 'created_at' | 'updated_at' | 'status'>): Promise<Testimonial> {
        try {
            const record = await pb.collection('testimonials').create({
                ...data,
                status: 'pending'
            });
            return mapPbToTestimonial(record);
        } catch (error: any) {
            console.error('Error creating testimonial:', error);
            throw new Error(error.message || 'Error al enviar testimonio');
        }
    },

    async updateStatus(id: string, status: Testimonial['status']): Promise<void> {
        try {
            await pb.collection('testimonials').update(id, { status });
        } catch (error: any) {
            console.error(`Error updating testimonial status ${id}:`, error);
            throw new Error(error.message || 'Error al actualizar estado del testimonio');
        }
    }
};
