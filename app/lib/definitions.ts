export type PenjualanTable = {
  id: string;
  date: string;
  nama_produk: string;
  nama_customer: string;
  nama_pegawai: string;
  jumlah: number;
  total: number;
  total_bayar: number;
  poin: number;
};

export type DetailTransaksiPenjualanTable = {
  id: string;
  id_penjualan: string;
  id_produk: string;
  jumlah: number;
  harga: number;
  date: string;
};

export type DetailTransaksiPembelianTable = {
  id: string;
  id_pembelian: string;
  distributorId: string;
  jumlah: number;
  total_biaya_transaksi: number;
  date: string;
};

export type CustomerField = {
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

export type PegawaiField = {
  id: string;
  name: string;
  phone: string;
  gender: string;
  email: string;
  password: string;
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type CustomersTableType = {
  id: string;
  name: string;
  phone: string;
  gender: string;
  poin: number;
  image_url: string;
};

export type CustomersForm = {
  id: string;
  name: string;
  phone: string;
  gender: string;
  poin: number;
  image_url: string;
};

export type LatestCustomer = {
  id: string;
  name: string;
  phone: string;
  gender: string;
  poin: number;
  createdAt: string;
  updatedAt: string;
};

export type PenjualanForm = {
  id: string;
  date: string;
  id_produk: string;
  customerId: string;
  id_pegawai: string;
  jumlah: number;
  total: number;
  poin: number;
};

export type LatestPenjualanRaw = {
  id: string;
  amount: number;
  name: string;
  email: string;
  image_url: string;
};

export type Roles = {
  id: string;
  name: string;
};

export type ProductsTable = {
  id: string;
  name: string;
  stock: number;
  price: number;
  image_url: string;
};

export type ProductForm = {
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

export type DistributorField = {
  id: string;
  name: string;
  phone: string;
};

export type DistributorTableType = {
  id: string;
  name: string;
  phone: string;
};

export type DistributorForm = {
  id: string;
  name: string;
  phone: string;
};

export type Pegawai = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type PegawaiTableType = {
  id: string;
  name: string;
  phone: string;
  gender: string;
  email: string;
  password: string;
};

export type PegawaiForm = {
  id: string;
  name: string;
  phone: string;
  gender: string;
  email: string;
  password: string;
};

