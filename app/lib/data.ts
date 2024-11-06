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
} from './definitions';
// import { formatCurrency } from './utils';
import { unstable_noStore as noStore } from 'next/cache';
// import { products, } from './placeholder-data';


// export async function fetchRevenue() {
//   // Add noStore() here to prevent the response from being cached.
//   // This is equivalent to in fetch(..., {cache: 'no-store'}).
//   noStore();

//   try {
//     // Artificially delay a response for demo purposes.
//     // Don't do this in production :)

//     console.log('Fetching revenue data...');
//     await new Promise((resolve) => setTimeout(resolve, 3000));

//     const data = await sql<Revenue>`SELECT * FROM revenue`;

//     console.log('Data fetch completed after 3 seconds.');

//     return data.rows;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch revenue data.');
//   }
// }

// export async function fetchLatestPenjualan() {
//   noStore();
//   try {
//     const data = await sql<LatestPenjualanRaw>`
//       SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
//       FROM invoices
//       JOIN customers ON invoices.customer_id = customers.id
//       ORDER BY invoices.date DESC
//       LIMIT 5`;

//     const latestInvoices = data.rows.map((invoice) => ({
//       ...invoice,
//       amount: formatCurrency(invoice.amount),
//     }));
//     return latestInvoices;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch the latest invoices.');
//   }
// }

// export async function fetchCardData() {
//   noStore();
//   try {
//     // You can probably combine these into a single SQL query
//     // However, we are intentionally splitting them to demonstrate
//     // how to initialize multiple queries in parallel with JS.
//     const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
//     const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
//     const invoiceStatusPromise = sql`SELECT
//          SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
//          SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
//          FROM invoices`;

//     const data = await Promise.all([
//       invoiceCountPromise,
//       customerCountPromise,
//       invoiceStatusPromise,
//     ]);

//     const numberOfInvoices = Number(data[0].rows[0].count ?? '0');
//     const numberOfCustomers = Number(data[1].rows[0].count ?? '0');
//     const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? '0');
//     const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? '0');

//     return {
//       numberOfCustomers,
//       numberOfInvoices,
//       totalPaidInvoices,
//       totalPendingInvoices,
//     };
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch card data.');
//   }
// }

// const ITEMS_PER_PAGE = 6;

// export async function fetchFilteredPenjualan(
//   query: string,
//   currentPage: number,
// ) {
  
//   noStore();
//   const offset = (currentPage - 1) * ITEMS_PER_PAGE;

//   try {
//     const invoices = await sql<PenjualanTable>`
//       SELECT
//         invoices.id,
//         invoices.id_pegawai,
//         invoices.costumerId,
//         invoices.id_produk,
//         invoices.jumlah,
//         customers.total,
//         customers.poin,
//         customers.date,
//         products.name AS product_name
//       FROM invoices
//       JOIN customers ON invoices.customer_id = customers.id
//       JOIN products ON invoices.product_id = products.id
//       WHERE
//         customers.name ILIKE ${`%${query}%`} OR
//         customers.email ILIKE ${`%${query}%`} OR
//         invoices.amount::text ILIKE ${`%${query}%`} OR
//         invoices.quantity::text ILIKE ${`%${query}%`} OR
//         invoices.date::text ILIKE ${`%${query}%`} OR
//         invoices.status ILIKE ${`%${query}%`} OR
//         products.name ILIKE ${`%${query}%`}
//       ORDER BY invoices.date DESC
//       LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
//     `;

//     return invoices.rows;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch invoices.');
//   }
// }

// export async function fetchPenjualanPages(query: string) {
//   noStore();
//   try {
//     const count = await sql`SELECT COUNT(*)
//     FROM invoices
//     JOIN customers ON invoices.customer_id = customers.id
//     WHERE
//       customers.name ILIKE ${`%${query}%`} OR
//       customers.email ILIKE ${`%${query}%`} OR
//       invoices.amount::text ILIKE ${`%${query}%`} OR
//       invoices.date::text ILIKE ${`%${query}%`} OR
//       invoices.status ILIKE ${`%${query}%`}
//   `;

//     const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
//     return totalPages;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch total number of invoices.');
//   }
// }

// export async function fetchPenjualanById(id: string) {
//   noStore();
//   try {
//     const data = await sql<PenjualanForm>`
//       SELECT
//         invoices.id,
//         invoices.customer_id,
//         invoices.amount,
//         invoices.status
//       FROM in
//       WHERE penjualan.id = ${id};
//     `;

//     const penjualan = data.rows.map((penjualan) => ({
//       ...penjualan,
//       // Convert amount from cents to dollars
//       total : penjualan.total / 100,
//     }));
    
//     console.log(penjualan); // Invoice is an empty array []
//     return penjualan[0];
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch penjualan.');
//   }
// }

// export async function fetchCustomers() {
//   try {
//     const data = await sql<CustomerField>`
//       SELECT
//         id,
//         name,
//         phone,
//         createdAt,
//         updatedAt,
//         gender,
//         poin,
//         image_url
//       FROM customers
//       ORDER BY name ASC
//     `;

//     const customers = data.rows;
//     return customers;
//   } catch (err) {
//     console.error('Database Error:', err);
//     throw new Error('Failed to fetch all customers.');
//   }
// }

// export async function fetchLatestCustomers() {
//   noStore();
//   try {
//     const data = await sql<LatestCustomer>`
//       SELECT
//         id,
//         name,
//         phone,
//         image_url
//       FROM customers
//       ORDER BY name ASC`;

//     const customers = data.rows.map((customer) => ({
//       ...customer,
//       // Add any additional fields you want to format here
//     }));
//     return customers;
//   } catch (err) {
//     console.error('Database Error:', err);
//     throw new Error('Failed to fetch all customers.');
//   }
// }

// export async function fetchFilteredCustomers(
//   query: string,
//   currentPage: number,
// ) {
//   const ITEMS_PER_PAGE = 6;
//   const offset = (currentPage - 1) * ITEMS_PER_PAGE;
//   noStore();
//   try {
//     const data = await sql<CustomersTableType>`
// 		SELECT
// 		  customers.id,
// 		  customers.name,
// 		  customers.phone,
// 		  customers.image_url,
//       customers.gender,
//       customers.poin,
// 		  COUNT(invoices.id) AS total_invoices,
// 		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
// 		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
// 		FROM customers
// 		LEFT JOIN invoices ON customers.id = invoices.customer_id
// 		WHERE
// 		  customers.name ILIKE ${`%${query}%`} OR
//         customers.phone ILIKE ${`%${query}%`}
// 		GROUP BY customers.id, customers.name, customers.email, customers.image_url
// 		ORDER BY customers.name ASC
//     LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
// 	  `;

//     const customers = data.rows.map((customer) => ({
//       ...customer,
//       total_penjualan: formatCurrency(customer.total_penjualan),
//     }));

//     return customers;
//   } catch (err) {
//     console.error('Database Error:', err);
//     throw new Error('Failed to fetch customer table.');
//   }
// }


// export async function fetchCustomersPages(query: string) {
//   noStore();
//   try {
//     const count = await sql`SELECT COUNT(*)
//     FROM penjualan
//     JOIN customers ON penjualan.customerId = customers.id
//     WHERE
//       customers.name ILIKE ${`%${query}%`} OR
//       customers.email ILIKE ${`%${query}%`} OR
//       penjualan.amount::text ILIKE ${`%${query}%`} OR
//       penjualan.date::text ILIKE ${`%${query}%`} OR
//       penjualan.status ILIKE ${`%${query}%`}
//   `;
 
//     const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
//     return totalPages;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch total number of invoices.');
//   }
// }

// export async function fetchCustomerById(id: string) {
//   noStore()
//   try {
//     const data = await sql<CustomersForm>`
//       SELECT
//         customers.id,
//         customers.name,
//         customers.email,
//         customers.image_url
//       FROM customers
//       WHERE customers.id = ${id};
//     `;
 
//     const customers = data.rows.map((customer) => ({
//       ...customer,
//     }));
//     console.log(customers);
//     return customers[0];
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch customer.');
//   }
// }

// export async function fetchDistributor() {
//   try {
//     const data = await sql<DistributorField>`
//       SELECT
//         id,
//         name,
//         phone
//       FROM distributors
//       ORDER BY name ASC
//     `;

//     const distributors = data.rows;
//     return distributors;
//   } catch (err) {
//     console.error('Database Error:', err);
//     throw new Error('Failed to fetch all distributors.');
//   }
// }

// export async function fetchFilteredDistributors(
//   query: string,
//   currentPage: number,
// ) {
//   const ITEMS_PER_PAGE = 6;
//   const offset = (currentPage - 1) * ITEMS_PER_PAGE;
//   noStore();
//   try {
//     const data = await sql<DistributorTableType>`
// 		SELECT
// 		  distributor.id,
// 		  customers.name,
// 		  customers.email,
// 		  customers.image_url,
// 		  COUNT(invoices.id) AS total_invoices,
// 		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
// 		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
// 		FROM customers
// 		LEFT JOIN invoices ON customers.id = invoices.customer_id
// 		WHERE
// 		  customers.name ILIKE ${`%${query}%`} OR
//         customers.email ILIKE ${`%${query}%`}
// 		GROUP BY customers.id, customers.name, customers.email, customers.image_url
// 		ORDER BY customers.name ASC
//     LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
// 	  `;

//     const distributor = data.rows.map((distributor) => ({
//       ...distributor,
//     }));

//     return distributor;
//   } catch (err) {
//     console.error('Database Error:', err);
//     throw new Error('Failed to fetch distributor table.');
//   }
// }

// export async function fetchDistributorPages(query: string) {
//   noStore();
//   try {
//     const count = await sql`SELECT COUNT(*)
//     FROM invoices
//     JOIN customers ON invoices.customer_id = customers.id
//     WHERE
//       customers.name ILIKE ${`%${query}%`} OR
//       customers.email ILIKE ${`%${query}%`} OR
//       invoices.amount::text ILIKE ${`%${query}%`} OR
//       invoices.date::text ILIKE ${`%${query}%`} OR
//       invoices.status ILIKE ${`%${query}%`}
//   `;
 
//     const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
//     return totalPages;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch total number of invoices.');
//   }
// }

// export async function fetchDistributorById(id: string) {
//   noStore()
//   try {
//     const data = await sql<DistributorForm>`
//       SELECT
//         customers.id,
//         customers.name,
//         customers.email,
//         customers.image_url
//       FROM customers
//       WHERE customers.id = ${id};
//     `;
 
//     const distributor = data.rows.map((distributor) => ({
//       ...distributor,
//     }));
//     console.log(distributor);
//     return distributor[0];
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch distributor.');
//   }
// }

// export async function fetchProducts() {
//   noStore();
//   try {
//     const data = await sql<ProductsTableType>`
//       SELECT
//         id,
//         name,
//         stock,
//         price,
//         image_url
//       FROM products
//       ORDER BY name ASC
//     `;
    
//     const products = data.rows;
//     return products;
//   } catch (err) {
//     console.error('Database Error:', err);
//     throw new Error('Failed to fetch all products.');
//   }
// }

// export async function fetchFilteredProducts(
//   query: string,
//   currentPage: number,
// ) {
//   const ITEMS_PER_PAGE = 10; // Define or import ITEMS_PER_PAGE
//   const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  
//   try {
//     const products = await sql<ProductsTableType>`
//       SELECT
//         products.id,
//         products.name,
//         products.stock,
//         products.image_url,
//         products.price
//       FROM products
//       WHERE
//         products.name ILIKE ${`%${query}%`} OR
//         products.price::text ILIKE ${`%${query}%`}
//       ORDER BY products.name ASC
//       LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
//     `;

//     return products.rows;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch products.');
//   }
// }
 
// export async function fetchProductsPages(query: string) {
//   noStore();
//   try {
//     const count = await sql`SELECT COUNT(*)
//       FROM products
//       WHERE
//         name ILIKE ${`%${query}%`} OR
//         price::text ILIKE ${`%${query}%`}
//     `;

//     const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
//     return totalPages;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch total number of products.');
//   }
// }
 
// export async function fetchProductsById(id: string) {
//   noStore();
//   try {
//     const data = await sql<ProductForm>`
//       SELECT
//         id,
//         name,
//         stock,
//         price,
//         distributorId,
//         image_url,
//         createdAt,
//         updatedAt
//       FROM products
//       WHERE id = ${id};
//     `;

//     const product = data.rows.map((product) => ({
//       ...product,
//     }));
    
//     console.log(products); // Invoice is an empty array []
//     return product[0];
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch product.');
//   }
// }


 
 
 
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



