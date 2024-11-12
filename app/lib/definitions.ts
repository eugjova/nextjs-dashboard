// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.

import { string } from "zod";

// However, these types are generated automatically if you're using an ORM such as Prisma.
export type Roles = {
  password(password: string, password1: any): unknown;
  id: string;
  name: string;
};

export type Poin = {
  id: string;
  totalPoints : number,
};

export type Customer = {
  id: string;
  name: string;
  phone : string;
  createdAt : string;
  updatedAt : string;
  gender: string,
  poin : number,
};


export type Distributors = {
  id: string;
  name: string;
  phone : string;
  createdAt : string;
  updatedAt : string;
};

export type Pegawai = {
  id: string;
  id_role : string
  name: string;
  phone : string;
  createdAt : string;
  updatedAt : string;
  gender : string;
  email : string;
  password : string;
};

export type Products = {
  id: string;
  name: string;
  stock: number;
  price: number;
  distributorId : string;
  createdAt : string;
  updatedAt : string;
  image_url: string;
};

export type Penjualan = {
  id: string;
  id_pegawai : string;
  customerId : string;
  id_produk : string;
  jumlah : number;
  total : number;
  poin : number;
  date : string;
};

export type Pembelian = {
  id: string;
  id_pegawai : string;
  jumlah : number;
  total : number;
  date: string;
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type Stock = {
  id : string;
  id_produk : string;
  jumlah : number;
};

export type DetailTransaksiPenjualan = {
  id: string;
  id_penjualan: string;
  id_produk: string;
  id_jumlah : string;
  id_harga : number;
  date : string;
};

export type DetailTransaksiPembelian = {
  id: string;
  id_pembelian: string;
  distributorId: string;
  id_jumlah : string;
  id_total_biaya_transaksi : number;
  date : string;
};

export type LatestPenjualan = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestPenjualanRaw = Omit<LatestPenjualan, 'amount'> & {
  amount: number;
};

export type LatestCustomer = {
  id: string;
  name: string;
  phone: string;
  image_url: string;
};


export type PenjualanTable = {
  id: string;
  id_pegawai : string;
  customerId : string;
  id_produk : string;
  jumlah : number;
  total : number;
  poin : number;
  date : string;
};

export type CustomersTableType = {
  id: string;
  name: string;
  phone: string;
  image_url: string;
  gender : string;
  poin : string;
};

export type PegawaiTableType = {
  id: string;
  name: string;
  phone: string;
  gender : string;
  email : string;
  password : string;
};

export type DistributorTableType = {
  id: string;
  name: string;
  phone: string;
};

export type PoinTableType = {
  id: string;
  totalPoints : number;
};

export type ProductsTableType = {
  id: string;
  name: string;
  stock: number;
  image_url: string;
  price: number;
};


export type FormattedCustomersTable = {
  id: string;
  name: string;
  phone: string;
  image_url: string;
};


export type CustomerField = {
  id: string;
  name: string;
  phone: string;
  gender : string
};


export type DistributorField = {
  id: string;
  name: string;
  phone: string;
};

export type ProductsField = {
  id: string;
  name: string;
  price: number;
  stock: number;
};

export type PegawaiField = {
  id: string;
  name: string;
  phone : string;
  gender : string;
  email : string;
  password : string;
};


export type PenjualanForm = {
  id: string;
  customer_id: string;
  product_id: string;
  id_pegawai : string;
  total: number;
};

export type PembelianForm = {
  id: string;
  id_pegawai : string;
};

export type ProductForm = {
  id: string;
  name: string;
  stock: number;
  price: number;
  image_url: string;
};

export type CustomersForm = {
  id: string;
  name: string;
  phone: string;
  gender : string;
  poin : string;
  image_url: string;
};

export type PegawaiForm = {
  id: string;
  name: string;
  phone: string;
  gender : string;
  email : string;
  password : string;
};

export type DistributorForm = {
  id: string;
  name: string;
  phone: string;
};


export type CustomersTable = {
  id: string;
  name: string;
  phone: string;
  createdAt : string;
  updatedAt : string;
  gender : string;
  image_url : string;
};

export type DistributorsTable = {
  id: string;
  name: string;
  phone: string;
  createdAt : string;
  updatedAt : string;
  image_url : string;
};

export type ProductsTable = {
  id: string;
  name: string;
  stock: number;
  price: number;
  distributorId : string;
  createdAt : string;
  updatedAt : string;
  image_url : string;
};

