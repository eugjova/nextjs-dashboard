'use server';

import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { signIn } from 'next-auth/react';
import { AuthError } from 'next-auth';

// Schema untuk Customer
const CustomerSchema = z.object({
  name: z.string(),
  phone: z.string(),
  gender: z.string(),
  poin: z.string(),
  image_url: z.string(),
});

// Schema untuk Pembelian
const PembelianSchema = z.object({
  date: z.string(),
  id_pegawai: z.string(),
  id_distributor: z.string(),
  jumlah: z.string(),
  total: z.string(),
});

// Schema untuk Penjualan
const PenjualanSchema = z.object({
  date: z.string(),
  productId: z.string(),
  customerId: z.string(),
  pegawaiId: z.string(),
  quantity: z.string(),
  total: z.string(),
  totalBayar: z.string(),
  usedPoin: z.coerce.number().optional(),
  earnedPoin: z.coerce.number(),
});

// Fungsi Create Customer
export async function createCustomer(formData: FormData) {
  const { name, phone, gender, poin, image_url } = CustomerSchema.parse({
    name: formData.get('name'),
    phone: formData.get('phone'),
    gender: formData.get('gender'),
    poin: formData.get('poin'),
    image_url: formData.get('image_url') || '/customers/default.png',
  });

  try {
    await sql`
      INSERT INTO customers (name, phone, gender, poin, image_url)
      VALUES (${name}, ${phone}, ${gender}, ${parseInt(poin)}, ${image_url})
    `;

    revalidatePath('/dashboard/customers');
    return { success: true };
  } catch (error) {
    console.error('Database Error:', error);
    return { success: false, error: 'Failed to create customer.' };
  }
}

// Fungsi Delete Customer
export async function deleteCustomer(id: string) {
  try {
    await sql`DELETE FROM customers WHERE id = ${id}`;
    revalidatePath('/dashboard/customers');
    return { success: true };
  } catch (error) {
    console.error('Database Error:', error);
    return { success: false, error: 'Failed to delete customer.' };
  }
}

// Fungsi Create Pembelian
export async function createPembelian(formData: FormData) {
  const { date, id_pegawai, id_distributor, jumlah, total } = PembelianSchema.parse({
    date: formData.get('date'),
    id_pegawai: formData.get('id_pegawai'),
    id_distributor: formData.get('id_distributor'),
    jumlah: formData.get('jumlah'),
    total: formData.get('total'),
  });

  try {
    await sql`
      INSERT INTO pembelian (date, id_pegawai, id_distributor, jumlah, total)
      VALUES (${date}, ${id_pegawai}, ${id_distributor}, ${parseInt(jumlah)}, ${parseInt(total)})
    `;

    revalidatePath('/dashboard/pembelian');
    return { success: true };
  } catch (error) {
    console.error('Database Error:', error);
    return { success: false, error: 'Failed to create pembelian.' };
  }
}

// Fungsi Create Penjualan
export async function createPenjualan(formData: FormData) {
  const { date, productId, customerId, pegawaiId, quantity, total, totalBayar, usedPoin, earnedPoin } = PenjualanSchema.parse({
    date: formData.get('date'),
    productId: formData.get('productId'),
    customerId: formData.get('customerId'),
    pegawaiId: formData.get('pegawaiId'),
    quantity: formData.get('quantity'),
    total: String(formData.get('total'))?.replace(/[^0-9]/g, ''),
    totalBayar: String(formData.get('totalBayar'))?.replace(/[^0-9]/g, ''),
    usedPoin: formData.get('usedPoin'),
    earnedPoin: formData.get('earnedPoin'),
  });

  try {
    // 1. Insert penjualan
    const result = await sql`
      INSERT INTO penjualan (
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
        ${date},
        ${productId},
        ${customerId},
        ${pegawaiId},
        ${parseInt(quantity)},
        ${parseInt(total)},
        ${parseInt(totalBayar)},
        ${usedPoin || 0}
      )
      RETURNING id
    `;

    // 2. Update stok produk
    await sql`
      UPDATE products 
      SET stock = stock - ${parseInt(quantity)}
      WHERE id = ${productId}
    `;

    // 3. Update poin customer
    if (usedPoin) {
      // Kurangi poin jika menggunakan poin
      await sql`
        UPDATE customers 
        SET poin = poin - ${usedPoin}
        WHERE id = ${customerId}
      `;
    } else if (earnedPoin > 0) {
      // Tambah poin baru jika tidak menggunakan poin
      await sql`
        UPDATE customers 
        SET poin = poin + ${earnedPoin}
        WHERE id = ${customerId}
      `;
    }

    revalidatePath('/dashboard/penjualan');
    return { success: true };
  } catch (error) {
    console.error('Database Error:', error);
    return { success: false, error: 'Failed to create penjualan.' };
  }
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

// Customer
export async function updateCustomer(id: string, formData: FormData) {
  const { name, phone, gender, poin } = CustomerSchema.parse({
    name: formData.get('name'),
    phone: formData.get('phone'), 
    gender: formData.get('gender'),
    poin: formData.get('poin'),
  });

  try {
    await sql`
      UPDATE customers
      SET name = ${name}, phone = ${phone}, gender = ${gender}, poin = ${parseInt(poin)}
      WHERE id = ${id}
    `;
    revalidatePath('/dashboard/customers');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to update customer.' };
  }
}

// Distributor
export async function deleteDistributors(id: string) {
  try {
    await sql`DELETE FROM distributors WHERE id = ${id}`;
    revalidatePath('/dashboard/distributors');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete distributor.' };
  }
}

export async function updateDistributors(id: string, formData: FormData) {
  const { name, phone } = z.object({
    name: z.string(),
    phone: z.string()
  }).parse({
    name: formData.get('name'),
    phone: formData.get('phone')
  });

  try {
    await sql`
      UPDATE distributors 
      SET name = ${name}, phone = ${phone}
      WHERE id = ${id}
    `;
    revalidatePath('/dashboard/distributors');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to update distributor.' };
  }
}

// Pegawai
export async function deletePegawai(id: string) {
  try {
    await sql`DELETE FROM pegawai WHERE id = ${id}`;
    revalidatePath('/dashboard/pegawai');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete pegawai.' };
  }
}

export async function createPegawai(formData: FormData) {
  const { name, phone, gender, email, password } = z.object({
    name: z.string(),
    phone: z.string(),
    gender: z.string(),
    email: z.string().email(),
    password: z.string().min(6)
  }).parse({
    name: formData.get('name'),
    phone: formData.get('phone'),
    gender: formData.get('gender'),
    email: formData.get('email'),
    password: formData.get('password')
  });

  try {
    await sql`
      INSERT INTO pegawai (name, phone, gender, email, password)
      VALUES (${name}, ${phone}, ${gender}, ${email}, ${password})
    `;
    revalidatePath('/dashboard/pegawai');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to create pegawai.' };
  }
}

export async function updatePegawai(id: string, formData: FormData) {
  const { name, phone, gender, email, password } = z.object({
    name: z.string(),
    phone: z.string(),
    gender: z.string(),
    email: z.string().email(),
    password: z.string().min(6)
  }).parse({
    name: formData.get('name'),
    phone: formData.get('phone'),
    gender: formData.get('gender'),
    email: formData.get('email'),
    password: formData.get('password')
  });

  try {
    await sql`
      UPDATE pegawai
      SET name = ${name}, phone = ${phone}, gender = ${gender}, 
          email = ${email}, password = ${password}
      WHERE id = ${id}
    `;
    revalidatePath('/dashboard/pegawai');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to update pegawai.' };
  }
}

// Product
export async function deleteProduct(id: string) {
  try {
    await sql`DELETE FROM products WHERE id = ${id}`;
    revalidatePath('/dashboard/products');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete product.' };
  }
}

export async function createProduct(formData: FormData) {
  const { name, stock, price, image_url } = z.object({
    name: z.string(),
    stock: z.string(),
    price: z.string(),
    image_url: z.string()
  }).parse({
    name: formData.get('name'),
    stock: formData.get('stock'),
    price: formData.get('price'),
    image_url: formData.get('image_url') || '/products/default.png'
  });

  try {
    await sql`
      INSERT INTO products (name, stock, price, image_url)
      VALUES (${name}, ${parseInt(stock)}, ${parseInt(price)}, ${image_url})
    `;
    revalidatePath('/dashboard/products');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to create product.' };
  }
}

export async function updateProduct(id: string, formData: FormData) {
  const { name, stock, price, image_url } = z.object({
    name: z.string(),
    stock: z.string(),
    price: z.string(),
    image_url: z.string()
  }).parse({
    name: formData.get('name'),
    stock: formData.get('stock'),
    price: formData.get('price'),
    image_url: formData.get('image_url')
  });

  try {
    await sql`
      UPDATE products
      SET name = ${name}, stock = ${parseInt(stock)}, 
          price = ${parseInt(price)},
          image_url = ${image_url}
      WHERE id = ${id}
    `;
    revalidatePath('/dashboard/products');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to update product.' };
  }
}

export async function createDistributors(formData: FormData) {
  const { name, phone } = z.object({
    name: z.string(),
    phone: z.string()
  }).parse({
    name: formData.get('name'),
    phone: formData.get('phone')
  });

  try {
    await sql`
      INSERT INTO distributors (name, phone)
      VALUES (${name}, ${phone})
    `;
    
    revalidatePath('/dashboard/distributors');
    return { success: true };
  } catch (error) {
    console.error('Database Error:', error);
    return { success: false, error: 'Failed to create distributor.' };
  }
}

export async function deleteInvoice(id: string) {
  try {
    await sql`DELETE FROM pembelian WHERE id = ${id}`;
    revalidatePath('/dashboard/pembelian');
    return { success: true };
  } catch (error) {
    console.error('Database Error:', error);
    return { success: false, error: 'Failed to delete pembelian.' };
  }
}
