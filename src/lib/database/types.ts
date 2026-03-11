// Tipos comunes para la capa de abstracción de base de datos
export interface Product {
    id: string;
    title: string;
    description: string | null;
    short_description: string | null;
    price: number;
    compare_at_price: number | null;
    weight: string | null;
    stock: number;
    category_id: string | null;
    image_url: string | null;
    images: string[] | null;
    is_active: boolean;
    is_featured: boolean;
    slug?: string;
    available_days: string[] | null;
    created_at: string;
    updated_at: string;
    categories?: Category;
}

export interface Category {
    id: string;
    name: string;
    description: string | null;
    image: string | null;
    is_active: boolean;
    sort_order: number;
    slug: string;
    created_at: string;
    updated_at: string;
}

export interface Order {
    id: string;
    user_id: string | null;
    customer_name: string;
    contact_name?: string; // Alias for dashboard
    customer_email: string | null;
    customer_phone: string;
    customer_address: string | null;
    status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled' | 'pendiente' | 'entregado';
    payment_method: string;
    payment_status: 'pending' | 'paid' | 'failed';
    subtotal: number;
    delivery_fee: number;
    total: number;
    total_amount?: number; // Alias for Orders page
    notes: string | null;
    created_at: string;
    updated_at: string;
    order_items?: OrderItem[];
}

export interface OrderItem {
    id: string;
    order_id: string;
    product_id: string;
    product_title: string;
    quantity: number;
    unit_price: number;
    total: number;
}

export interface User {
    id: string;
    email: string;
    name: string | null;
    full_name?: string | null; // Alias for Clientes page
    phone: string | null;
    address: string | null;
    role: 'customer' | 'admin' | 'superadmin';
    created_at: string;
}

// Definición de interfaces para los servicios
export interface ProductService {
    getAll(): Promise<Product[]>;          // Solo activos (catálogo público)
    getAllAdmin(): Promise<Product[]>;      // Todos (admin panel)
    getById(id: string): Promise<Product | null>;
    create(data: Partial<Product>): Promise<Product>;
    update(id: string, data: Partial<Product>): Promise<Product>;
    delete(id: string): Promise<void>;
    hardDelete(id: string): Promise<void>;
    uploadImage(file: File): Promise<string>;
}

export interface CategoryService {
    getAll(): Promise<Category[]>;
    getById(id: string): Promise<Category | null>;
    create(data: Partial<Category>): Promise<Category>;
    update(id: string, data: Partial<Category>): Promise<Category>;
    delete(id: string): Promise<void>;
}

export interface OrderService {
    getAll(): Promise<Order[]>;
    getByUser(userId: string): Promise<Order[]>;
    getById(id: string): Promise<Order | null>;
    create(data: Partial<Order>, items: Partial<OrderItem>[]): Promise<Order>;
    updateStatus(id: string, status: Order['status']): Promise<Order>;
}

export interface AuthService {
    login(email: string, password: string): Promise<User>;
    register(email: string, password: string, name?: string): Promise<User>;
    logout(): Promise<void>;
    getCurrentUser(): User | null;
    isAdmin(): boolean;
}

export interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    image_url: string | null;
    created_at: string;
    slug: string;
    is_published: boolean;
    featured: boolean;
    author_id: string | null;
}

export interface Testimonial {
    id: string;
    name: string;
    comment: string;
    rating: number;
    avatar?: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    updated_at: string;
}

export interface TestimonialService {
    getAll(): Promise<Testimonial[]>;
    getAllAdmin(page?: number, pageSize?: number): Promise<Testimonial[]>;
    create(data: Omit<Testimonial, 'id' | 'created_at' | 'updated_at' | 'status'>): Promise<Testimonial>;
    updateStatus(id: string, status: Testimonial['status']): Promise<void>;
}
