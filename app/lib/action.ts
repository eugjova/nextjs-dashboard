'use server';

import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { signIn } from 'next-auth/react';
import { AuthError } from 'next-auth';
import { v2 as cloudinary } from 'cloudinary';

const CustomerSchema = z.object({
  name: z.string(),
  phone: z.string(),
  gender: z.string(),
  poin: z.string(),
  image_url: z.string(),
});

const PembelianSchema = z.object({
  date: z.string(),
  pegawaiId: z.string(),
  distributorId: z.string(),
  quantity: z.string(),
  total: z.string(),
});

const PenjualanSchema = z.object({
  date: z.string(),
  customerId: z.string(),
  pegawaiId: z.string(),
  poin_used: z.coerce.number().default(0),
  total_amount: z.coerce.number(),
  total_bayar: z.coerce.number(),
});

const ProductSchema = z.object({
  name: z.string().min(3),
  stock: z.coerce.number().min(0),
  price: z.coerce.number().min(0),
  distributorId: z.string(),
  image: z.any().optional(),
});

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function createCustomer(formData: FormData) {
  try {
    const { name, phone, gender, poin } = Object.fromEntries(formData);
    
    const existingCustomer = await sql`
      SELECT * FROM customers WHERE phone = ${phone as string}
    `;
    
    if (existingCustomer.rows.length > 0) {
      return {
        success: false,
        error: 'Nomor telepon sudah terdaftar'
      };
    }

    await sql`
      INSERT INTO customers (name, phone, gender, poin)
      VALUES (${name as string}, ${phone as string}, ${gender as string}, ${poin as string})
    `;

    revalidatePath('/dashboard/customers');
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: 'Gagal membuat customer baru'
    };
  }
}

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

export async function createPembelian(formData: FormData) {
  const { date, pegawaiId, distributorId, quantity, total } = PembelianSchema.parse({
    date: formData.get('date'),
    pegawaiId: formData.get('pegawaiId'),
    distributorId: formData.get('distributorId'),
    quantity: formData.get('quantity'),
    total: String(formData.get('total'))?.replace(/[^0-9]/g, ''),
  });

  try {
    await sql`
      INSERT INTO pembelian (
        date,
        pegawaiId,
        distributorId,
        jumlah,
        total
      )
      VALUES (
        ${date},
        ${pegawaiId},
        ${distributorId},
        ${parseInt(quantity)},
        ${parseInt(total)}
      )
    `;

    revalidatePath('/dashboard/pembelian');
    return { success: true };
  } catch (error) {
    console.error('Database Error:', error);
    return { success: false, error: 'Failed to create pembelian.' };
  }
}

export async function createPenjualan(formData: FormData) {
  try {
    const rawData = {
      date: formData.get('date'),
      customerId: formData.get('customerId'),
      pegawaiId: formData.get('pegawaiId'),
      poin_used: formData.get('usedPoin') || 0,
      total_amount: String(formData.get('total'))?.replace(/[^0-9]/g, ''),
      total_bayar: String(formData.get('totalBayar'))?.replace(/[^0-9]/g, ''),
    };

    console.log('Raw form data:', rawData);

    const penjualanData = PenjualanSchema.parse(rawData);
    const earnedPoin = parseInt(formData.get('earnedPoin') as string) || 0;

    const penjualanId = crypto.randomUUID();

    await sql`
      INSERT INTO penjualan (
        id,
        date,
        customerId,
        pegawaiId,
        poin_used,
        total_amount,
        total_bayar
      ) VALUES (
        ${penjualanId},
        ${penjualanData.date},
        ${penjualanData.customerId},
        ${penjualanData.pegawaiId},
        ${penjualanData.poin_used},
        ${penjualanData.total_amount},
        ${penjualanData.total_bayar}
      )
    `;

    await sql`
      UPDATE customers 
      SET poin = poin - ${penjualanData.poin_used} + ${earnedPoin}
      WHERE id = ${penjualanData.customerId}
    `;

    const productCount = parseInt(formData.get('productCount') as string);
    console.log('Product count:', productCount);

    for (let i = 0; i < productCount; i++) {
      const productId = formData.get(`product-${i}`) as string;
      const quantity = parseInt(formData.get(`quantity-${i}`) as string);
      const price = parseInt(String(formData.get(`price-${i}`))?.replace(/[^0-9]/g, ''));
      
      console.log(`Product ${i}:`, { productId, quantity, price });

      if (!productId || isNaN(quantity) || isNaN(price)) {
        console.error(`Invalid product data at index ${i}`);
        continue;
      }

      const subtotal = quantity * price;

      await sql`
        INSERT INTO penjualan_items (
          id,
          penjualan_id,
          product_id,
          quantity,
          price_per_item,
          subtotal
        ) VALUES (
          ${crypto.randomUUID()},
          ${penjualanId},
          ${productId as string},
          ${quantity},
          ${price},
          ${subtotal}
        )
      `;

      await sql`
        UPDATE products 
        SET stock = stock - ${quantity}
        WHERE id = ${productId}
      `;
    }

    revalidatePath('/dashboard/penjualan');
    return { success: true };
  } catch (error) {
    console.error('Database Error:', error);
    return { success: false, error: String(error) };
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
  try {
    const { name, phone, gender, email, password } = Object.fromEntries(formData);

    const existingPegawai = await sql`
      SELECT * FROM pegawai 
      WHERE email = ${email as string} OR phone = ${phone as string}
    `;
    
    if (existingPegawai.rows.length > 0) {
      return {
        success: false,
        error: 'Email atau nomor telepon sudah terdaftar'
      };
    }

    await sql`
      INSERT INTO pegawai (name, phone, gender, email, password)
      VALUES (${name as string}, ${phone as string}, ${gender as string}, ${email as string}, ${password as string})
    `;

    revalidatePath('/dashboard/pegawai');
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: 'Gagal membuat pegawai baru'
    };
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

export async function deleteProduct(id: string) {
  try {
    const checkPenjualan = await sql`
      SELECT COUNT(*) as count 
      FROM penjualan_items 
      WHERE product_id = ${id}
    `;

    if (checkPenjualan.rows[0].count > 0) {
      return { 
        success: false, 
        error: 'Produk tidak dapat dihapus karena masih terkait dengan data penjualan' 
      };
    }

    await sql`DELETE FROM products WHERE id = ${id}`;
    revalidatePath('/dashboard/products');
    return { success: true };
  } catch (error) {
    console.error('Error deleting product:', error);
    return { 
      success: false, 
      error: 'Gagal menghapus produk. Silakan coba lagi.' 
    };
  }
}

export async function createProduct(formData: FormData) {
  try {
    const validatedData = ProductSchema.parse({
      name: formData.get('name'),
      stock: formData.get('stock'),
      price: formData.get('price'),
      distributorId: formData.get('distributorId'),
      image: formData.get('image'),
    });

    let imageUrl = 'products/default';

    const file = formData.get('image') as File;
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({
          folder: 'products',
          resource_type: 'auto',
          transformation: [
            { width: 800, height: 600, crop: 'fill' },
            { quality: 'auto:good' },
            { fetch_format: 'auto' }
          ],
          eager: [
            { width: 400, height: 300, crop: 'fill' },
            { width: 200, height: 150, crop: 'fill' }
          ],
          eager_async: true,
          fallback: imageUrl
        }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }).end(buffer);
      });

      imageUrl = (result as any).public_id;
    }

    await sql`
      INSERT INTO products (name, stock, price, distributorId, image_url)
      VALUES (${validatedData.name}, ${validatedData.stock}, ${validatedData.price}, ${validatedData.distributorId}, ${imageUrl})
    `;

    revalidatePath('/dashboard/products');
    return { success: true };
  } catch (error) {
    console.error('Error creating product:', error);
    return {
      success: false,
      error: 'Gagal membuat produk baru'
    };
  }
}

export async function updateProduct(id: string, formData: FormData) {
  try {
    const validatedData = ProductSchema.parse({
      name: formData.get('name'),
      stock: formData.get('stock'),
      price: formData.get('price'),
      distributorId: formData.get('distributorId'),
      image: formData.get('image'),
    });

    const existingProduct = await sql`
      SELECT * FROM products 
      WHERE name = ${validatedData.name} 
      AND id != ${id}
    `;
    
    if (existingProduct.rows.length > 0) {
      return {
        success: false,
        error: 'Nama produk sudah digunakan'
      };
    }

    let imageUrl = undefined;
    const file = formData.get('image') as File;
    
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({
          folder: 'products',
          resource_type: 'auto',
          transformation: [
            { width: 800, height: 600, crop: 'fill' },
            { quality: 'auto:good' },
            { fetch_format: 'auto' }
          ],
        }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }).end(buffer);
      });

      imageUrl = (result as any).public_id;
    }

    if (imageUrl) {
      await sql`
        UPDATE products
        SET name = ${validatedData.name}, 
            stock = ${validatedData.stock}, 
            price = ${validatedData.price},
            distributorId = ${validatedData.distributorId},
            image_url = ${imageUrl},
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
      `;
    } else {
      await sql`
        UPDATE products
        SET name = ${validatedData.name}, 
            stock = ${validatedData.stock}, 
            price = ${validatedData.price},
            distributorId = ${validatedData.distributorId},
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
      `;
    }

    revalidatePath('/dashboard/products');
    return { success: true };
  } catch (error) {
    console.error('Error updating product:', error);
    return { 
      success: false, 
      error: 'Gagal mengupdate produk' 
    };
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
