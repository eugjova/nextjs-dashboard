import {neon} from '@neondatabase/serverless';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

import { 
  roles, 
  customers, 
  distributors, 
  pegawai, 
  revenue, 
  products, 
  penjualan, 
  pembelian, 
  stock, 
  DetailTransaksiPenjualan, 
  DetailTransaksiPembelian 
} from '../app/lib/placeholder-data.js';

// Inisialisasi dotenv untuk membaca file .env
dotenv.config();

// Inisialisasi koneksi SQL dari Neon
const sql = neon(process.env.DATABASE_URL);

// Helper untuk memformat tanggal
const formatDate = (date) => date.toISOString().split('T')[0];

// Seeder for roles table
async function seedRoles(sql) {
  try {
    await sql`DROP TABLE IF EXISTS roles`;
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    await sql`
      CREATE TABLE IF NOT EXISTS roles (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      );
    `;

    console.log(`Created "roles" table`);

    await Promise.all(
      roles.map((role) =>
        sql`
        INSERT INTO roles (id, name)
        VALUES (${role.id}, ${role.name})
        ON CONFLICT (id) DO NOTHING;
      `
      )
    );

    console.log(`Seeded ${roles.length} roles`);
  } catch (error) {
    console.error('Error seeding roles:', error);
    throw error;
  }
}

// Seeder for customers table
async function seedCustomers(sql) {
  try {
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    await sql`
      CREATE TABLE IF NOT EXISTS customers (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(255) NOT NULL,
        createdAt DATE DEFAULT CURRENT_DATE,
        updatedAt DATE DEFAULT CURRENT_DATE,
        gender VARCHAR(255) NOT NULL,
        poin INT NOT NULL,
        image_url VARCHAR(255) NOT NULL
      );
    `;

    console.log(`Created "customers" table`);

    const currentDate = formatDate(new Date());

    await Promise.all(
      customers.map((customer) =>
        sql`
        INSERT INTO customers (id, name, phone, createdAt, updatedAt, gender, poin, image_url)
        VALUES (${customer.id}, ${customer.name}, ${customer.phone}, ${currentDate}, ${currentDate}, ${customer.gender}, ${customer.poin}, ${customer.image_url})
        ON CONFLICT (id) DO NOTHING;
      `
      )
    );

    console.log(`Seeded ${customers.length} customers`);
  } catch (error) {
    console.error('Error seeding customers:', error);
    throw error;
  }
}

// Seeder for pegawai table
async function seedPegawai(sql) {
  try {
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    await sql`
      CREATE TABLE IF NOT EXISTS pegawai (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        id_role UUID NOT NULL,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(255) NOT NULL,
        createdAt DATE NOT NULL,
        updatedAt DATE NOT NULL,
        gender VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `;

    console.log(`Created "pegawai" table`);

    await Promise.all(
      pegawai.map(async (pegawai) => {
        if (!pegawai.email) {
          throw new Error(`Missing email for pegawai with ID: ${pegawai.id}`);
        }
        const hashedPassword = await bcrypt.hash(pegawai.password, 10);
        return sql`
          INSERT INTO pegawai (id, id_role, name, phone, createdAt, updatedAt, gender, email, password)
          VALUES (${pegawai.id}, ${pegawai.id_role}, ${pegawai.name}, ${pegawai.phone}, ${pegawai.createdAt}, ${pegawai.updatedAt}, ${pegawai.gender}, ${pegawai.email}, ${hashedPassword})
          ON CONFLICT (id) DO NOTHING;
        `;
      })
    );

    console.log(`Seeded ${pegawai.length} pegawai`);
  } catch (error) {
    console.error('Error seeding pegawai:', error);
    throw error;
  }
}

async function seedProducts(sql) {
  try {
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        stock INT NOT NULL,
        price INT NOT NULL,
        distributorId UUID NOT NULL,
        createdAt DATE NOT NULL,
        updatedAt DATE NOT NULL,
        image_url VARCHAR(255) NOT NULL
      );
    `;

    console.log(`Created "products" table`);

    await Promise.all(
      products.map((product) =>
        sql`
        INSERT INTO products (id, name, stock, price, distributorId, createdAt, updatedAt, image_url)
        VALUES (${product.id}, ${product.name}, ${product.stock}, ${product.price}, ${product.distributorId}, ${product.createdAt}, ${product.updatedAt}, ${product.image_url})
        ON CONFLICT (id) DO NOTHING;
      `
      )
    );

    console.log(`Seeded ${products.length} products`);
  } catch (error) {
    console.error('Error seeding products:', error);
    throw error;
  }
}

async function seedPenjualan(sql) {
  try {
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    await sql`
      CREATE TABLE IF NOT EXISTS penjualan (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        id_pegawai UUID NOT NULL,
        customerId UUID NOT NULL,
        id_produk UUID NOT NULL,
        jumlah INT NOT NULL,
        total INT NOT NULL,
        date DATE NOT NULL
      );
    `;

    console.log(`Created "penjualan" table`);

    await Promise.all(
      penjualan.map((sale) =>
        sql`
        INSERT INTO penjualan (id, id_pegawai, customerId, id_produk, jumlah, total, date)
        VALUES (${sale.id}, ${sale.id_pegawai}, ${sale.customerId}, ${sale.id_produk}, ${sale.jumlah}, ${sale.total}, ${sale.date})
        ON CONFLICT (id) DO NOTHING;
      `
      )
    );

    console.log(`Seeded ${penjualan.length} penjualan`);
  } catch (error) {
    console.error('Error seeding penjualan:', error);
    throw error;
  }
}

async function seedPembelian(sql) {
  try {
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    await sql`
      CREATE TABLE IF NOT EXISTS pembelian (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        jumlah INT NOT NULL,
        total INT NOT NULL,
        date DATE NOT NULL
      );
    `;

    console.log(`Created "pembelian" table`);

    await Promise.all(
      pembelian.map((purchase) =>
        sql`
        INSERT INTO pembelian (id, jumlah, total, date)
        VALUES (${purchase.id}, ${purchase.jumlah}, ${purchase.total}, ${purchase.date})
        ON CONFLICT (id) DO NOTHING;
      `
      )
    );

    console.log(`Seeded ${pembelian.length} pembelian`);
  } catch (error) {
    console.error('Error seeding pembelian:', error);
    throw error;
  }
}

async function seedStock(sql) {
  try {
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    await sql`
      CREATE TABLE IF NOT EXISTS stock (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        id_produk UUID NOT NULL,
        jumlah INT NOT NULL
      );
    `;

    console.log(`Created "stock" table`);

    await Promise.all(
      stock.map((item) =>
        sql`
        INSERT INTO stock (id, id_produk, jumlah)
        VALUES (${item.id}, ${item.id_produk}, ${item.jumlah})
        ON CONFLICT (id) DO NOTHING;
      `
      )
    );

    console.log(`Seeded ${stock.length} stock items`);
  } catch (error) {
    console.error('Error seeding stock:', error);
    throw error;
  }
}

async function seedDetailTransaksiPembelian(sql) {
  try {
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    await sql`
      CREATE TABLE IF NOT EXISTS DetailTransaksiPembelian (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        id_pembelian UUID NOT NULL,
        distributorId UUID NOT NULL,
        id_jumlah UUID NOT NULL,
        id_total_biaya_transaksi UUID NOT NULL,
        date DATE NOT NULL
      );
    `;

    console.log(`Created "DetailTransaksiPembelian" table`);

    await Promise.all(
      DetailTransaksiPembelian.map((detail) =>
        sql`
        INSERT INTO DetailTransaksiPembelian (id, id_pembelian, distributorId, id_jumlah, id_total_biaya_transaksi, date)
        VALUES (${detail.id}, ${detail.id_pembelian}, ${detail.distributorId}, ${detail.id_jumlah}, ${detail.id_total_biaya_transaksi}, ${detail.date})
        ON CONFLICT (id) DO NOTHING;
      `
      )
    );

    console.log(`Seeded ${DetailTransaksiPembelian.length} DetailTransaksiPembelian items`);
  } catch (error) {
    console.error('Error seeding DetailTransaksiPembelian:', error);
    throw error;
  }
}

async function seedDetailTransaksiPenjualan(sql) {
  try {
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    await sql`
      CREATE TABLE IF NOT EXISTS DetailTransaksiPenjualan (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        id_penjualan UUID NOT NULL,
        id_produk UUID NOT NULL,
        id_jumlah UUID NOT NULL,
        id_harga UUID NOT NULL,
        date DATE NOT NULL
      );
    `;

    console.log(`Created "DetailTransaksiPenjualan" table`);

    await Promise.all(
      DetailTransaksiPenjualan.map((detail) =>
        sql`
        INSERT INTO DetailTransaksiPenjualan (id, id_penjualan, id_produk, id_jumlah, id_harga, date)
        VALUES (${detail.id}, ${detail.id_penjualan}, ${detail.id_produk}, ${detail.id_jumlah}, ${detail.id_harga}, ${detail.date})
        ON CONFLICT (id) DO NOTHING;
      `
      )
    );

    console.log(`Seeded ${DetailTransaksiPenjualan.length} DetailTransaksiPenjualan items`);
  } catch (error) {
    console.error('Error seeding DetailTransaksiPenjualan:', error);
    throw error;
  }
}

async function seedRevenue(sql) {
  try {
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    await sql`
      CREATE TABLE IF NOT EXISTS revenue (
        month VARCHAR(7) NOT NULL UNIQUE, -- Format: YYYY-MM
        revenue INT NOT NULL
      );
    `;

    console.log(`Created "revenue" table`);

    await Promise.all(
      revenue.map((rev) =>
        sql`
        INSERT INTO revenue (month, revenue)
        VALUES (${rev.month}, ${rev.revenue})
        ON CONFLICT (month) DO NOTHING;
      `
      )
    );

    console.log(`Seeded ${revenue.length} revenue records`);
  } catch (error) {
    console.error('Error seeding revenue:', error);
    throw error;
  }
}


async function main() {
  try {
    // Seed all data
    await seedRoles(sql);
    await seedCustomers(sql);
    await seedPegawai(sql);
    await seedProducts(sql);
    await seedPenjualan(sql);
    await seedPembelian(sql);
    await seedStock(sql);
    await seedDetailTransaksiPembelian(sql);
    await seedDetailTransaksiPenjualan(sql);
    await seedRevenue(sql);

    console.log('All seeding completed successfully!');
  } catch (err) {
    console.error('An error occurred while seeding the database:', err);
  }
}

main();
