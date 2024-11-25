const CURRENT_DATE = new Date().toISOString().split('T')[0];

const roles = [
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442a',
    name: 'Owner',
  },
  {
    id: 'a21544f3-4332-4912-9134-ae2c4c6b8213',
    name: 'Pegawai',
  },
];

const customers = [
  {
    id: 'c0bb2f49-2c17-43e6-903d-ba200735bd4d',
    name: 'Amy Burns',
    phone: '081288556601',
    createdAt: CURRENT_DATE,
    updatedAt: CURRENT_DATE,
    gender: 'Female',
    poin: 50,
    image_url: '/customers/amy-burns.png',
  },
  {
    id: 'e80fd660-7210-47cd-8b31-4f894c4cd091',
    name: 'Balazs Orban',
    phone: '081298262650',
    createdAt: CURRENT_DATE,
    updatedAt: CURRENT_DATE,
    gender: 'Male',
    poin: 30,
    image_url: '/customers/balazs-orban.png',
  },
  {
    id: 'a8fe1c03-76e8-4e62-86a8-71b613a4d80c',
    name: 'Delba de Oliveira',
    phone: '081288779903',
    createdAt: CURRENT_DATE,
    updatedAt: CURRENT_DATE,
    gender: 'Female',
    poin: 70,
    image_url: '/customers/delba-de-oliveira.png',
  },
  {
    id: '8cc682b1-bad1-4245-944a-310de0be0d33',
    name: 'Emil Kowalski',
    phone: '08321321789',
    createdAt: CURRENT_DATE,
    updatedAt: CURRENT_DATE,
    gender: 'Male',
    poin: 20,
    image_url: '/customers/emil-kowalski.png',
  },
  {
    id: 'af45f8bd-d819-410e-94ca-a33aa0dbeae0',
    name: 'Evil Rabbit',
    phone: '081321321321',
    createdAt: CURRENT_DATE,
    updatedAt: CURRENT_DATE,
    gender: 'Male',
    poin: 100,
    image_url: '/customers/evil-rabbit.png',
  },
  {
    id: '5a5c53cc-8295-436a-ae92-6814c52161f2',
    name: 'Guillermo Rauch',
    phone: '081288554897',
    createdAt: CURRENT_DATE,
    updatedAt: CURRENT_DATE,
    gender: 'Male',
    poin: 40,
    image_url: '/customers/guillermo-rauch.png',
  },
  {
    id: '96d56084-b07e-4a30-8f43-801c3689e312',
    name: 'Hector Simpson',
    phone: '081388556601',
    createdAt: CURRENT_DATE,
    updatedAt: CURRENT_DATE,
    gender: 'Male',
    poin: 60,
    image_url: '/customers/hector-simpson.png',
  },
  {
    id: '8315b6e7-9d2d-48f8-a221-4320092fdd2f',
    name: 'Jared Palmer',
    phone: '081397556601',
    createdAt: CURRENT_DATE,
    updatedAt: CURRENT_DATE,
    gender: 'Male',
    poin: 80,
    image_url: '/customers/jared-palmer.png',
  },
  {
    id: '51e57b76-8696-4046-88d3-78167d75e723',
    name: 'Lee Robinson',
    phone: '081259786601',
    createdAt: CURRENT_DATE,
    updatedAt: CURRENT_DATE,
    gender: 'Male',
    poin: 90,
    image_url: '/customers/lee-robinson.png',
  },
  {
    id: 'd017d980-a226-4157-80b5-83ba2d8c824f',
    name: 'Michael Novotny',
    phone: '081288546101',
    createdAt: CURRENT_DATE,
    updatedAt: CURRENT_DATE,
    gender: 'Male',
    poin: 110,
    image_url: '/customers/michael-novotny.png',
  },
];

const distributors = [
  {
    id: '43893c55-36c4-461e-bea3-f29c05f1af59',
    name: 'PT Sumber Makmur Jaya',
    phone: '08111222333',
    createdAt: CURRENT_DATE,
    updatedAt: CURRENT_DATE,
  },
  {
    id: '946dcd2a-c2af-4bef-8f09-513326334a05',
    name: 'CV Prima Distribusi',
    phone: '08444555666',
    createdAt: CURRENT_DATE,
    updatedAt: CURRENT_DATE,
  },
  {
    id: 'f912183f-9774-40ea-9c3f-07a79c25c8d0',
    name: 'PT Maju Bersama',
    phone: '0844555601',
    createdAt: CURRENT_DATE,
    updatedAt: CURRENT_DATE,
  },
  {
    id: '5718509a-d12e-4169-a438-9440e00bee17',
    name: 'PT Berkah Distribusi',
    phone: '08444555666',
    createdAt: CURRENT_DATE,
    updatedAt: CURRENT_DATE,
  },
  {
    id: 'da848c31-eab7-4446-b8eb-4b1b295cb131',
    name: 'CV Surya Mandiri',
    phone: '081115556667',
    createdAt: CURRENT_DATE,
    updatedAt: CURRENT_DATE,
  },
  {
    id: '46fe089e-2f59-4877-95da-23f0eabafa55',
    name: 'PT Nusantara Food',
    phone: '081114445554',
    createdAt: CURRENT_DATE,
    updatedAt: CURRENT_DATE,
  },
  {
    id: '9888e56b-4734-40bc-befb-f4dd6f1b2b73',
    name: 'PT Jaya Abadi',
    phone: '086644455513',
    createdAt: CURRENT_DATE,
    updatedAt: CURRENT_DATE,
  },
  {
    id: 'd1b72fda-990f-4a71-8a90-4a597d0ba008',
    name: 'CV Sejahtera Distribusi',
    phone: '081444555789',
    createdAt: CURRENT_DATE,
    updatedAt: CURRENT_DATE,
  },
  {
    id: 'f3063e78-c899-4f10-93e5-88aa29b2dddb',
    name: 'PT Makmur Jaya',
    phone: '081478555666',
    createdAt: CURRENT_DATE,
    updatedAt: CURRENT_DATE,
  },
  {
    id: 'abb8f2c4-025e-4ddc-9167-43b07630293a',
    name: 'CV Mitra Sejati',
    phone: '081244455547',
    createdAt: CURRENT_DATE,
    updatedAt: CURRENT_DATE,
  },
];

const pegawai = [
  {
    id: 'c972a1fd-a7fe-4abe-82b1-ef3af5b45d23',
    id_role: roles[0].id,
    name: 'John Smith',
    phone: '081288558801',
    createdAt: CURRENT_DATE,
    updatedAt: CURRENT_DATE,
    gender: 'Male',
    email: 'owner@nextmail.com',
    password: '123456',
  },
  {
    id: '554e03c1-5939-4f83-90ec-a5ecd796a1c8',
    id_role: roles[1].id,
    name: 'Sarah Johnson',
    phone: '081288556602',
    createdAt: CURRENT_DATE,
    updatedAt: CURRENT_DATE,
    gender: 'Female',
    email: 'sarah@nextmail.com',
    password: '234567',
  },
];

const products = [
  {
    id: 'e45f3577-c34d-4b27-b5c3-345ab825445b',
    name: 'Ramen Original Saburo',
    stock: 50,
    price: 30000,
    distributorId: distributors[0].id,
    createdAt: CURRENT_DATE,
    updatedAt: CURRENT_DATE,
    image_url: '/products/ramen.png',
  },
  {
    id: 'a84b6488-4e09-4251-9b2f-784b4584944b',
    name: 'Ramen Spicy Level 1',
    stock: 40,
    price: 32000,
    distributorId: distributors[1].id,
    createdAt: CURRENT_DATE,
    updatedAt: CURRENT_DATE,
    image_url: '/products/ramen.png',
  },
];

const penjualan = [
  {
    id: '3958dc9e-712f-4377-85e9-fec4b6a6442a',
    customerId: 'c0bb2f49-2c17-43e6-903d-ba200735bd4d',
    pegawaiId: 'c972a1fd-a7fe-4abe-82b1-ef3af5b45d23',
    date: '2024-01-01',
    poin_used: 0,
    total_amount: 150000,
    total_bayar: 150000,
  }
];

const penjualan_items = [
  {
    id: '3958dc9e-787f-4377-85e9-fec4b6a6442a',
    penjualan_id: '3958dc9e-712f-4377-85e9-fec4b6a6442a',
    product_id: 'e45f3577-c34d-4b27-b5c3-345ab825445b',
    quantity: 2,
    price_per_item: 50000,
    subtotal: 100000,
  },
  {
    id: '3958dc9e-792f-4377-85e9-fec4b6a6442a',
    penjualan_id: '3958dc9e-712f-4377-85e9-fec4b6a6442a',
    product_id: 'a84b6488-4e09-4251-9b2f-784b4584944b',
    quantity: 1,
    price_per_item: 50000,
    subtotal: 50000,
  }
];

const pembelian = [
  {
    id: '90a3f2dc-a82f-4a18-8f1b-4d3e2eb9a2e4',
    id_pegawai : pegawai[0].name,
    jumlah: 50,
    total: 2000000,
    date: '2023-01-11',
  },
  {
    id: 'e1d4f1ba-f3ac-4b2f-8d58-9e07c3e5c598',
    id_pegawai : pegawai[9].name,
    jumlah: 30,
    total: 1200000,
    date: '2023-02-05',
  },
  {
    id: 'bc6e7fdd-7e52-487d-b8b0-2ecf6d3e8a68',
    id_pegawai : pegawai[8].name,
    jumlah: 40,
    total: 1600000,
    date: '2023-03-12',
  },
  {
    id: '3cfe8271-324d-4ee0-9e09-bce5bf5a9c53',
    id_pegawai : pegawai[7].name,
    jumlah: 25,
    total: 1000000,
  },
  {
    id: '7654fdbc-3a3f-49af-b2b9-5a98f6e6d5e4',
    id_pegawai : pegawai[6].name,
    jumlah: 60,
    total: 2400000,
    date: '2023-05-17',
  },
  {
    id: 'a0b5d7e2-df4b-4cb1-9c97-e567f75f3e02',
    id_pegawai : pegawai[5].name,
    jumlah: 35,
    total: 1400000,
    date: '2023-06-20',
  },
  {
    id: 'b8c3e8a2-0d1f-45c5-9f6e-7a8a2d8e9c37',
    id_pegawai : pegawai[4].name,
    jumlah: 45,
    total: 1800000,
    date: '2023-07-15',
  },
  {
    id: '46edc7e3-9d5f-4af7-b6c8-5e8c4a9d6f84',
    id_pegawai : pegawai[3].name,
    jumlah: 20,
    total: 800000,
    date: '2023-08-18',
  },
  {
    id: 'c4d5e6a7-8f2a-41e7-b9f8-7b2d6a7e8c5b',
    id_pegawai : pegawai[2].name,
    jumlah: 55,
    total: 2200000,
    date: '2023-09-25',
  },
  {
    id: '82e1f3c4-0a6b-42d1-9c5e-7f8b2a4c6e1d',
    id_pegawai : pegawai[1].name,
    jumlah: 50,
    total: 2000000,
    date: '2023-10-10',
  }
]
 
 
const stock = [
  {
    id: 'a3b8e5c7-2d9f-46e1-9f6a-8b2d7c5e9a1f',
    id_produk: products[0].id,
    jumlah: 50,
  },
];

const revenue = [
  { month: 'Jan', revenue: 2000 },
];

module.exports = {
  roles,
  customers,
  distributors,
  pegawai,
  products,
  penjualan,
  penjualan_items,
  pembelian,
  stock,
  revenue,
};