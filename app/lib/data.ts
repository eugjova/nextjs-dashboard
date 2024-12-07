'use server';

import { sql } from '@vercel/postgres';
import {
  CustomerField,
  CustomersTableType,
  PenjualanForm,
  ProductsTable,
  ProductsTableType,
  DistributorField,
  PegawaiField,
  PegawaiTableType,
} from './definitions';
import { unstable_noStore as noStore } from 'next/cache';

const ITEMS_PER_PAGE = 10;
const PRODUCTS_PER_PAGE = 8;

export async function fetchDashboardData() {
  try {
    const data = await sql`
      SELECT 
        (SELECT COUNT(*) FROM customers) as total_customers,
        (SELECT COALESCE(SUM(total_bayar), 0) FROM penjualan) as total_penjualan,
        (SELECT COUNT(*) FROM customers WHERE createdat >= NOW() - INTERVAL '1 month') as new_customers,
        (SELECT COUNT(*) FROM penjualan WHERE date >= NOW() - INTERVAL '1 month') as recent_transactions
    `;
    
    return {
      totalCustomers: Number(data.rows[0].total_customers),
      totalPenjualan: Number(data.rows[0].total_penjualan),
      newCustomers: Number(data.rows[0].new_customers),
      recentTransactions: Number(data.rows[0].recent_transactions)
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch dashboard data.');
  }
}

export async function fetchRevenueData() {
  noStore();
  try {
    const data = await sql<{ month: string; total: number }>`
      WITH monthly_data AS (
        SELECT 
          DATE_TRUNC('month', date) as month_date,
          COALESCE(SUM(total_bayar), 0) as total
        FROM penjualan
        WHERE date >= NOW() - INTERVAL '7 months'
        GROUP BY DATE_TRUNC('month', date)
      )
      SELECT 
        TO_CHAR(month_date, 'YYYY-MM-DD') as month,
        total::integer
      FROM monthly_data
      ORDER BY month_date ASC
    `;

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchCustomerGrowthData() {
  try {
    const data = await sql<{ month: string; total: number }>`
      SELECT 
        DATE_TRUNC('month', createdat)::text as month,
        COUNT(*)::integer as total
      FROM customers
      WHERE createdat >= NOW() - INTERVAL '7 months'
      GROUP BY DATE_TRUNC('month', createdat)
      ORDER BY month DESC
      LIMIT 7
    `;
    
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch customer growth data.');
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

export async function fetchFilteredPegawai(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const pegawai = await sql<PegawaiTableType>`
      SELECT 
        p.id,
        p.name,
        p.phone,
        p.gender,
        p.email,
        p.password,
        r.name as role_name
      FROM pegawai p
      JOIN roles r ON p.id_role = r.id
      WHERE
        p.name ILIKE ${`%${query}%`} OR
        p.email ILIKE ${`%${query}%`} OR
        p.phone ILIKE ${`%${query}%`}
      ORDER BY p.name ASC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
    return pegawai.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch filtered pegawai.');
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
      ORDER BY p.date ASC
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

export async function fetchPenjualanItems(id: string) {
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

export async function fetchAllPenjualan(
  query: string,
  startDate?: string,
  endDate?: string,
) {
  noStore();
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
      ORDER BY p.date ASC
    `;

    const data = await sql.query(queryString, values);
    return data.rows;

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch all penjualan data.');
  }
}

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

export async function fetchAllPembelian(
  query: string,
  startDate?: string,
  endDate?: string,
) {
  noStore();
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

    queryString += ` ORDER BY p.date DESC`;

    const data = await sql.query(queryString, values);
    return data.rows;

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch all pembelian data.');
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