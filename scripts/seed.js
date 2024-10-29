const { db } = require('@vercel/postgres');
const formatDate = (date) => date.toISOString().split('T')[0];
const {
  roles,
  customers,
  distributors,
  pegawai,
  revenue,
  products,
  penjualan,
  pembelian,
  poin,
  stock,
  DetailTransaksi,
} = require('../app/lib/placeholder-data.js');
const bcrypt = require('bcrypt');
const { date } = require('zod');
 
async function seedRoles(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "users" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS roles (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `;
 
    console.log(`Created "roles" table`);
 
    // Insert data into the "users" table
    const insertedRoles = await Promise.all(
      roles.map(async (roles) => {
        const hashedPassword = await bcrypt.hash(roles.password, 10);
        return client.sql`
        INSERT INTO roles (id, name, email, password)
        VALUES (${roles.id}, ${roles.name}, ${roles.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
      }),
    );
 
    console.log(`Seeded ${insertedRoles.length} roles`);
 
    return {
      createTable,
      roles : insertedRoles,
    };
  } catch (error) {
    console.error('Error seeding : roles', error);
    throw error;
  }
}
 
async function seedCustomers(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
 
    // Create the "customers" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS customers (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(255) NOT NULL,
        createdAt DATE DEFAULT CURRENT_DATE,
        updatedAt DATE DEFAULT CURRENT_DATE,
        gender VARCHAR(255) NOT NULL
      );
    `;
 
    console.log(`Created "customers" table`);
 
    const currentDate = formatDate(new (Date))
 
    // Insert data into the "customers" table
    const insertedCustomers = await Promise.all(
      customers.map(
        (customer) => client.sql`
        INSERT INTO customers (id, name, phone, createdAt, updatedAt, gender)
        VALUES (${customer.id}, ${customer.name}, ${customer.phone}, ${currentDate}, ${currentDate},  ${customer.gender})
        ON CONFLICT (id) DO NOTHING;
     
      `,
      ),
    );
 
    console.log(`Seeded ${insertedCustomers.length} customers`);
 
    return {
      createTable,
      customers: insertedCustomers,
    };
  } catch (error) {
    console.error('Error seeding : customers', error);
    throw error;
  }
}
 
async function seedPegawai(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
 
    // Create the "customers" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS pegawai (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        id_role UUID NOT NULL,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(255) NOT NULL,
        createdAt DATE NOT NULL,
        updatedAt DATE NOT NULL,
        gender VARCHAR(255) NOT NULL
      );
    `;
 
    console.log(`Created "pegawai" table`);
 
    // Insert data into the "customers" table
    const insertedPegawai = await Promise.all(
      pegawai.map(
        (pegawai) => client.sql`
        INSERT INTO pegawai (id, id_role, name, phone, createdAt, updatedAt, gender)
        VALUES (${pegawai.id},${pegawai.id_role}, ${pegawai.name}, ${pegawai.phone}, ${pegawai.createdAt}, ${pegawai.updatedAt}, ${pegawai.gender})
        ON CONFLICT (id) DO NOTHING;
      `,
      ),
    );
 
    console.log(`Seeded ${insertedPegawai.length} pegawai`);
 
    return {
      createTable,
      pegawai : insertedPegawai,
    };
  } catch (error) {
    console.error('Error seeding : pegawai', error);
    throw error;
  }
}
 
async function seedDistributors(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
 
    // Create the "customers" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS distributors (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(255) NOT NULL,
        createdAt DATE NOT NULL,
        updatedAt DATE NOT NULL
      );
    `;
 
    console.log(`Created "distributors" table`);
 
    // Insert data into the "customers" table
    const insertedDistributors = await Promise.all(
      distributors.map(
        (distributor) => client.sql`
        INSERT INTO distributors (id, name, phone, createdAt, updatedAt)
        VALUES (${distributor.id}, ${distributor.name}, ${distributor.phone}, ${distributor.createdAt}, ${distributor.updatedAt})
        ON CONFLICT (id) DO NOTHING;
      `,
      ),
    );
 
    console.log(`Seeded ${insertedDistributors.length} distributors`);
 
    return {
      createTable,
      distributors : insertedDistributors,
    };
  } catch (error) {
    console.error('Error seeding : distributors', error);
    throw error;
  }
}
 
async function seedProducts(client) {
  try {
    await client.sql`DROP TABLE IF EXISTS products`;
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
 
    // Create the "products" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS products (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        stock INT NOT NULL,
        price INT NOT NULL,
        distributorId UUID NOT NULL,
        createdAt DATE NOT NULL,
        updatedAt DATE NOT NULL
      );
    `;
 
    console.log(`Created "products" table`);
 
    // Insert data into the "products" table
    const insertedProducts = await Promise.all(
      products.map(
        (product) => client.sql`
        INSERT INTO products (id, name, stock, price, distributorId, createdAt, updatedAt)
        VALUES (${product.id}, ${product.name}, ${product.stock}, ${product.price}, ${product.distributorId}, ${product.createdAt}, ${product.updatedAt})
        ON CONFLICT (id) DO NOTHING;
      `,
      ),
    );
 
    console.log(`Seeded ${insertedProducts.length} products`);
 
    return {
      createTable,
      products: insertedProducts,
    };
  } catch (error) {
    console.error('Error seeding products:', error);
    throw error;
  }
}
 
async function seedPenjualan(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
 
    // Create the "products" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS penjualan (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        id_pegawai UUID NOT NULL,
        customerId UUID NOT NULL,
        jumlah INT NOT NULL,
        total INT NOT NULL,
        date DATE NOT NULL
      );
    `;
 
    console.log(`Created "penjualan" table`);
 
    // Insert data into the "products" table
    const insertedPenjualan = await Promise.all(
      penjualan.map(
        (penjualan) => client.sql`
        INSERT INTO penjualan (id, id_pegawai, customerId, jumlah, total, date)
        VALUES (${penjualan.id}, ${penjualan.id_pegawai}, ${penjualan.customerId}, ${penjualan.jumlah}, ${penjualan.total},  ${penjualan.date})
        ON CONFLICT (id) DO NOTHING;
      `,
      ),
    );
 
    console.log(`Seeded ${insertedPenjualan.length} penjualan`);
 
    return {
      createTable,
      penjualan : insertedPenjualan,
    };
  } catch (error) {
    console.error('Error seeding : penjualan', error);
    throw error;
  }
}
 
async function seedPembelian(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
 
    // Create the "products" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS pembelian (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        jumlah INT NOT NULL,
        total INT NOT NULL,
        date DATE NOT NULL
      );
    `;
 
    console.log(`Created "pembelian" table`);
 
    // Insert data into the "products" table
    const insertedPembelian = await Promise.all(
      pembelian.map(
        (pembelian) => client.sql`
        INSERT INTO pembelian (id, jumlah, total, date)
        VALUES (${pembelian.id}, ${pembelian.jumlah}, ${pembelian.total},  ${pembelian.date})
        ON CONFLICT (id) DO NOTHING;
      `,
      ),
    );
 
    console.log(`Seeded ${insertedPembelian.length} pembelian`);
 
    return {
      createTable,
      pembelian : insertedPembelian,
    };
  } catch (error) {
    console.error('Error seeding pembelian:', error);
    throw error;
  }
}
 
async function seedPoin(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
 
    // Create the "products" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS poin (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        customerId UUID NOT NULL,
        id_penjualan UUID NOT NULL,
        totalPoints INT NOT NULL
      );
    `;
 
    console.log(`Created "poin" table`);
 
    // Insert data into the "products" table
    const insertedPoin = await Promise.all(
      poin.map(
        (poin) => client.sql`
        INSERT INTO poin (id, customerId, id_penjualan, totalPoints)
        VALUES (${poin.id}, ${poin.customerId}, ${poin.id_penjualan},  ${poin.totalPoints})
        ON CONFLICT (id) DO NOTHING;
      `,
      ),
    );
 
    console.log(`Seeded ${insertedPoin.length} poin`);
 
    return {
      createTable,
      poin : insertedPoin,
    };
  } catch (error) {
    console.error('Error seeding poin:', error);
    throw error;
  }
}
 
async function seedStock(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
 
    // Create the "products" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS stock (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        id_produk UUID NOT NULL,
        jumlah INT NOT NULL
      );
    `;
 
    console.log(`Created "stock" table`);
 
    // Insert data into the "products" table
    const insertedStock = await Promise.all(
      stock.map(
        (stock) => client.sql`
        INSERT INTO stock (id, id_produk, jumlah)
        VALUES (${stock.id}, ${stock.id_produk}, ${stock.jumlah})
        ON CONFLICT (id) DO NOTHING;
      `,
      ),
    );
 
    console.log(`Seeded ${insertedStock.length} stock`);
 
    return {
      createTable,
      stock : insertedStock,
    };
  } catch (error) {
    console.error('Error seeding stock:', error);
    throw error;
  }
}
 
async function seedDetailTransaksi(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
 
    // Create the "products" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS Detailtransaksi (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        id_penjualan UUID NOT NULL,
        id_produk UUID NOT NULL,
        id_pembelian UUID NOT NULL,
        jenis_transaksi VARCHAR(225) NOT NULL,
        biaya_transaksi INT NOT NULL,
        total_biaya_transaksi INT NOT NULL,
        date DATE NOT NULL
      );
    `;
 
    console.log(`Created "Detailtransaksi" table`);
   
 
    // Insert data into the "products" table
    const insertedDetailTransaksi = await Promise.all(
      DetailTransaksi.map(
        (DetailTransaksi) => {
          if (DetailTransaksi.total_biaya_transaksi == null) {
            throw new Error("total_biaya_transaksi cannot be null");
          }
          return client.sql`
        INSERT INTO Detailtransaksi (id, id_penjualan, id_produk, id_pembelian, jenis_transaksi, biaya_transaksi, total_biaya_transaksi, date)
        VALUES (${DetailTransaksi.id}, ${DetailTransaksi.id_penjualan}, ${DetailTransaksi.id_produk}, ${DetailTransaksi.id_pembelian}, ${DetailTransaksi.jenis_transaksi}, ${DetailTransaksi.biaya_transaksi}, ${DetailTransaksi.total_biaya_transaksi}, ${DetailTransaksi.date})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
    );
 
    console.log(`Seeded ${insertedDetailTransaksi.length} Detailtransaksi`);
 
    return {
      createTable,
      DetailTransaksi : insertedDetailTransaksi,
    };
  } catch (error) {
    console.error('Error seeding : Detailtransaksi', error);
    throw error;
  }
}
 
 
async function seedRevenue(client) {
  try {
    // Create the "revenue" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS revenue (
        month VARCHAR(4) NOT NULL UNIQUE,
        revenue INT NOT NULL
      );
    `;
 
    console.log(`Created "revenue" table`);
 
    // Insert data into the "revenue" table
    const insertedRevenue = await Promise.all(
      revenue.map(
        (rev) => client.sql`
        INSERT INTO revenue (month, revenue)
        VALUES (${rev.month}, ${rev.revenue})
        ON CONFLICT (month) DO NOTHING;
      `,
      ),
    );
 
    console.log(`Seeded ${insertedRevenue.length} revenue`);
 
    return {
      createTable,
      revenue: insertedRevenue,
    };
  } catch (error) {
    console.error('Error seeding revenue:', error);
    throw error;
  }
}
 
async function main() {
  const client = await db.connect();
 
  await seedRoles(client);
  await seedCustomers(client);
  await seedDistributors(client);
  await seedPegawai(client);
  await seedProducts(client);
  await seedPenjualan(client);
  await seedPembelian(client);
  await seedPoin(client);
  await seedStock(client);
  await seedDetailTransaksi(client);
  await seedRevenue(client);
 
  await client.end();
}
 
main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});