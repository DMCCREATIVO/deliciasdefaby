export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  weight: string;
  image_url: string;
  category_id: string;
  stock: number;
  is_active: boolean;
  created_at: string;
}

export interface ProductFormData {
  title: string;
  description: string;
  price: number;
  weight: string;
  category_id: string;
  stock: number;
  image_url: string;
  is_active: boolean;
}

export interface Category {
  id: string;
  name: string;
}