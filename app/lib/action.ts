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

const FormDistributorSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  phone: z.string(),
});

const FormSchemaCustomer = z.object({
  id: z.string().optional(),
  name: z.string(),
  phone: z.string(),
  gender: z.string(),
  poin: z.string(),
  image_url: z.string(),
});

const FormSchemaPegawai = z.object({
  id: z.string().optional(),
  name: z.string(),
  phone: z.string(),
  gender: z.string(),
  email: z.string(),
  password: z.string(),
});


const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

const CreateProduct = FormProductSchema.omit({ id: true });
const UpdateProduct = FormProductSchema.omit({ id: true });

const CreateDistributors = FormDistributorSchema.omit({ id: true });
const UpdateDistributors = FormDistributorSchema.omit({ id: true });

const CreateCustomer = FormSchemaCustomer.omit({ id: true});
const UpdateCustomer = FormSchemaCustomer.omit({ id: true });

const CreatePegawai = FormSchemaPegawai.omit({ id: true});
const UpdatePegawai = FormSchemaPegawai.omit({ id: true });



export async function createCustomer(formData: FormData) {
  const img = formData.get('image');
  console.log(img);
 
  let filename = '';
  if (img instanceof File) {
    filename = '/customers/' + img.name;
    console.log(filename);
  };
 
  const { name, phone, gender, poin, image_url } = CreateCustomer.parse({
    name : formData.get('name'), // Ensure name has a value
    phone : formData.get('phone'), // Ensure email has a value
    gender : formData.get('gender'),
    poin : formData.get('poin'),
    image_url : filename,
  });
 
  try {
    await sql`
      INSERT into customers (name, phone, gender, poin, image_url)
      VALUES (${name}, ${phone}, ${gender}, ${poin} ${image_url})
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
 
  const { name, phone, gender, poin, image_url } = UpdateCustomer.parse({
    name : formData.get('name'), // Ensure name has a value
    phone : formData.get('phone'), // Ensure email has a value
    gender : formData.get('gender'),
    poin : formData.get('poin'),
    image_url : filename,
  });
 
  try {
    await sql`
    UPDATE customers
      SET name = ${name}, phone = ${phone}, gender = ${gender}, poin = ${poin}, image_url = ${image_url}
      WHERE id = ${id}`;
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

export async function createPegawai(formData: FormData) {
  const img = formData.get('image');
  console.log(img);
 
  let filename = '';
  if (img instanceof File) {
    filename = '/pegawai/' + img.name;
    console.log(filename);
  };
 
  const name = formData.get('name') as string | null;
  const phone = formData.get('phone') as string | null;
  const gender = formData.get('gender') as string | null;
  const email = formData.get('email') as string | null;
  const password = formData.get('password') as string | null;

  // Check for required fields and handle errors
  if (!name || !phone || !gender || !email || !password) {
    return {
      message: 'Validation Error: Missing required fields.',
      errorDetails: [
        { field: 'name', received: name },
        { field: 'phone', received: phone },
        { field: 'gender', received: gender },
        { field: 'email', received: email },
        { field: 'password', received: password },
      ]
    };
  }

  // Validate form data structure
  const parsedData = CreatePegawai.safeParse({
    name,
    phone,
    gender,
    email,
    password
  });

  if (!parsedData.success) {
    return {
      message: 'Validation Error: Invalid input data.',
      errorDetails: parsedData.error.errors,
    };
  }

  // Insert data into database
  try {
    await sql`
      INSERT INTO pegawai (name, phone, gender, email, password, image_path)
      VALUES (${name}, ${phone}, ${gender}, ${email}, ${password}, ${filename})
      RETURNING id
    `;
  } catch (error) {
    console.error('Database error:', error);
    return {
      message: 'Database Error: Failed to create Pegawai record.',
    };
  }

  // Revalidate path and redirect
  revalidatePath('/dashboard/pegawai');
  redirect('/dashboard/pegawai');
}

export async function updatePegawai(id: string, formData: FormData) {
  const { name, phone, gender, email, password } = UpdatePegawai.parse({
    name : formData.get('name'), // Ensure name has a value
    phone : formData.get('phone'), // Ensure email has a value
    gender : formData.get('gender'),
    email : formData.get('email'),
    password : formData.get('password'),
  });
 
  try {
    await sql`
    UPDATE pegawai
      SET name = ${name}, phone = ${phone}, gender = ${gender}, email = ${email}, password = ${password}
      WHERE id = ${id}`;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Update Pegawai.',
    };
  }
 
  revalidatePath('/dashboard/pegawai');
  redirect('/dashboard/pegawai');
}

export async function deletePegawai(id: string) {
  // throw new Error('Failed to Delete Invoice');
 
  try {
    await sql`DELETE FROM pegawai WHERE id = ${id}`;
    revalidatePath('/dashboard/pegawai');
    return { message: 'Deleted Pegawai.' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Pegawai.' };
  }
}

export async function createDistributors(formData: FormData) {
  const img = formData.get('image');
  console.log(img);
 
  let filename = '';
  if (img instanceof File) {
    filename = '/distributors/' + img.name;
    console.log(filename);
  };
 
  const { name, phone } = CreateDistributors.parse({
    name : formData.get('name'), // Ensure name has a value
    phone : formData.get('phone'), // Ensure email has a value
  });
 
  try {
    await sql`
      INSERT into distributors (name, phone)
      VALUES (${name}, ${phone})
      RETURNING id
      `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Update Distributor.',
    };
  }
 
  revalidatePath('/dashboard/distributors');
  redirect('/dashboard/distributors');
}

export async function updateDistributors(id: string, formData: FormData) {
  const img = formData.get('image');
  console.log(img);
 
  let filename = '';
  if (img instanceof File) {
    filename = '/distributors/' + img.name;
    console.log(filename);
  };
 
  const { name, phone} = UpdateDistributors.parse({
    name : formData.get('name'), // Ensure name has a value
    phone : formData.get('phone'), // Ensure email has a value
   
  });
 
  try {
    await sql`
    UPDATE distributors
      SET name = ${name}, phone = ${phone}
      WHERE id = ${id}
      `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Update Distributor.',
    };
  }
 
  revalidatePath('/dashboard/distributors');
  redirect('/dashboard/distributors');
}

export async function deleteDistributors(id: string) {
  // throw new Error('Failed to Delete Invoice');
 
  try {
    await sql`DELETE FROM distributors WHERE id = ${id}`;
    revalidatePath('/dashboard/distributors');
    return { message: 'Deleted Distributor.' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Distributor.' };
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

  const name = formData.get('name') as string | null;
  const price = formData.get('price') as string | null;
  const stock = formData.get('stock') as string | null;

  // Check for missing required fields and handle them
  if (!name || !price || !stock) {
    return {
      message: 'Please fill in all required fields.',
    };
  }

  try {
    // Validate data using Zod
    const parsedData = CreateProduct.parse({
      name,
      price: parseFloat(price), // Ensure price is parsed to a number
      stock: parseInt(stock),    // Ensure stock is parsed to an integer
      image_url: fileName,
    });

    await sql`
      INSERT INTO products (name, price, stock, image_url)
      VALUES (${parsedData.name}, ${parsedData.price}, ${parsedData.stock}, ${parsedData.image_url})
      RETURNING id
    `;

    revalidatePath('/dashboard/products');
    redirect('/dashboard/products');
    // Return success message
    return {
      message: 'Product successfully created.',
    };
  } catch (error) {
    console.error('Error creating product:', error);
    return {
      message: 'Database Error: Failed to Create Product.',
    };
  }

}

export async function updateProduct(id: string, formData: FormData) {
  const img = formData.get('image');
  console.log(img);

  let fileName = '';
  if (img instanceof File) {
    fileName = '/products/'+ img.name;
    console.log(fileName);
  }

  const imageUrl = fileName || formData.get('image_url') || '';
  const { name, price, stock, image_url } = UpdateProduct.parse({
    name: formData.get('name'),
    price: formData.get('price'),
    stock: formData.get('stock'),
    image_url: imageUrl,
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

// export async function createService(formData: FormData) {
//   const { name, price, estimation } = CreateService.parse({
//     name: formData.get('name'),
//     price: formData.get('price'),
//     estimation: formData.get('estimation'),
//   });

//   await sql`
//     INSERT INTO services (name, price, estimation)
//     VALUES (${name}, ${price}, ${estimation})
//   `;

//   revalidatePath('/dashboard/services');
//   redirect('/dashboard/services');
// }

// export async function updateService(id: string, formData: FormData) {
//   const { name, price, estimation } = UpdateService.parse({
//     name: formData.get('name'),
//     price: formData.get('price'),
//     estimation: formData.get('estimation'),
//   });
 
//   await sql`
//   UPDATE services
//   SET name = ${name}, price = ${price}, estimation = ${estimation}
//   WHERE id = ${id}
// `;

// revalidatePath('/dashboard/services');
// redirect('/dashboard/services');
// }

// export async function deleteService(id: string) {
//   await sql`DELETE FROM services WHERE id = ${id}`;
//   revalidatePath('/dashboard/services');
// }