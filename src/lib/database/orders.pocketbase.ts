import { pb } from '../pocketbase/client';
import type { Order, OrderItem, OrderMessage } from './types';

const normalizeStatusToUi = (status: any): Order['status'] => {
    const s = String(status ?? '').toLowerCase();
    const map: Record<string, Order['status']> = {
        pending: 'pendiente',
        pendiente: 'pendiente',
        confirmed: 'confirmado',
        confirmado: 'confirmado',
        processing: 'en_preparacion',
        'en_preparacion': 'en_preparacion',
        preparing: 'en_preparacion',
        ready: 'listo_para_entrega',
        listo_para_entrega: 'listo_para_entrega',
        delivered: 'entregado',
        completed: 'entregado',
        entregado: 'entregado',
        cancelled: 'cancelado',
        cancelado: 'cancelado',
    };
    return (map[s] ?? (status as Order['status']));
};

const mapPbToOrderItem = (record: any): OrderItem => {
    const quantity = Number(record.quantity ?? 0);
    const unitPrice =
        Number(record.unit_price ?? record.unitPrice ?? record.price ?? 0);

    const productTitle =
        record.product_title ??
        record.productTitle ??
        record.expand?.product_id?.title ??
        record.expand?.product?.title ??
        'Producto';

    const totalFromRecord = record.total ?? record.total_amount ?? null;
    const computedTotal = quantity * unitPrice;

    return {
        id: record.id ?? `${record.order_id ?? 'order'}-${record.product_id ?? productTitle}-${record.quantity ?? ''}`,
        order_id: record.order_id ?? record.orderId ?? '',
        product_id: record.product_id ?? record.productId ?? '',
        product_title: productTitle,
        quantity,
        unit_price: unitPrice,
        total: Number(totalFromRecord ?? computedTotal ?? 0),
    };
};

const mapJsonItemsToOrderItems = (items: any): OrderItem[] => {
    if (!Array.isArray(items)) return [];
    return items.map(mapPbToOrderItem);
};

// Fallback: ULID codifica la marca de tiempo en los primeros 10 caracteres (Crockford Base32)
// Esto ayuda cuando PocketBase no devuelve el campo de fecha esperado.
const ulidToIsoString = (id: any): string | null => {
    const ulid = String(id ?? "");
    // PocketBase normalmente usa IDs aleatorios de 15 chars.
    // Solo decodificar como ULID cuando realmente tenga forma ULID (26 chars).
    if (ulid.length !== 26) return null;

    const crockfordBase32: Record<string, number> = {
        '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7,
        '8': 8, '9': 9, 'A': 10, 'B': 11, 'C': 12, 'D': 13, 'E': 14, 'F': 15,
        'G': 16, 'H': 17, 'J': 18, 'K': 19, 'M': 20, 'N': 21, 'P': 22, 'Q': 23,
        'R': 24, 'S': 25, 'T': 26, 'V': 27, 'W': 28, 'X': 29, 'Y': 30, 'Z': 31,
    };

    let time = 0;
    for (let i = 0; i < 10; i++) {
        const ch = ulid[i].toUpperCase();
        const v = crockfordBase32[ch];
        if (v === undefined) return null;
        time = time * 32 + v;
    }

    const date = new Date(time);
    if (Number.isNaN(date.getTime())) return null;
    // Evitar fechas absurdas por decodificaciones incorrectas.
    const year = date.getUTCFullYear();
    if (year < 2000 || year > 2100) return null;
    return date.toISOString();
};

const mapPbToOrder = (record: any, orderItems: OrderItem[] = [], createdFallback?: string | null): Order => {
    const createdAt =
        record.created ??
        record.created_at ??
        record.createdAt ??
        record.created_on ??
        record.createdOn ??
        record.date ??
        record.order_date ??
        record.orderDate ??
        record.ordered_at ??
        record.orderedAt ??
        createdFallback ??
        ulidToIsoString(record.id);

    const updatedAt =
        record.updated ??
        record.updated_at ??
        record.updatedAt ??
        record.updated_on ??
        record.updatedOn ??
        record.updatedAtUtc ??
        ulidToIsoString(record.id);

    // Último recurso: si no viene created en la respuesta, al menos mostramos la fecha de updated.
    const finalCreatedAt = createdAt ?? updatedAt ?? new Date().toISOString();
    const getPhone = () => {
        const v =
            record.contact_phone ??
            record.contactPhone ??
            record.customer_phone ??
            record.customerPhone ??
            record.phone ??
            record.telefono ??
            record.telephone;
        if (v === undefined || v === null) return '';
        return String(v);
    };
    const phone = getPhone();
    const getAddress = () => {
        const v =
            record.customer_address ??
            record.customerAddress ??
            record.shipping_address ??
            record.shippingAddress ??
            record.address ??
            record.direccion ??
            record.delivery_address;
        if (v === undefined || v === null) return null;
        return String(v);
    };
    const customerAddress = getAddress();
    const shippingAddress = record.shipping_address ?? record.shippingAddress ?? customerAddress;

    return {
        id: record.id,
        user_id: record.user_id ?? record.userId ?? null,

        // UI/Admin usan estos nombres
        customer_name: record.customer_name ?? record.customerName ?? 'Cliente',
        contact_name: record.customer_name ?? record.customerName ?? 'Cliente',
        customer_email: record.customer_email ?? record.customerEmail ?? null,
        customer_phone: phone,
        contact_phone: phone,

        // Dirección
        customer_address: customerAddress,
        shipping_address: shippingAddress ?? customerAddress,

        status: normalizeStatusToUi(record.status),
        payment_method: record.payment_method ?? record.paymentMethod ?? 'transferencia',
        payment_status: record.payment_status ?? record.paymentStatus ?? 'pending',

        subtotal: Number(record.subtotal ?? 0),
        delivery_fee: Number(record.delivery_fee ?? record.deliveryFee ?? 0),

        // Totales: la UI usa total_amount
        total: Number(record.total ?? 0),
        total_amount: Number(record.total_amount ?? record.total ?? 0),

        notes: record.notes ?? null,
        created_at: finalCreatedAt,
        updated_at: updatedAt,

        order_items: orderItems,
    } as Order;
};

export const pocketbaseOrderService = {
    async getAll(): Promise<Order[]> {
        try {
            const records = await pb.collection('orders').getFullList({
                sort: '-id',
            });

            // Si el schema guarda items dentro del pedido (campo JSON `items`), lo usamos.
            const baseOrders: Array<{ record: any; itemsFromJson: OrderItem[] }> = records.map((r: any) => {
                const itemsFromJson = mapJsonItemsToOrderItems(r.items);
                return { record: r, itemsFromJson };
            });

            const ordersToFetchItemsFor = baseOrders
                .filter(({ itemsFromJson }) => itemsFromJson.length === 0)
                .map(({ record }) => record.id);

            const itemsByOrderId: Record<string, OrderItem[]> = {};

            if (ordersToFetchItemsFor.length > 0) {
                // Si existe la colección `order_items`, la consultamos por cada pedido.
                await Promise.all(
                    ordersToFetchItemsFor.map(async (orderId) => {
                        try {
                            const itemRecords = await pb.collection('order_items').getFullList({
                                filter: `order_id = "${orderId}"`,
                            });
                            itemsByOrderId[orderId] = itemRecords.map(mapPbToOrderItem);
                        } catch {
                            // Si no existe la colección, dejamos vacío.
                            itemsByOrderId[orderId] = [];
                        }
                    })
                );
            }

            return baseOrders.map(({ record, itemsFromJson }) => {
                const items = itemsFromJson.length > 0 ? itemsFromJson : (itemsByOrderId[record.id] || []);
                const fallbackCreated =
                    (itemsByOrderId[record.id] || [])
                        .map((it: any) => it?.created ?? it?.created_at ?? null)
                        .find((v: any) => !!v) ?? null;
                return mapPbToOrder(record, items, fallbackCreated);
            });
        } catch (error: any) {
            console.error('Error fetching orders:', error);
            return [];
        }
    },

    async getById(id: string): Promise<Order | null> {
        try {
            const record = await pb.collection('orders').getOne(id);

            const itemsFromJson = mapJsonItemsToOrderItems(record?.items);
            if (itemsFromJson.length > 0) {
                return mapPbToOrder(record, itemsFromJson);
            }

            // Fallback: leer desde colección `order_items`
            try {
                const itemRecords = await pb.collection('order_items').getFullList({
                    filter: `order_id = "${id}"`,
                });
                const fallbackCreated =
                    itemRecords
                        .map((it: any) => it?.created ?? it?.created_at ?? null)
                        .find((v: any) => !!v) ?? null;
                return mapPbToOrder(record, itemRecords.map(mapPbToOrderItem), fallbackCreated);
            } catch {
                return mapPbToOrder(record, []);
            }
        } catch (error: any) {
            console.error(`Error fetching order ${id}:`, error);
            return null;
        }
    },

    async create(data: Partial<Order>, items: Partial<OrderItem>[]): Promise<Order | null> {
        try {
            const payload: Record<string, any> = { ...data };

            // Normalizamos para cubrir schemas camelCase vs snake_case
            payload.total = payload.total_amount ?? payload.total ?? payload.totalAmount ?? 0;
            payload.total_amount = payload.total ?? payload.total_amount ?? payload.totalAmount ?? 0;

            payload.customerName = payload.customer_name ?? payload.customerName;
            payload.customerEmail = payload.customer_email ?? payload.customerEmail;
            // Teléfono (guardamos en varios nombres para cubrir esquemas distintos)
            const phoneRaw =
                payload.contact_phone ??
                payload.contactPhone ??
                payload.customer_phone ??
                payload.customerPhone ??
                payload.phone;
            payload.customerPhone = phoneRaw;
            payload.customer_phone = payload.customer_phone ?? phoneRaw;
            payload.contact_phone = payload.contact_phone ?? phoneRaw;
            payload.contactPhone = payload.contactPhone ?? phoneRaw;

            payload.paymentMethod = payload.payment_method ?? payload.paymentMethod;
            payload.paymentStatus = payload.payment_status ?? payload.paymentStatus;

            payload.shippingAddress =
                payload.shipping_address ?? payload.customer_address ?? payload.shippingAddress ?? payload.customerAddress;

            payload.customerAddress =
                payload.customer_address ?? payload.shipping_address ?? payload.customerAddress ?? payload.shippingAddress;

            // Dirección en nombres alternativos
            payload.shipping_address = payload.shipping_address ?? payload.shippingAddress ?? payload.customer_address ?? payload.customerAddress;
            payload.customer_address = payload.customer_address ?? payload.customerAddress ?? payload.shipping_address ?? payload.shippingAddress;

            // Guardar items dentro del pedido si el schema tiene campo JSON `items`
            payload.items = (items || []).map((it: any) => ({
                product_id: it.product_id ?? it.productId,
                product_title: it.product_title ?? it.productTitle,
                unit_price: it.unit_price ?? it.unitPrice,
                quantity: it.quantity,
                total: it.total ?? (Number(it.unit_price ?? it.unitPrice ?? 0) * Number(it.quantity ?? 0)),
            }));

            const orderRecord = await pb.collection('orders').create(payload);

            // Si existe colección `order_items`, también la llenamos para que expand/join funcione.
            try {
                const itemPromises = (items || []).map((item: any) =>
                    pb.collection('order_items').create({
                        product_id: item.product_id ?? item.productId,
                        product_title: item.product_title ?? item.productTitle,
                        unit_price: item.unit_price ?? item.unitPrice,
                        quantity: item.quantity,
                        total: item.total ?? (Number(item.unit_price ?? item.unitPrice ?? 0) * Number(item.quantity ?? 0)),
                        order_id: orderRecord.id,
                    })
                );
                await Promise.all(itemPromises);
            } catch {
                // Si no existe order_items, no pasa nada (items ya vienen en payload.items).
            }

            return this.getById(orderRecord.id);
        } catch (error: any) {
            console.error('Error creating order:', error);
            throw error;
        }
    },

    async createOrderMessage(payload: {
        order_id: string;
        channel: 'whatsapp';
        to_phone?: string | null;
        message_text: string;
        message_status?: 'sent' | 'failed' | null;
    }): Promise<OrderMessage | null> {
        try {
            // Si la colección aún no existe (DB antigua), simplemente no guardamos historial.
            // El pedido y el WhatsApp igual funcionan.
            const record = await pb.collection('order_messages').create({
                order_id: payload.order_id,
                channel: payload.channel,
                to_phone: payload.to_phone ?? '',
                message_text: payload.message_text,
                message_status: payload.message_status ?? 'sent',
            });

            return {
                id: record.id,
                order_id: record.order_id,
                channel: 'whatsapp',
                to_phone: record.to_phone ?? null,
                message_text: record.message_text,
                message_status: record.message_status ?? null,
                created_at: record.created ?? record.created_at ?? record.createdAt,
            };
        } catch (error: any) {
            console.error('Error creating order message (ignored):', error);
            return null;
        }
    },

    async getMessagesByOrderId(orderId: string): Promise<OrderMessage[]> {
        try {
            const records = await pb.collection('order_messages').getFullList({
                sort: '-created',
                filter: `order_id = "${orderId}"`,
            });

            return records.map((r: any) => ({
                id: r.id,
                order_id: r.order_id,
                channel: (r.channel ?? 'whatsapp') as 'whatsapp',
                to_phone: r.to_phone ?? null,
                message_text: r.message_text,
                message_status: r.message_status ?? null,
                created_at: r.created ?? r.created_at ?? r.createdAt,
            }));
        } catch (error: any) {
            console.error('Error fetching order messages (ignored):', error);
            return [];
        }
    },

    async updateStatus(id: string, status: Order['status']): Promise<boolean> {
        try {
            // Convertimos estados UI (es) a estados que podría esperar PocketBase (en).
            const s = String(status ?? '').toLowerCase();
            const map: Record<string, any> = {
                pendiente: 'pending',
                confirmado: 'confirmed',
                en_preparacion: 'processing',
                listo_para_entrega: 'ready',
                entregado: 'completed',
                cancelado: 'cancelled',
                pending: 'pending',
                confirmed: 'confirmed',
                processing: 'processing',
                ready: 'ready',
                completed: 'completed',
                delivered: 'completed',
                cancelled: 'cancelled',
            };
            const dbStatus = map[s] ?? status;
            await pb.collection('orders').update(id, { status: dbStatus });
            return true;
        } catch (error: any) {
            console.error(`Error updating status for order ${id}:`, error);
            return false;
        }
    }
};
