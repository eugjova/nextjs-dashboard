'use server';
 
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
  
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  productId: z.string(),
  quantity: z.coerce.number(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});

const FormProductSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  price: z.coerce.number(),
  stock: z.coerce.number(),
  image_url: z.string(),
});

const FormServiceSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  price: z.coerce.number(),
  estimation: z.coerce.number(),
});

const FormSchemaCustomer = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  image_url: z.string(),
});


const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

const CreateProduct = FormProductSchema.omit({ id: true });
const UpdateProduct = FormProductSchema.omit({ id: true });

const CreateService = FormServiceSchema.omit({ id: true });
const UpdateService = FormServiceSchema.omit({ id: true });

const CreateCustomer = FormSchemaCustomer.omit({ id: true, date: true });
const UpdateCustomer = FormSchemaCustomer.omit({ id: true, date: true });


export async function createCustomer(formData: FormData) {
  const img = formData.get('image');
  console.log(img);
 
  let filename = '';
  if (img instanceof File) {
    filename = '/customers/' + img.name;
    console.log(filename);
  };
 
  const { name, email, image_url } = CreateCustomer.parse({
    name : formData.get('name'), // Ensure name has a value
    email : formData.get('email'), // Ensure email has a value
    image_url : filename,
  });
 
  try {
    await sql`
      INSERT into customers (name, email, image_url)
      VALUES (${name}, ${email}, ${image_url})
      RETURNING id
      `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Update Customer.',
    };
  }
 
  revalidatePath('/dashboard/customers');
  redirect('/dashboard/customers');
}

export async function updateCustomer(id: string, formData: FormData) {
  const img = formData.get('image');
  console.log(img);
 
  let filename = '';
  if (img instanceof File) {
    filename = '/customers/' + img.name;
    console.log(filename);
  };
 
  const { name, email, image_url } = UpdateCustomer.parse({
    name : formData.get('name'), // Ensure name has a value
    email : formData.get('email'), // Ensure email has a value
    image_url : filename,
  });
 
  try {
    await sql`
    UPDATE customers
      SET name = ${name}, email = ${email}, image_url = ${image_url}
      WHERE id = ${id}
      `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Update Customer.',
    };
  }
 
  revalidatePath('/dashboard/customers');
  redirect('/dashboard/customers');
}

export async function deleteCustomer(id: string) {
  // throw new Error('Failed to Delete Invoice');
 
  try {
    await sql`DELETE FROM customers WHERE id = ${id}`;
    revalidatePath('/dashboard/customers');
    return { message: 'Deleted Customer.' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Customer.' };
  }
}

export async function createInvoice(formData: FormData) {
  const { customerId, productId, quantity, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    productId: formData.get('productId'),
    quantity: formData.get('quantity'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  const date = new Date().toISOString().split('T')[0];

  await sql`
    INSERT INTO invoices (customer_id, product_id, quantity, amount, status, date)
    VALUES (${customerId}, ${productId}, ${quantity}, ${amount}, ${status}, ${date})
  `;

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, productId, quantity, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    productId: formData.get('productId'),
    quantity: formData.get('quantity'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, product_id = ${productId}, quantity = ${quantity}, amount = ${amount}, status = ${status}
    WHERE id = ${id}
  `;
 
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath('/dashboard/invoices');
}

export async function createProduct(formData: FormData) {
  const img = formData.get('image');
  console.log(img);

  let fileName = '';
  if (img instanceof File) {
    fileName = '/products/'+ img.name;
    console.log(fileName);
  }

  const { name, price, stock, image_url } = CreateProduct.parse({
    name: formData.get('name'),
    price: formData.get('price'),
    stock: formData.get('stock'),
    image_url: fileName,
  });

  try {
  await sql`
    INSERT INTO products (name, price, stock, image_url)
    VALUES (${name}, ${price}, ${stock}, ${image_url})
  `;
} catch (error) {
  return {
    message: 'Database Error: Failed to Create Products.',
  };
}


  revalidatePath('/dashboard/products');
  redirect('/dashboard/products');
}

export async function updateProduct(id: string, formData: FormData) {
  const img = formData.get('image');
  console.log(img);

  let fileName = '';
  if (img instanceof File) {
    fileName = '/products/'+ img.name;
    console.log(fileName);
  }

  const { name, price, stock, image_url } = UpdateProduct.parse({
    name: formData.get('name'),
    price: formData.get('price'),
    stock: formData.get('stock'),
    image_url: formData.get('image_url'),
  });

  await sql`
    UPDATE products
    SET name = ${name}, price = ${price}, stock = ${stock}, image_url = ${image_url}
    WHERE id = ${id}
  `;

  revalidatePath('/dashboard/products');
  redirect('/dashboard/products');
}

export async function deleteProduct(id: string) {
  await sql`DELETE FROM products WHERE id = ${id}`;
  revalidatePath('/dashboard/products');
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
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

export async function createService(formData: FormData) {
  const { name, price, estimation } = CreateService.parse({
    name: formData.get('name'),
    price: formData.get('price'),
    estimation: formData.get('estimation'),
  });

  await sql`
    INSERT INTO services (name, price, estimation)
    VALUES (${name}, ${price}, ${estimation})
  `;

  revalidatePath('/dashboard/services');
  redirect('/dashboard/services');
}

export async function updateService(id: string, formData: FormData) {
  const { name, price, estimation } = UpdateService.parse({
    name: formData.get('name'),
    price: formData.get('price'),
    estimation: formData.get('estimation'),
  });
 
  await sql`
  UPDATE services
  SET name = ${name}, price = ${price}, estimation = ${estimation}
  WHERE id = ${id}
`;

revalidatePath('/dashboard/services');
redirect('/dashboard/services');
}

export async function deleteService(id: string) {
  await sql`DELETE FROM services WHERE id = ${id}`;
  revalidatePath('/dashboard/services');
}