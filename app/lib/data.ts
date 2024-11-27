'use server';

import { sql } from '@vercel/postgres';
import {
  CustomerField,
  CustomersTableType,
  CustomersForm,
  LatestCustomer,
  PenjualanForm,
  PenjualanTable,
  LatestPenjualanRaw,
  Roles,
  Revenue,
  ProductsTable,
  ProductForm,
  ProductsTableType,
  DistributorField,
  DistributorTableType,
  DistributorForm,
  Pegawai,
  PegawaiField,
  PegawaiForm,
  PegawaiTableType,
} from './definitions';
import { unstable_noStore as noStore } from 'next/cache';
import { formatCurrency } from './utils';
import { distributors, penjualan, products, } from './placeholder-data';
import { error } from 'console';

export async function fetchRevenue() {
  noStore();

  try {
    console.log('Fetching revenue data...');
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<Revenue>`SELECT * FROM revenue`;

    console.log('Data fetch completed after 3 seconds.');

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestPenjualan() {
  noStore();
  try {
    const data = await sql<LatestPenjualanRaw>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = data.rows.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  noStore();
  try {
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0].rows[0].count ?? '0');
    const numberOfCustomers = Number(data[1].rows[0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 10;
const PRODUCTS_PER_PAGE = 8;

export async function fetchFilteredPembelian(
  query: string,
  currentPage: number,
  startDate?: string,
  endDate?: string,
) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    let queryString = `
      SELECT
        p.id,
        p.date,
        pg.name as nama_pegawai,
        d.name as nama_distributor,
        p.jumlah,
        p.total
      FROM pembelian p
      JOIN distributors d ON p.distributorId = d.id
      JOIN pegawai pg ON p.pegawaiId = pg.id
    `;

    const conditions = [];
    const values = [];
    
    if (query) {
      conditions.push(`(d.name ILIKE $${values.length + 1} OR pg.name ILIKE $${values.length + 1})`);
      values.push(`%${query}%`);
    }

    if (startDate) {
      conditions.push(`p.date >= $${values.length + 1}`);
      values.push(startDate);
    }

    if (endDate) {
      conditions.push(`p.date <= $${values.length + 1}`);
      values.push(endDate);
    }

    if (conditions.length > 0) {
      queryString += ` WHERE ${conditions.join(' AND ')}`;
    }

    queryString += ` ORDER BY p.date DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
    values.push(ITEMS_PER_PAGE, offset);

    const data = await sql.query(queryString, values);
    return data.rows;

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch filtered pembelian data.');
  }
}

export async function fetchFilteredPenjualan(
  query: string,
  currentPage: number,
  startDate?: string,
  endDate?: string,
) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    let queryString = `
      SELECT 
        p.id,
        p.date,
        c.name as nama_customer,
        peg.name as nama_pegawai,
        COUNT(pi.id) as total_items,
        p.total_amount,
        p.total_bayar,
        p.poin_used
      FROM penjualan p
      JOIN customers c ON p.customerId = c.id
      JOIN pegawai peg ON p.pegawaiId = peg.id
      LEFT JOIN penjualan_items pi ON p.id = pi.penjualan_id
    `;

    const conditions = [];
    const values = [];
    
    if (query) {
      conditions.push(`(c.name ILIKE $${values.length + 1} OR peg.name ILIKE $${values.length + 1})`);
      values.push(`%${query}%`);
    }

    if (startDate) {
      conditions.push(`p.date >= $${values.length + 1}`);
      values.push(startDate);
    }

    if (endDate) {
      conditions.push(`p.date <= $${values.length + 1}`);
      values.push(endDate);
    }

    if (conditions.length > 0) {
      queryString += ` WHERE ${conditions.join(' AND ')}`;
    }

    queryString += ` 
      GROUP BY 
        p.id, 
        p.date, 
        c.name, 
        peg.name, 
        p.total_amount, 
        p.total_bayar, 
        p.poin_used
      ORDER BY p.date DESC 
      LIMIT $${values.length + 1} 
      OFFSET $${values.length + 2}
    `;
    
    values.push(ITEMS_PER_PAGE, offset);

    const data = await sql.query(queryString, values);
    return data.rows;

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch filtered penjualan data.');
  }
}

export async function fetchPenjualanPages(query: string) {
  noStore();
  try {
    const count = await sql`
      SELECT COUNT(DISTINCT p.id)
      FROM penjualan p
      JOIN customers c ON p.customerId = c.id
      JOIN pegawai peg ON p.pegawaiId = peg.id
      WHERE
        c.name ILIKE ${`%${query}%`} OR
        peg.name ILIKE ${`%${query}%`}
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of penjualan.');
  }
}

export async function fetchPenjualanById(id: string) {
  noStore();
  try {
    const data = await sql<PenjualanForm>`
      SELECT
        p.id,
        p.date,
        p.customerId,
        p.pegawaiId,
        p.total_amount,
        p.total_bayar,
        p.poin_used,
        c.name as customer_name,
        peg.name as pegawai_name
      FROM penjualan p
      JOIN customers c ON p.customerId = c.id
      JOIN pegawai peg ON p.pegawaiId = peg.id
      WHERE p.id = ${id}
    `;

    if (!data.rows[0]) {
      throw new Error('Penjualan not found');
    }

    return data.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch penjualan.');
  }
}

export async function fetchCustomers() {
  try {
    const data = await sql<CustomerField>`
      SELECT
        id,
        name,
        poin
      FROM customers
      ORDER BY name ASC
    `;

    const customers = data.rows;
    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchLatestCustomers() {
  noStore();
  try {
    const data = await sql<LatestCustomer>`
      SELECT
        id,
        name,
        phone,
        createdAt,
        updatedAt,
        gender,
        poin
      FROM customers
      ORDER BY name ASC`;

    const customers = data.rows.map((customer) => ({
      ...customer,
    }));
    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(
  query: string,
  currentPage: number,
) {
  const ITEMS_PER_PAGE = 10;
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  noStore();
  try {
    const data = await sql<CustomersTableType>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.phone,
		  customers.image_url,
      customers.gender,
      customers.poin
      FROM customers
    WHERE name ILIKE ${`%${query}%`} OR phone::text ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.phone, customers.gender, customers.image_url
		ORDER BY customers.name ASC
    LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
	  `;

    const customers = data.rows.map((customer) => ({
      ...customer,
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}


export async function fetchCustomersPages(query: string) {
  noStore();
  try {
    const count = await sql`SELECT COUNT(*)
    FROM customers
    WHERE
      name ILIKE ${`%${query}%`} OR
      phone ILIKE ${`%${query}%`} OR
      gender ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of customers.');
  }
}

export async function fetchCustomerById(id: string) {
  noStore()
  try {
    const data = await sql<CustomersForm>`
      SELECT
        customers.id,
        customers.name,
        customers.phone,
        customers.gender,
        customers.poin,
        customers.image_url
      FROM customers
      WHERE customers.id = ${id};
    `;
 
    const customers = data.rows.map((customer) => ({
      ...customer,
    }));
    console.log(customers);
    return customers[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch customer.');
  }
}


export async function fetchFilteredPegawai(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const pegawai = await sql<PegawaiTableType>`
      SELECT *
      FROM pegawai
      WHERE
        name ILIKE ${`%${query}%`} OR
        email ILIKE ${`%${query}%`} OR
        phone ILIKE ${`%${query}%`}
      ORDER BY name ASC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
    return pegawai.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch pegawai data.');
  }
}

export async function fetchPegawaiPages(query: string) {
  try {
    const count = await sql`
      SELECT COUNT(*)
      FROM pegawai
      WHERE
        name ILIKE ${`%${query}%`} OR
        email ILIKE ${`%${query}%`} OR
        phone ILIKE ${`%${query}%`}
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of pegawai.');
  }
}

export async function fetchPegawaiById(id: string) {
  noStore()
  try {
    const data = await sql<PegawaiForm>`
      SELECT
        id,
        name,
        phone,
        gender,
        email, 
        password
      FROM pegawai
      WHERE id = ${id};
    `;
 
    const pegawai = data.rows[0];
    console.log(pegawai);
    return pegawai;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch pegawai.');
  }
}

export async function fetchDistributor() {
  try {
    const data = await sql<DistributorField>`
      SELECT
        id,
        name,
        phone
      FROM distributors
      ORDER BY name ASC
    `;

    const distributors = data.rows;
    return distributors;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all distributors.');
  }
}

export async function fetchFilteredDistributors(
  query: string,
  currentPage: number,
) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const distributors = await sql<DistributorField>`
      SELECT *
      FROM distributors
      WHERE name ILIKE ${`%${query}%`} OR phone ILIKE ${`%${query}%`}
      ORDER BY name ASC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return distributors.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch distributors.');
  }
}


export async function fetchDistributorPages(query: string) {
  noStore();
  try {
    const count = await sql`
      SELECT COUNT(*)
      FROM distributors
      WHERE name ILIKE ${`%${query}%`} OR phone ILIKE ${`%${query}%`}
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of distributors.');
  }
}

export async function fetchDistributorById(id: string) {
  noStore()
  try {
    const data = await sql<DistributorForm>`
      SELECT
        distributors.id,
        distributors.name,
        distributors.phone
      FROM distributors
      WHERE distributors.id = ${id};
    `;
 
    const distributors = data.rows[0];
    console.log(distributors);
    return distributors;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch distributor.');
  }
}

export async function fetchProducts() {
  noStore();
  try {
    const data = await sql<ProductsTableType>`
      SELECT
        id,
        name,
        stock,
        price,
        image_url
      FROM products
      ORDER BY name ASC
    `;
    
    const products = data.rows;
    return products;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all products.');
  }
}

export async function fetchFilteredProducts(
  query: string,
  currentPage: number,
) {
  noStore();
  const offset = (currentPage - 1) * PRODUCTS_PER_PAGE;

  try {
    const data = await sql<ProductsTable>`
      SELECT 
        products.id,
        products.name,
        products.stock,
        products.price,
        products.image_url,
        products.distributorId,
        distributors.name as distributor_name
      FROM products
      LEFT JOIN distributors ON products.distributorId = distributors.id
      WHERE products.name ILIKE ${`%${query}%`}
      ORDER BY products.name DESC
      LIMIT ${PRODUCTS_PER_PAGE} OFFSET ${offset}
    `;

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch products.');
  }
}
 
export async function fetchProductsPages(query: string) {
  noStore();
  try {
    const count = await sql`
      SELECT COUNT(*)
      FROM products
      WHERE name ILIKE ${`%${query}%`}
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / PRODUCTS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of products.');
  }
}
 
export async function fetchProductsById(id: string) {
  noStore();
  try {
    const data = await sql<ProductForm>`
      SELECT
        id,
        name,
        stock,
        price,
        image_url
      FROM products
      WHERE id = ${id};
    `;

    const product = data.rows[0];

    console.log(product);
    return product;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch product.');
  }
}

export async function getPegawai(email: string) {
  noStore();
  try {
    const pegawai = await sql`SELECT * FROM pegawai WHERE email=${email}`;
    return pegawai.rows[0] as Pegawai;
  } catch (error) {
    console.error('Failed to fetch pegawai:', error);
    throw new Error('Failed to fetch pegawai.');
  }
}

export async function fetchPegawai() {
  try {
    const data = await sql<PegawaiField>`
      SELECT
        id,
        name,
        phone,
        gender,
        email,
        password
      FROM pegawai
      ORDER BY name ASC
    `;

    const pegawai = data.rows;
    return pegawai;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all pegawai.');
  }
}

export async function fetchPembelianPages(query: string) {
  try {
    const count = await sql`
      SELECT COUNT(*)
      FROM pembelian p
      JOIN pegawai peg ON p.pegawaiId = peg.id
      JOIN distributors d ON p.distributorId = d.id
      WHERE
        peg.name ILIKE ${`%${query}%`} OR
        d.name ILIKE ${`%${query}%`}
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total pages.');
  }
}

export async function fetchPenjualanItems(penjualanId: string) {
  try {
    const items = await sql`
      SELECT 
        pi.*,
        p.name as nama_produk
      FROM penjualan_items pi
      JOIN products p ON pi.product_id = p.id
      WHERE pi.penjualan_id = ${penjualanId}
      ORDER BY pi.id ASC
    `;
    return items.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch penjualan items.');
  }
}

export async function getPenjualanItems(id: string) {
  try {
    const items = await sql`
      SELECT 
        pi.id,
        pi.quantity,
        pi.price_per_item,
        pi.subtotal,
        p.name as nama_produk
      FROM penjualan_items pi
      JOIN products p ON pi.product_id = p.id
      WHERE pi.penjualan_id = ${id}
      ORDER BY pi.id ASC
    `;
    return items.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch penjualan items.');
  }
}

export async function fetchLaporanPenjualanPages(query: string, startDate?: string, endDate?: string) {
  try {
    let queryString = `
      SELECT COUNT(DISTINCT p.id)
      FROM penjualan p
      JOIN customers c ON p.customerId = c.id
      JOIN pegawai peg ON p.pegawaiId = peg.id
    `;

    const conditions = [];
    const values = [];
    
    if (query) {
      conditions.push(`(c.name ILIKE $${values.length + 1} OR peg.name ILIKE $${values.length + 1})`);
      values.push(`%${query}%`);
    }

    if (startDate) {
      conditions.push(`p.date >= $${values.length + 1}`);
      values.push(startDate);
    }

    if (endDate) {
      conditions.push(`p.date <= $${values.length + 1}`);
      values.push(endDate);
    }

    if (conditions.length > 0) {
      queryString += ` WHERE ${conditions.join(' AND ')}`;
    }

    const count = await sql.query(queryString, values);
    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total pages.');
  }
}

export async function fetchLaporanPembelianPages(query: string, startDate?: string, endDate?: string) {
  try {
    let queryString = `
      SELECT COUNT(*)
      FROM pembelian p
      JOIN distributors d ON p.distributorId = d.id
      JOIN pegawai pg ON p.pegawaiId = pg.id
    `;

    const conditions = [];
    const values = [];
    
    if (query) {
      conditions.push(`(d.name ILIKE $${values.length + 1} OR pg.name ILIKE $${values.length + 1})`);
      values.push(`%${query}%`);
    }

    if (startDate) {
      conditions.push(`p.date >= $${values.length + 1}`);
      values.push(startDate);
    }

    if (endDate) {
      conditions.push(`p.date <= $${values.length + 1}`);
      values.push(endDate);
    }

    if (conditions.length > 0) {
      queryString += ` WHERE ${conditions.join(' AND ')}`;
    }

    const count = await sql.query(queryString, values);
    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total pages.');
  }
}



