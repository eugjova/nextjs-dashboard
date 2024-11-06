'use client';

import { ProductForm } from '@/app/lib/definitions';
import {
  CurrencyDollarIcon,
  ArchiveBoxIcon,
  RectangleStackIcon,
  InboxArrowDownIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { updateProduct } from '@/app/lib/action';

export default function EditProductForm({
  product,
}: {
  product: ProductForm;
}) {
  const updateProductWithId = updateProduct.bind(null, product.id);

  return (
    <div className="place-content-center flex items-center justify-center">
      <div className="relative bg-white p-4 md:p-6 rounded-md shadow-md border border-gray-300 w-full max-w-xl">
        <form action={updateProductWithId}>
          <div className="rounded-md bg-gray-50 p-4 md:p-6">
          <div className="mb-4">
                <label htmlFor="name" className="mb-2 block text-sm font-medium">
                  Enter Product Name
                </label>
                <div className="relative mt-2 rounded-md">
                  <div className="relative">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      defaultValue={product.name}
                      placeholder="Enter Product Name"
                      className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    />
                    <ArchiveBoxIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="stock" className="mb-2 block text-sm font-medium">
                  Enter Stock
                </label>
                <div className="relative mt-2 rounded-md">
                  <div className="relative">
                    <input
                      id="stock"
                      name="stock"
                      type="number"
                      defaultValue={product.stock}
                      placeholder="Enter Stock Quantity"
                      className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    />
                    <RectangleStackIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="price" className="mb-2 block text-sm font-medium">
                  Enter Price
                </label>
                <div className="relative mt-2 rounded-md">
                  <div className="relative">
                    <input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      defaultValue={product.price}
                      placeholder="Enter Price in USD"
                      className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    />
                    <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="image" className="mb-2 block text-sm font-medium">
                  Choose Product Image
                </label>
                <div className="relative mt-2 rounded-md">
                  <input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 pr-10 text-sm outline-2 placeholder:text-gray-500"
                  />
                  <InboxArrowDownIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                </div>
              </div>

          </div>
          <div className="mt-6 flex justify-end gap-4">
            <Link
              href="/dashboard/products"
              className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
            >
              Cancel
            </Link>
            <Button type="submit">Edit Product</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
