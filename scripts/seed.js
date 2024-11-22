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
  pembelian,
  stock,
  DetailTransaksiPenjualan,
  DetailTransaksiPembelian
} = require('../app/lib/placeholder-data.js');

 
async function seedRoles(client) {
  try {
    await client.sql`DROP TABLE IF EXISTS roles`;
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "roles" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS roles (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      );
    `;

    console.log(`Created "roles" table`);

    // Insert data into the "roles" table
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
 
    // Create the "customers" table if it doesn't exist
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
 
    // Insert data into the "customers" table
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
 
    // Create the "customers" table if it doesn't exist
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
 
    // Insert data into the "customers" table
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
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
 
    // Drop tabel jika sudah ada
    await client.sql`DROP TABLE IF EXISTS penjualan CASCADE`;
 
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS penjualan (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        date DATE NOT NULL,
        id_produk UUID NOT NULL REFERENCES products(id),
        customerId UUID NOT NULL REFERENCES customers(id),
        id_pegawai UUID NOT NULL REFERENCES pegawai(id),
        jumlah INT NOT NULL,
        total INT NOT NULL,
        total_bayar INT NOT NULL,
        poin INT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    console.log(`Created "penjualan" table`);
    
    const insertedPenjualan = await Promise.all(
      penjualan.map(
        (penjualan) => client.sql`
        INSERT INTO penjualan (
          id,
          date,
          id_produk,
          customerId,
          id_pegawai,
          jumlah,
          total,
          total_bayar,
          poin
        )
        VALUES (
          ${penjualan.id},
          ${penjualan.date},
          ${penjualan.id_produk},
          ${penjualan.customerId},
          ${penjualan.id_pegawai},
          ${penjualan.jumlah},
          ${penjualan.total},
          ${penjualan.total_bayar || penjualan.total},
          ${penjualan.poin}
        )
        ON CONFLICT (id) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedPenjualan.length} penjualan`);

    return {
      createTable,
      penjualan: insertedPenjualan,
    };
  } catch (error) {
    console.error('Error seeding penjualan:', error);
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

async function seedDetailTransaksiPembelian(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
 
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS DetailTransaksiPembelian (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        id_pembelian UUID NOT NULL,
        distributorId UUID NOT NULL,
        jumlah INT NOT NULL,
        total_biaya_transaksi INT NOT NULL,
        date DATE NOT NULL
      );
    `;
 
    console.log(`Created "DetailtransaksiPembelian" table`);
   
    const insertedDetailTransaksiPembelian = await Promise.all(
      DetailTransaksiPembelian.map(
        (DetailTransaksiPembelian) => {
          // Pastikan jumlah dan total_biaya_transaksi adalah number yang valid
          const jumlah = Number(DetailTransaksiPembelian.jumlah);
          const total_biaya_transaksi = Number(DetailTransaksiPembelian.total_biaya_transaksi);

          // Validasi untuk memastikan nilai yang valid
          if (isNaN(jumlah) || isNaN(total_biaya_transaksi)) {
            console.error('Invalid data:', DetailTransaksiPembelian);
            throw new Error('Invalid jumlah or total_biaya_transaksi value');
          }

          return client.sql`
            INSERT INTO DetailtransaksiPembelian (
              id, 
              id_pembelian, 
              distributorId, 
              jumlah, 
              total_biaya_transaksi, 
              date
            )
            VALUES (
              ${DetailTransaksiPembelian.id}, 
              ${DetailTransaksiPembelian.id_pembelian}, 
              ${DetailTransaksiPembelian.distributorId}, 
              ${jumlah}, 
              ${total_biaya_transaksi}, 
              ${DetailTransaksiPembelian.date}
            )
            ON CONFLICT (id) DO NOTHING;
          `;
        }
      ),
    );
 
    console.log(`Seeded ${insertedDetailTransaksiPembelian.length} DetailtransaksiPembelian`);
 
    return {
      createTable,
      DetailTransaksiPembelian: insertedDetailTransaksiPembelian,
    };
  } catch (error) {
    console.error('Error seeding : Detailtransaksipembelian', error);
    throw error;
  }
}

async function seedDetailTransaksiPenjualan(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
 
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS DetailTransaksiPenjualan (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        id_penjualan UUID NOT NULL REFERENCES penjualan(id),
        id_produk UUID NOT NULL REFERENCES products(id),
        jumlah INT NOT NULL,
        harga INT NOT NULL,
        date DATE NOT NULL
      );
    `;
 
    console.log(`Created "DetailTransaksiPenjualan" table`);
   
    const insertedDetailTransaksiPenjualan = await Promise.all(
      DetailTransaksiPenjualan.map(
        (DetailTransaksiPenjualan) => {
          // Pastikan jumlah adalah number yang valid
          const jumlah = Number(DetailTransaksiPenjualan.jumlah);
          // Pastikan harga adalah number yang valid
          const harga = Number(DetailTransaksiPenjualan.harga);

          // Validasi untuk memastikan nilai yang valid
          if (isNaN(jumlah) || isNaN(harga)) {
            console.error('Invalid data:', DetailTransaksiPenjualan);
            throw new Error('Invalid jumlah or harga value');
          }

          return client.sql`
            INSERT INTO DetailTransaksiPenjualan (
              id, 
              id_penjualan, 
              id_produk, 
              jumlah, 
              harga, 
              date
            )
            VALUES (
              ${DetailTransaksiPenjualan.id}, 
              ${DetailTransaksiPenjualan.id_penjualan}, 
              ${DetailTransaksiPenjualan.id_produk}, 
              ${jumlah}, 
              ${harga}, 
              ${DetailTransaksiPenjualan.date}
            )
            ON CONFLICT (id) DO NOTHING;
          `;
        }
      ),
    );
 
    console.log(`Seeded ${insertedDetailTransaksiPenjualan.length} DetailTransaksiPenjualan`);
 
    return {
      createTable,
      DetailTransaksiPenjualan: insertedDetailTransaksiPenjualan,
    };
  } catch (error) {
    console.error('Error seeding : DetailTransaksiPenjualan', error);
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

  // Hapus tabel dalam urutan yang benar (dari child ke parent)
  await client.sql`DROP TABLE IF EXISTS penjualan CASCADE`;
  await client.sql`DROP TABLE IF EXISTS DetailTransaksiPenjualan CASCADE`;
  await client.sql`DROP TABLE IF EXISTS DetailTransaksiPembelian CASCADE`;
  await client.sql`DROP TABLE IF EXISTS pembelian CASCADE`;
  await client.sql`DROP TABLE IF EXISTS stock CASCADE`;
  await client.sql`DROP TABLE IF EXISTS products CASCADE`;
  await client.sql`DROP TABLE IF EXISTS customers CASCADE`;
  await client.sql`DROP TABLE IF EXISTS distributors CASCADE`;
  await client.sql`DROP TABLE IF EXISTS pegawai CASCADE`;
  await client.sql`DROP TABLE IF EXISTS roles CASCADE`;

  // Kemudian buat tabel dalam urutan yang benar (dari parent ke child)
  await seedRoles(client);
  await seedCustomers(client);
  await seedDistributors(client);
  await seedPegawai(client);
  await seedProducts(client);
  await seedPenjualan(client);
  await seedPembelian(client);
  await seedStock(client);
  await seedDetailTransaksiPenjualan(client);
  await seedDetailTransaksiPembelian(client);
  await seedRevenue(client);

  await client.end();
}
 
main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});