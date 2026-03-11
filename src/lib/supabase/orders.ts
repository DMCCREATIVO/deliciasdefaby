import { supabase } from "@/integrations/supabase/client";
import type { Database } from '../database.types';

export type Order = Database['public']['Tables']['orders']['Row'] & {
  order_items?: Array<OrderItem & {
    product?: {
      id: string;
      title: string;
      image_url: string | null;
    }
  }>
};

export type OrderItem = Database['public']['Tables']['order_items']['Row'];

export type CreateOrderData = {
  contact_name: string;
  contact_email: string;
  contact_phone?: string;
  shipping_address?: string;
  notes?: string;
  status?: Order['status'];
  total: number;
  user_id?: string;
  items: Array<{
    product_id: string;
    quantity: number;
    price: number;
  }>;
};

export type UpdateOrderData = Partial<CreateOrderData>;

export const orderService = {
  async getAll() {
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (ordersError) throw ordersError;

    if (orders && orders.length > 0) {
      const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .select(`
          *,
          product:products (
            id,
            title,
            image_url
          )
        `)
        .in('order_id', orders.map(order => order.id));

      if (itemsError) throw itemsError;

      return orders.map(order => ({
        ...order,
        order_items: items?.filter(item => item.order_id === order.id) || []
      }));
    }

    return orders;
  },

  async getById(id: string) {
    if (!id) throw new Error('ID es requerido');

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (orderError) throw orderError;

    if (order) {
      const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .select(`
          *,
          product:products (
            id,
            title,
            image_url
          )
        `)
        .eq('order_id', order.id);

      if (itemsError) throw itemsError;

      return {
        ...order,
        order_items: items || []
      };
    }

    return order;
  },

  async create(orderData: CreateOrderData) {
    const { items, ...orderDetails } = orderData;
    
    // Crear el pedido
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        ...orderDetails,
        total: orderDetails.total,
        status: orderDetails.status || 'pendiente'
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Preparar items
    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price
    }));

    // Insertar items
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      // Si falla la inserción de items, eliminar el pedido
      await supabase
        .from('orders')
        .delete()
        .eq('id', order.id);
      throw itemsError;
    }

    return this.getById(order.id);
  },

  async update(id: string, orderData: UpdateOrderData) {
    if (!id) throw new Error('ID es requerido');

    const { items, ...orderDetails } = orderData;
    
    // Actualizar detalles del pedido
    const { error: orderError } = await supabase
      .from('orders')
      .update(orderDetails)
      .eq('id', id);

    if (orderError) throw orderError;

    // Si hay items para actualizar
    if (items?.length) {
      // Eliminar items existentes
      const { error: deleteError } = await supabase
        .from('order_items')
        .delete()
        .eq('order_id', id);

      if (deleteError) throw deleteError;

      // Insertar nuevos items
      const orderItems = items.map(item => ({
        order_id: id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;
    }

    return this.getById(id);
  },

  async delete(id: string) {
    if (!id) throw new Error('ID es requerido');

    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async updateStatus(id: string, status: Order['status']) {
    if (!id) throw new Error('ID es requerido');

    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
  },

  async getByUserId(userId: string) {
    if (!userId) throw new Error('ID de usuario es requerido');

    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (ordersError) throw ordersError;

    if (orders && orders.length > 0) {
      const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .select(`
          *,
          product:products (
            id,
            title,
            image_url
          )
        `)
        .in('order_id', orders.map(order => order.id));

      if (itemsError) throw itemsError;

      return orders.map(order => ({
        ...order,
        order_items: items?.filter(item => item.order_id === order.id) || []
      }));
    }

    return orders;
  }
};

interface CreateGuestOrderData {
  items: Array<{
    product_id: string;
    title: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
  total: number;
  status: string;
  shipping_address: string;
  contact_phone: string;
  notes: string;
  customer_name: string;
  customer_email: string;
  payment_method?: string;
  payment_status?: string;
}

export const createGuestOrder = async (orderData: CreateGuestOrderData) => {
  try {
    console.log('💾 Creando pedido de invitado...');
    console.log('🔑 Cliente Supabase configurado:', {
      url: supabase.supabaseUrl,
      key: supabase.supabaseKey?.substring(0, 20) + '...',
      auth: supabase.auth.getSession()
    });
    
    // Preparar datos del pedido sin los items
    const orderDetails = {
      user_id: null,
      contact_name: orderData.customer_name,
      contact_email: orderData.customer_email,
      contact_phone: orderData.contact_phone,
      shipping_address: orderData.shipping_address,
      notes: orderData.notes,
      status: orderData.status,
      total: orderData.total,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('📋 Datos del pedido a insertar:', orderDetails);

    // Verificar el estado de autenticación actual
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    console.log('🔐 Estado de sesión actual:', {
      session: sessionData.session ? 'Autenticado' : 'Anónimo',
      user: sessionData.session?.user?.id || 'Sin usuario',
      error: sessionError
    });

    // Crear el pedido principal
    console.log('📝 Insertando pedido en la base de datos...');
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(orderDetails)
      .select('*')
      .single();

    if (orderError) {
      console.error('❌ Error al crear pedido:', orderError);
      console.error('📋 Detalles del error:', {
        message: orderError.message,
        details: orderError.details,
        hint: orderError.hint,
        code: orderError.code
      });
      throw new Error(`Error al crear el pedido: ${orderError.message}`);
    }

    console.log('✅ Pedido creado exitosamente:', order);

    // Crear los items del pedido
    if (orderData.items && orderData.items.length > 0) {
      console.log('📦 Insertando items del pedido...');
      const orderItems = orderData.items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price
      }));

      console.log('📋 Items a insertar:', orderItems);

      const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)
        .select('*');

      if (itemsError) {
        console.error('❌ Error al crear items del pedido:', itemsError);
        console.error('📋 Detalles del error de items:', {
          message: itemsError.message,
          details: itemsError.details,
          hint: itemsError.hint,
          code: itemsError.code
        });
        
        // Si falla la inserción de items, intentar eliminar el pedido creado
        console.log('🗑️ Intentando limpiar pedido creado...');
        await supabase.from('orders').delete().eq('id', order.id);
        
        throw new Error(`Error al crear los items del pedido: ${itemsError.message}`);
      }

      console.log('✅ Items del pedido creados exitosamente:', items);
      
      return {
        ...order,
        items: items
      };
    }

    return order;

  } catch (error: any) {
    console.error('💥 Error al crear pedido:', error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error al actualizar estado del pedido:', error);
    return { success: false, error };
  }
};

export const getOrderById = async (orderId: string) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error al obtener pedido:', error);
    return { success: false, error };
  }
}; 