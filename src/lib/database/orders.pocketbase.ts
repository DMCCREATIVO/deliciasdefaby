import { pb } from '../pocketbase/client';
import type { Order, OrderItem } from './types';

const mapPbToOrderItem = (record: any): OrderItem => ({
    id: record.id,
    order_id: record.order_id,
    product_id: record.product_id,
    product_title: record.expand?.product_id?.title || 'Producto',
    quantity: record.quantity,
    unit_price: record.unit_price,
    total: record.quantity * record.unit_price || 0,
});

const mapPbToOrder = (record: any): Order => ({
    id: record.id,
    user_id: record.user_id || null,
    customer_name: record.customer_name || 'Cliente',
    contact_name: record.customer_name || 'Cliente',
    customer_email: record.customer_email || null,
    customer_phone: record.customer_phone || '',
    customer_address: record.customer_address || null,
    status: record.status as Order['status'],
    payment_method: record.payment_method || 'transferencia',
    payment_status: record.payment_status as Order['payment_status'],
    subtotal: record.subtotal || 0,
    delivery_fee: record.delivery_fee || 0,
    total: record.total || 0,
    total_amount: record.total || 0,
    notes: record.notes || null,
    created_at: record.created,
    updated_at: record.updated,
    order_items: record.expand?.['order_items(order_id)']?.map(mapPbToOrderItem) || [],
});

export const pocketbaseOrderService = {
    async getAll(): Promise<Order[]> {
        try {
            const records = await pb.collection('orders').getFullList({
                sort: '-created',
                // expand: 'order_items(order_id).product_id', (Sintaxis antigua bloqueando página de Estadísticas)
            });
            return records.map(mapPbToOrder);
        } catch (error: any) {
            console.error('Error fetching orders:', error);
            return [];
        }
    },

    async getById(id: string): Promise<Order | null> {
        try {
            const record = await pb.collection('orders').getOne(id, {
                // expand: 'order_items(order_id).product_id',
            });
            return mapPbToOrder(record);
        } catch (error: any) {
            console.error(`Error fetching order ${id}:`, error);
            return null;
        }
    },

    async create(data: Partial<Order>, items: Partial<OrderItem>[]): Promise<Order | null> {
        try {
            const orderRecord = await pb.collection('orders').create(data);

            // Create items
            const itemPromises = items.map(item =>
                pb.collection('order_items').create({
                    ...item,
                    order_id: orderRecord.id,
                })
            );
            await Promise.all(itemPromises);

            return this.getById(orderRecord.id);
        } catch (error: any) {
            console.error('Error creating order:', error);
            throw error;
        }
    },

    async updateStatus(id: string, status: Order['status']): Promise<boolean> {
        try {
            await pb.collection('orders').update(id, { status });
            return true;
        } catch (error: any) {
            console.error(`Error updating status for order ${id}:`, error);
            return false;
        }
    }
};
