'use server';

import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { signIn } from 'next-auth/react';
import { AuthError } from 'next-auth';
import bcrypt from 'bcrypt';

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

async function getCloudinary() {
  const cloudinary = await import('cloudinary');
  const cloudinaryV2 = cloudinary.v2;
  
  cloudinaryV2.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  return cloudinaryV2;
}

async function uploadToCloudinary(buffer: Buffer, options: any) {
  const cloudinaryV2 = await getCloudinary();
  
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinaryV2.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
}

const CreateDistributor = z.object({
  name: z.string({
    required_error: 'Nama wajib diisi',
  }).min(1, 'Nama wajib diisi'),
  phone: z.string({
    required_error: 'Nomor telepon wajib diisi',
  }).min(10, 'Nomor telepon minimal 10 digit').max(13, 'Nomor telepon maksimal 13 digit'),
});

const UpdateDistributor = z.object({
  id: z.string({
    required_error: 'ID wajib diisi',
  }),
  name: z.string({
    required_error: 'Nama wajib diisi',
  }).min(1, 'Nama wajib diisi'),
  phone: z.string({
    required_error: 'Nomor telepon wajib diisi',
  }).min(10, 'Nomor telepon minimal 10 digit').max(13, 'Nomor telepon maksimal 13 digit'),
});

export async function createCustomer(formData: FormData) {
  try {
    const name = formData.get('name')?.toString();
    const phone = formData.get('phone')?.toString();
    const gender = formData.get('gender')?.toString();
    const poin = formData.get('poin')?.toString() || '0';
    const image = formData.get('image') as File | null;

    if (!name || !phone || !gender) {
      return {
        success: false,
        error: 'Data tidak lengkap'
      };
    }

    const existingPhone = await sql`
      SELECT id FROM customers WHERE phone = ${phone}
    `;
    
    if (existingPhone.rows.length > 0) {
      return {
        success: false,
        error: 'Nomor telepon sudah terdaftar'
      };
    }

    let imageId = 'default_dafhf7';

    if (image && image instanceof File && image.size > 0) {
      try {
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        const result = await uploadToCloudinary(buffer, {
          folder: 'customers',
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
        });

        imageId = (result as any).public_id;
      } catch (uploadError) {
        console.error('Error uploading image:', uploadError);
      }
    }

    const currentDate = new Date().toISOString();

    await sql`
      INSERT INTO customers (
        id, 
        name, 
        phone, 
        gender, 
        poin, 
        image_url, 
        createdat, 
        updatedat
      )
      VALUES (
        ${crypto.randomUUID()}, 
        ${name}, 
        ${phone}, 
        ${gender}, 
        ${parseInt(poin)}, 
        ${imageId},
        ${currentDate},
        ${currentDate}
      )
    `;

    revalidatePath('/dashboard/customers');
    return { success: true };

  } catch (error) {
    console.error('Error in createCustomer:', error);
    return {
      success: false,
      error: 'Gagal membuat customer'
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

    const penjualanData = PenjualanSchema.parse(rawData);
    const earnedPoin = parseInt(formData.get('earnedPoin') as string) || 0;
    const productCount = parseInt(formData.get('productCount') as string);

    const penjualanId = crypto.randomUUID();

    await sql`
      INSERT INTO penjualan (
        id,
        date,
        customerId,
        pegawaiId,
        total_items,
        poin_used,
        total_amount,
        total_bayar
      ) VALUES (
        ${penjualanId},
        ${penjualanData.date},
        ${penjualanData.customerId},
        ${penjualanData.pegawaiId},
        ${productCount},
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

    for (let i = 0; i < productCount; i++) {
      const productId = formData.get(`product-${i}`) as string;
      const quantity = parseInt(formData.get(`quantity-${i}`) as string);
      const price = parseInt(String(formData.get(`price-${i}`))?.replace(/[^0-9]/g, ''));

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

export async function updateCustomer(formData: FormData) {
  try {
    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const gender = formData.get('gender') as string;
    const poin = formData.get('poin') as string;
    const image = formData.get('image') as File | null;

    if (!id || !name || !phone || !gender) {
      return {
        success: false,
        error: 'Data tidak lengkap'
      };
    }

    const existingPhone = await sql`
      SELECT id FROM customers 
      WHERE phone = ${phone} AND id != ${id}
    `;
    
    if (existingPhone.rows.length > 0) {
      return {
        success: false,
        error: 'Nomor telepon sudah digunakan customer lain'
      };
    }

    let imageId;

    if (image && image instanceof File && image.size > 0) {
      try {
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        const result = await uploadToCloudinary(buffer, {
          folder: 'customers',
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
        });

        imageId = (result as any).public_id;
      } catch (uploadError) {
        console.error('Error uploading image:', uploadError);
      }
    }

    if (imageId) {
      await sql`
        UPDATE customers
        SET 
          name = ${name}, 
          phone = ${phone}, 
          gender = ${gender}, 
          poin = ${parseInt(poin)},
          image_url = ${imageId}
        WHERE id = ${id}
      `;
    } else {
      await sql`
        UPDATE customers
        SET 
          name = ${name}, 
          phone = ${phone}, 
          gender = ${gender}, 
          poin = ${parseInt(poin)}
        WHERE id = ${id}
      `;
    }

    revalidatePath('/dashboard/customers');
    return { success: true };
  } catch (error) {
    console.error('Error in updateCustomer:', error);
    return { 
      success: false, 
      error: 'Gagal mengupdate customer' 
    };
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

export async function updateDistributors(formData: FormData) {
  try {
    const validatedFields = UpdateDistributor.safeParse({
      id: formData.get('id'),
      name: formData.get('name'),
      phone: formData.get('phone'),
    });

    if (!validatedFields.success) {
      return {
        success: false,
        error: validatedFields.error.errors[0].message
      };
    }

    const { id, name, phone } = validatedFields.data;
    const updatedAt = new Date().toISOString();

    const existingPhone = await sql`
      SELECT id FROM distributors 
      WHERE phone = ${phone} AND id != ${id}
    `;
    
    if (existingPhone.rows.length > 0) {
      return {
        success: false,
        error: 'Nomor telepon sudah digunakan distributor lain'
      };
    }

    await sql`
      UPDATE distributors
      SET name = ${name}, phone = ${phone}, updatedat = ${updatedAt}
      WHERE id = ${id}
    `;

    revalidatePath('/dashboard/distributors');
    return { success: true };
  } catch (error) {
    console.error('Database Error:', error);
    return {
      success: false,
      error: 'Gagal mengupdate distributor'
    };
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

const PegawaiSchema = z.object({
  name: z.string({
    required_error: 'Nama wajib diisi',
  }).min(1, 'Nama wajib diisi'),
  phone: z.string({
    required_error: 'Nomor telepon wajib diisi',
  }).min(1, 'Nomor telepon wajib diisi'),
  gender: z.string({
    required_error: 'Gender wajib diisi',
  }).min(1, 'Gender wajib diisi'),
  email: z.string({
    required_error: 'Email wajib diisi',
  }).email('Format email tidak valid'),
  password: z.string({
    required_error: 'Password wajib diisi',
  }).min(6, 'Password minimal 6 karakter'),
});

export async function createPegawai(formData: FormData) {
  try {
    const validatedFields = PegawaiSchema.safeParse({
      name: formData.get('name'),
      phone: formData.get('phone'),
      gender: formData.get('gender'),
      email: formData.get('email'),
      password: formData.get('password'),
    });

    if (!validatedFields.success) {
      return {
        success: false,
        error: validatedFields.error.errors[0].message || 'Data tidak valid. Periksa kembali input Anda.'
      };
    }

    const { name, phone, gender, email, password } = validatedFields.data;
    
    const existingEmail = await sql`
      SELECT id FROM pegawai WHERE email = ${email}
    `;
    
    if (existingEmail.rows.length > 0) {
      return {
        success: false,
        error: 'Email sudah terdaftar, gunakan email lain'
      };
    }

    const existingPhone = await sql`
      SELECT id FROM pegawai WHERE phone = ${phone}
    `;
    
    if (existingPhone.rows.length > 0) {
      return {
        success: false,
        error: 'Nomor telepon sudah terdaftar, gunakan nomor lain'
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = crypto.randomUUID();
    
    const roleData = await sql`
      SELECT id FROM roles WHERE name = 'Pegawai' LIMIT 1
    `;
    
    if (roleData.rows.length === 0) {
      return {
        success: false,
        error: 'Role pegawai tidak ditemukan'
      };
    }
    
    const id_role = roleData.rows[0].id;
    const currentDate = new Date().toISOString();

    await sql`
      INSERT INTO pegawai (
        id,
        id_role, 
        name, 
        phone, 
        gender, 
        email, 
        password,
        createdat,
        updatedat
      )
      VALUES (
        ${id},
        ${id_role},
        ${name}, 
        ${phone}, 
        ${gender}, 
        ${email}, 
        ${hashedPassword},
        ${currentDate},
        ${currentDate}
      )
    `;

    revalidatePath('/dashboard/pegawai');
    return { success: true };
  } catch (error) {
    console.error('Database Error:', error);
    return {
      success: false,
      error: 'Gagal membuat pegawai baru'
    };
  }
}

const UpdatePegawaiSchema = z.object({
  name: z.string({
    required_error: 'Nama wajib diisi',
  }).min(1, 'Nama wajib diisi'),
  phone: z.string({
    required_error: 'Nomor telepon wajib diisi',
  }).min(1, 'Nomor telepon wajib diisi'),
  gender: z.string({
    required_error: 'Gender wajib diisi',
  }).min(1, 'Gender wajib diisi'),
  email: z.string({
    required_error: 'Email wajib diisi',
  }).email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter').optional(),
});

export async function updatePegawai(id: string, formData: FormData) {
  try {
    const validatedFields = UpdatePegawaiSchema.safeParse({
      name: formData.get('name'),
      phone: formData.get('phone'),
      gender: formData.get('gender'),
      email: formData.get('email'),
      password: formData.get('password') || undefined,
    });

    if (!validatedFields.success) {
      return {
        success: false,
        error: validatedFields.error.errors[0].message
      };
    }

    const { name, phone, gender, email, password } = validatedFields.data;

    const existingData = await sql`
      SELECT id FROM pegawai 
      WHERE (email = ${email} OR phone = ${phone})
      AND id != ${id}
    `;

    if (existingData.rows.length > 0) {
      return {
        success: false,
        error: 'Email atau nomor telepon sudah digunakan oleh pegawai lain'
      };
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await sql`
        UPDATE pegawai
        SET 
          name = ${name},
          phone = ${phone},
          gender = ${gender},
          email = ${email},
          password = ${hashedPassword},
          updatedat = ${new Date().toISOString()}
        WHERE id = ${id}
      `;
    } else {
      await sql`
        UPDATE pegawai
        SET 
          name = ${name},
          phone = ${phone},
          gender = ${gender},
          email = ${email},
          updatedat = ${new Date().toISOString()}
        WHERE id = ${id}
      `;
    }

    revalidatePath('/dashboard/pegawai');
    return { success: true };
  } catch (error) {
    console.error('Database Error:', error);
    return { 
      success: false, 
      error: 'Gagal mengupdate data pegawai' 
    };
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
      
      const result = await uploadToCloudinary(buffer, {
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
      
      const result = await uploadToCloudinary(buffer, {
        folder: 'products',
        resource_type: 'auto',
        transformation: [
          { width: 800, height: 600, crop: 'fill' },
          { quality: 'auto:good' },
          { fetch_format: 'auto' }
        ],
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
  try {
    const validatedFields = CreateDistributor.safeParse({
      name: formData.get('name'),
      phone: formData.get('phone'),
    });

    if (!validatedFields.success) {
      return {
        success: false,
        error: validatedFields.error.errors[0].message
      };
    }

    const { name, phone } = validatedFields.data;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const existingPhone = await sql`
      SELECT id FROM distributors WHERE phone = ${phone}
    `;
    
    if (existingPhone.rows.length > 0) {
      return {
        success: false,
        error: 'Nomor telepon sudah digunakan'
      };
    }

    await sql`
      INSERT INTO distributors (name, phone, createdat, updatedat)
      VALUES (${name}, ${phone}, ${createdAt}, ${updatedAt})
    `;

    revalidatePath('/dashboard/distributors');
    return { success: true };
  } catch (error) {
    console.error('Database Error:', error);
    return {
      success: false,
      error: 'Gagal membuat distributor'
    };
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

if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 
    !process.env.CLOUDINARY_API_KEY || 
    !process.env.CLOUDINARY_API_SECRET) {
  console.warn('Cloudinary environment variables belum dikonfigurasi');
}