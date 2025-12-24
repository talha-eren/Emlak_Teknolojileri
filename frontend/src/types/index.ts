export interface User {
  id: number;
  email: string;
  full_name: string;
  franchise_id?: number;
  is_active: boolean;
  is_superuser: boolean;
  created_at: string;
  franchise?: Franchise;
}

export interface Franchise {
  id: number;
  name: string;
  tax_number: string;
  phone?: string;
  email?: string;
  address?: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
  branches?: Branch[];
}

export interface Branch {
  id: number;
  franchise_id: number;
  name: string;
  city: string;
  phone?: string;
  email?: string;
  address?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface DashboardStats {
  total_franchises: number;
  total_branches: number;
  total_sales: number;
  pending_requests: number;
}


