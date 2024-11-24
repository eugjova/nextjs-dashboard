require('dotenv').config();
const { db } = require('@vercel/postgres');
const bcrypt = require('bcrypt');
const formatDate = (date) => date.toISOString().split('T')[0];
const {
  roles,
  customers,
  distributors,
  pegawai,
  revenue,
  products,
  penjualan,
  penjualan_items,
  pembelian,
  stock,
} = require('../app/lib/placeholder-data.js');

 
async function seedRoles(client) {
  try {
    await client.sql`DROP TABLE IF EXISTS roles`;
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS roles (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      );
    `;

    console.log(`Created "roles" table`);

    const insertedUsers = await Promise.all(
      roles.map(async (roles) => {
        return client.sql`
        INSERT INTO roles (id, name)
        VALUES (${roles.id}, ${roles.name})
        ON CONFLICT (id) DO NOTHING;
      `;
      }),
    );

    console.log(`Seeded ${insertedUsers.length} roles`);

    return {
      createTable,
      roles: insertedUsers,
    };
  } catch (error) {
    console.error('Error seeding roles:', error);
    throw error;
  }
}
 
async function seedCustomers(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
 
    const createTable = await client.sql`
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
 
    const currentDate = formatDate(new (Date))
 
    const insertedCustomers = await Promise.all(
      customers.map(
        (customer) => client.sql`
        INSERT INTO customers (id, name, phone, createdAt, updatedAt, gender, poin, image_url)
        VALUES (${customer.id}, ${customer.name}, ${customer.phone}, ${currentDate}, ${currentDate},  ${customer.gender}, ${customer.poin}, ${customer.image_url})
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
 
    const createTable = await client.sql`
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
 
    const insertedPegawai = await Promise.all(
      pegawai.map(async (pegawai) => {
        if (!pegawai.email) {
          throw new Error(`Missing email for pegawai with ID: ${pegawai.id}`);
        }
        const hashedPassword = await bcrypt.hash(pegawai.password, 10);
        return client.sql`
          INSERT INTO pegawai (id, id_role, name, phone, createdAt, updatedAt, gender, email, password)
          VALUES (${pegawai.id}, ${pegawai.id_role}, ${pegawai.name}, ${pegawai.phone}, ${pegawai.createdAt}, ${pegawai.updatedAt}, ${pegawai.gender}, ${pegawai.email}, ${hashedPassword})
          ON CONFLICT (id) DO NOTHING;
        `;
      })
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
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
 
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS products (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        stock INT NOT NULL,
        price INT NOT NULL,
        distributorId UUID NOT NULL,
        image_url VARCHAR(255) NOT NULL,
        createdAt DATE NOT NULL,
        updatedAt DATE NOT NULL
      );
    `;
 
    console.log(`Created "products" table`);
 
    const insertedProducts = await Promise.all(
      products.map(
        (product) => client.sql`
        INSERT INTO products (id, name, stock, price, distributorId, image_url, createdAt, updatedAt)
        VALUES (
          ${product.id}, 
          ${product.name}, 
          ${product.stock}, 
          ${product.price}, 
          ${product.distributorId}, 
          ${product.image_url}, 
          ${product.createdAt}, 
          ${product.updatedAt}
        )
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
    await client.sql`CREATE TABLE IF NOT EXISTS penjualan (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      customerId UUID NOT NULL,
      pegawaiId UUID NOT NULL,
      date DATE NOT NULL,
      poin_used INTEGER NOT NULL DEFAULT 0,
      total_amount INTEGER NOT NULL,
      total_bayar INTEGER NOT NULL,
      FOREIGN KEY (customerId) REFERENCES customers(id),
      FOREIGN KEY (pegawaiId) REFERENCES pegawai(id)
    );`;

    await client.sql`CREATE TABLE IF NOT EXISTS penjualan_items (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      penjualan_id UUID NOT NULL,
      product_id UUID NOT NULL,
      quantity INTEGER NOT NULL,
      price_per_item INTEGER NOT NULL,
      subtotal INTEGER NOT NULL,
      FOREIGN KEY (penjualan_id) REFERENCES penjualan(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );`;

    const insertedPenjualan = await Promise.all(
      penjualan.map(async (penjualan) => {
        return client.sql`
          INSERT INTO penjualan (
            id, customerId, pegawaiId, date, poin_used, total_amount, total_bayar
          )
          VALUES (
            ${penjualan.id}, ${penjualan.customerId}, ${penjualan.pegawaiId},
            ${penjualan.date}, ${penjualan.poin_used}, ${penjualan.total_amount},
            ${penjualan.total_bayar}
          )
          ON CONFLICT (id) DO NOTHING;
        `;
      })
    );

    const insertedItems = await Promise.all(
      penjualan_items.map(async (item) => {
        return client.sql`
          INSERT INTO penjualan_items (
            id, penjualan_id, product_id, quantity, price_per_item, subtotal
          )
          VALUES (
            ${item.id}, ${item.penjualan_id}, ${item.product_id},
            ${item.quantity}, ${item.price_per_item}, ${item.subtotal}
          )
          ON CONFLICT (id) DO NOTHING;
        `;
      })
    );

    console.log(`Created "penjualan" and "penjualan_items" tables`);
    console.log(`Seeded ${insertedPenjualan.length} penjualan`);
    console.log(`Seeded ${insertedItems.length} penjualan items`);

    return {
      createTable: true,
      penjualan: insertedPenjualan,
      items: insertedItems,
    };
  } catch (error) {
    console.error('Error seeding penjualan:', error);
    throw error;
  }
}
 
async function seedPembelian(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
 
    await client.sql`DROP TABLE IF EXISTS pembelian CASCADE`;
 
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS pembelian (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        date DATE NOT NULL,
        pegawaiId UUID NOT NULL REFERENCES pegawai(id),
        distributorId UUID NOT NULL REFERENCES distributors(id),
        jumlah INT NOT NULL,
        total INT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
 
    console.log(`Created "pembelian" table`);
 
    const insertedPembelian = await Promise.all(
      pembelian.map(
        (pembelian) => client.sql`
        INSERT INTO pembelian (
          id, 
          date,
          pegawaiId,
          distributorId,
          jumlah, 
          total
        )
        VALUES (
          ${pembelian.id}, 
          ${pembelian.date},
          ${pembelian.pegawaiId},
          ${pembelian.distributorId},
          ${pembelian.jumlah}, 
          ${pembelian.total}
        )
        ON CONFLICT (id) DO NOTHING;
      `,
      ),
    );
 
    console.log(`Seeded ${insertedPembelian.length} pembelian`);
 
    return {
      createTable,
      pembelian: insertedPembelian,
    };
  } catch (error) {
    console.error('Error seeding pembelian:', error);
    throw error;
  }
}
 
 
async function seedStock(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
 
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS stock (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        id_produk UUID NOT NULL,
        jumlah INT NOT NULL
      );
    `;
 
    console.log(`Created "stock" table`);
 
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
 
async function seedRevenue(client) {
  try {
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS revenue (
        month VARCHAR(4) NOT NULL UNIQUE,
        revenue INT NOT NULL
      );
    `;
 
    console.log(`Created "revenue" table`);
 
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

  await client.sql`DROP TABLE IF EXISTS penjualan_items CASCADE`;
  await client.sql`DROP TABLE IF EXISTS penjualan CASCADE`;
  await client.sql`DROP TABLE IF EXISTS pembelian CASCADE`;
  await client.sql`DROP TABLE IF EXISTS stock CASCADE`;
  await client.sql`DROP TABLE IF EXISTS products CASCADE`;
  await client.sql`DROP TABLE IF EXISTS customers CASCADE`;
  await client.sql`DROP TABLE IF EXISTS distributors CASCADE`;
  await client.sql`DROP TABLE IF EXISTS pegawai CASCADE`;
  await client.sql`DROP TABLE IF EXISTS roles CASCADE`;

  await seedRoles(client);
  await seedPegawai(client);
  await seedCustomers(client);
  await seedDistributors(client);
  await seedProducts(client);
  await seedPembelian(client);
  await seedPenjualan(client);
  await seedStock(client);
  await seedRevenue(client);

  await client.end();
}
 
main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});