export type CustomerField = {
  id: string;
  name: string;
  phone: string;
  gender: string;
  poin: number;
  image_url: string;
};

export type CustomersTableType = {
  id: string;
  name: string;
  phone: string;
  gender: string;
  poin: number;
  image_url: string;
};

export type ProductsField = {
  id: string;
  name: string;
  stock: number;
  price: number;
  distributorId: string;
  image_url: string;
};

export type ProductsTable = {
  id: string;
  name: string;
  stock: number;
  price: number;
  image_url: string;
};

export type ProductsTableType = {
  id: string;
  name: string;
  stock: number;
  price: number;
  image_url: string;
};

export type PegawaiField = {
  id: string;
  name: string;
  phone: string;
  gender: string;
  email: string;
  password: string;
};

export type Pegawai = {
  id: string;
  name: string;
  email: string;
  password: string;
  created_at?: Date;
  updated_at?: Date;
};

export type PegawaiTableType = {
  id: string;
  name: string;
  phone: string;
  gender: string;
  email: string;
  password: string;
  role_name: string;
};

export interface PegawaiForm {
  id: string;
  name: string;
  phone: string;
  gender: string;
  email: string;
  password: string;
  role_name: string;
}

export type DistributorField = {
  id: string;
  name: string;
  phone: string;
};

export type PenjualanTable = {
  id: string;
  date: string;
  nama_customer: string;
  nama_pegawai: string;
  total_items: number;
  total_amount: number;
  total_bayar: number;
  poin_used: number;
};

export type PenjualanForm = {
  id: string;
  date: string;
  customerId: string;
  pegawaiId: string;
  total_amount: number;
  total_bayar: number;
  poin_used: number;
  customer_name?: string;
  pegawai_name?: string;
};

export type Roles = {
  id: string;
  name: string;
};

declare module 'next-auth' {
  interface User {
    role_name: string;
  }
  
  interface Session {
    user: User;
  }
}