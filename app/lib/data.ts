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
  // Add noStore() here to prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  noStore();

  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

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
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
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

const ITEMS_PER_PAGE = 6;

export async function fetchFilteredPenjualan(
  query: string,
  currentPage: number,
) {
  
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const data = await sql<PenjualanTable>`
      SELECT
        penjualan.id,
        penjualan.id_pegawai,
        penjualan.costumerId,
        penjualan.id_produk,
        penjualan.jumlah,
        penjualan.total,
        penjualan.poin,
        penjualan.date
      FROM invoices
      WHERE
        penjualan.jumlah::text ILIKE ${`%${query}%`} OR
        penjualan.total::text ILIKE ${`%${query}%`} OR
        penjualan.poin::text ILIKE ${`%${query}%`} OR
        penjualan.date ILIKE ${`%${query}%`} 
      ORDER BY penjualan.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    const penjualan = data.rows.map((penjualan) => ({
      ...penjualan,
    }));
    return penjualan;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch penjualan.');
  }
}

export async function fetchPenjualanPages(query: string) {
  noStore();
  try {
    const count = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchPenjualanById(id: string) {
  noStore();
  try {
    const data = await sql<PenjualanForm>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM in
      WHERE penjualan.id = ${id};
    `;

    const penjualan = data.rows.map((penjualan) => ({
      ...penjualan,
      // Convert amount from cents to dollars
      total : penjualan.total / 100,
    }));
    
    console.log(penjualan); // Invoice is an empty array []
    return penjualan[0];
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
        name
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
      // Add any additional fields you want to format here
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
    FROM penjualan
    JOIN customers ON penjualan.customerId = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      penjualan.amount::text ILIKE ${`%${query}%`} OR
      penjualan.date::text ILIKE ${`%${query}%`} OR
      penjualan.status ILIKE ${`%${query}%`}
  `;
 
    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
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


export async function fetchFilteredPegawai(
  query: string,
  currentPage: number,
) {
  const ITEMS_PER_PAGE = 10;
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  noStore();
  try {
    const data = await sql<PegawaiTableType>`
		SELECT
		  pegawai.id,
		  pegawai.name,
		  pegawai.phone,
      pegawai.gender,
      pegawai.email,
      pegawai.password 
    FROM pegawai
    WHERE name ILIKE ${`%${query}%`} OR phone::text ILIKE ${`%${query}%`}
    GROUP BY pegawai.id, pegawai.name, pegawai.phone
		ORDER BY pegawai.name ASC
    LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
	  `;

    const pegawai = data.rows.map((pegawai) => ({
      ...pegawai,
    }));

    return pegawai;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch pegawai table.');
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
  const ITEMS_PER_PAGE = 10;
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  noStore();
  try {
    const data = await sql<DistributorTableType>`
      SELECT
        distributors.id,
        distributors.name,
        distributors.phone
      FROM distributors
      WHERE name ILIKE ${`%${query}%`} OR phone::text ILIKE ${`%${query}%`}
      GROUP BY distributors.id, distributors.name, distributors.phone
      ORDER BY distributors.name ASC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    const distributors = data.rows.map((distributor) => ({
      ...distributor,
    }));

    return distributors;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch distributor table.');
  }
}


export async function fetchDistributorPages(query: string) {
  noStore();
  try {
    const count = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;
 
    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
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
  const ITEMS_PER_PAGE = 11; // Define or import ITEMS_PER_PAGE
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  noStore();
  try {
    const data = await sql<ProductsTableType>`
      SELECT
        products.id,
        products.name,
        products.stock,
        products.image_url,
        products.price
      FROM products
      WHERE name ILIKE ${`%${query}%`} OR stock ::text ILIKE ${`%${query}%`}
      GROUP BY products.id, products.name, products.stock
      ORDER BY products.name ASC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    const products = data.rows.map((products) => ({
      ...products,
    }));

    return products;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch products table.');
  }
}
 
export async function fetchProductsPages(query: string) {
  noStore();
  try {
    const count = await sql`SELECT COUNT(*)
      FROM products
      WHERE
        name ILIKE ${`%${query}%`} OR
        price::text ILIKE ${`%${query}%`}
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
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

    const product = data.rows[0]; // Directly access the first row

    console.log(product); // Log the product object
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



