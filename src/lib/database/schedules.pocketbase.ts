import { pb } from '../pocketbase/client';

export interface DeliverySchedule {
    id: string;
    day_of_week: string;
    is_active: boolean;
    start_time: string;
    end_time: string;
}

export const pocketbaseScheduleService = {
    async getAll(): Promise<DeliverySchedule[]> {
        try {
            const records = await pb.collection('delivery_schedules').getFullList({
                sort: 'id', // IDs are usually sorted by creation or we can sort by day if needed
            });
            return records.map(record => ({
                id: record.id,
                day_of_week: record.day_of_week,
                is_active: record.is_active,
                start_time: record.start_time,
                end_time: record.end_time,
            }));
        } catch (error: any) {
            console.error('Error fetching delivery schedules:', error);
            return [];
        }
    },

    async update(data: DeliverySchedule[]): Promise<boolean> {
        try {
            for (const item of data) {
                if (item.id.length > 0) {
                    await pb.collection('delivery_schedules').update(item.id, {
                        day_of_week: item.day_of_week,
                        is_active: item.is_active,
                        start_time: item.start_time,
                        end_time: item.end_time,
                    });
                } else {
                    await pb.collection('delivery_schedules').create({
                        day_of_week: item.day_of_week,
                        is_active: item.is_active,
                        start_time: item.start_time,
                        end_time: item.end_time,
                    });
                }
            }
            return true;
        } catch (error: any) {
            console.error('Error updating delivery schedules:', error);
            return false;
        }
    }
};
