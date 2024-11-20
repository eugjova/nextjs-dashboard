'use client';

import { CustomerField, ProductsField } from '@/app/lib/definitions';
import {
  PlusIcon,
  ShoppingCartIcon,
  ArchiveBoxIcon,
  IdentificationIcon,
  CheckBadgeIcon,
  GiftIcon,
  KeyIcon,
  CurrencyDollarIcon 
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createPenjualan } from '@/app/lib/action';
import Breadcrumbs from '@/app/ui/distributors/breadcrumbs';
import React, { useState } from 'react';

export default function Form({
  products
}: {
  products: ProductsField[]
}) {
  const [modal, setModal] = useState(false);
  const [selectedProductPrice, setSelectedProductPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);

  // function handleChange() {
  //   setModal(!modal);
  // }
  

  // async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  //   event.preventDefault();
  //   const formData = new FormData(event.currentTarget);
  //   try {
  //     await createPenjualan(formData);
  //     setModal(false);
  //   } catch (error) {
  //     console.error('Failed to create distributors:', error);
  //   }
  // }

  function handleChange() {
    setModal(!modal);
    if (modal) {
      resetForm();
    }
  }

  function handleProductChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const selectedProductId = event.target.value;
    const selectedProduct = products.find(product => product.id === selectedProductId);
    if (selectedProduct) {
      setSelectedProductPrice(selectedProduct.price);
    } else {
      setSelectedProductPrice(0);
    }
  }

  function handleQuantityChange(event: React.ChangeEvent<HTMLInputElement>) {
    setQuantity(parseInt(event.target.value, 10));
  }

  function resetForm() {
    setSelectedProductPrice(0);
    setQuantity(0);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    try {
      await createPenjualan(formData);
      setModal(false);
      resetForm();
    } catch (error) {
      console.error('Failed to create invoice:', error);
    }
  }

  // async function LoyaltyToggle() {
  //   const [loyaltyEnabled, setLoyaltyEnabled] = useState(false);
  
  //   function handleLoyaltyToggle(event: React.MouseEvent<HTMLButtonElement>): void {
  //     setLoyaltyEnabled(!loyaltyEnabled);
  //     console.log('Button clicked:', event.currentTarget);
  //   }

  return (
    <div className="flex items-start justify-center">
      <button
        className="flex h-10 items-center rounded-lg bg-red-600 px-4 text-sm font-medium text-white transition-colors hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuschia-600"
        onClick={handleChange}
      >
        <span className="hidden md:block">Create Penjualan</span>{' '}
        <PlusIcon className="h-5 md:ml-4" />
      </button>
      {modal && (
        <div className="modal fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="modal-box relative bg-white p-4 md:p-6 rounded-md shadow-md border border-gray-300 w-full max-w-xl">
            <form className="w-full max-w-lg" onSubmit={handleSubmit}>
              <div className="mb-4">
                <Breadcrumbs
                  breadcrumbs={[
                    { label: 'Penjualan', href: '/dashboard/penjualan' },
                    {
                      label: 'Create Penjualan',
                      href: '/dashboard/penjualan/create',
                      active: true,
                    },
                  ]}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="product" className="mb-2 block text-sm font-medium">
                  Name
                </label>
                <div className="relative">
                  <select
                    id="product"
                    name="productId"
                    className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    defaultValue=""
                    onChange={handleProductChange}
                  >
                    <option value="" disabled>
                      Select a product
                    </option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                  <ShoppingCartIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="quantity" className="mb-2 block text-sm font-medium">
                  Jumlah
                </label>
                <div className="relative">
                  <input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  />
                  <ArchiveBoxIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                </div>
              </div>


              <div className="mb-4">
                <label htmlFor="amount" className="mb-2 block text-sm font-medium">
                  Total (IDR)
                </label>
                <div className="relative mt-2 rounded-md">
                  <div className="relative">
                    <input
                      id="amount"
                      name="amount"
                      type="number"
                      step="0.01"
                      value={selectedProductPrice * quantity}
                      readOnly
                      className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    />
                    <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                  </div>
                </div>
              </div>

              <div className="mb-4 flex items-center">
                <label htmlFor="loyalty" className="block text-sm font-medium mr-4">
                  Pengaturan Loyalitas
                </label>
                <div className="relative">
                  <input
                    type="checkbox"
                    id="loyalty"
                    name="loyalty"
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-green-500 peer-focus:ring-2 peer-focus:ring-green-300 transition-all"></div>
                  <div className="absolute top-0.5 left-[2px] w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                </div>
              </div>

              {/* <div className="mb-4">
                <label htmlFor="Poin" className="mb-2 block text-sm font-medium">
                  Poin
                </label>
                <div className="relative mt-2 rounded-md">
                  <div className="relative">
                    <input
                      id="Poin"
                      name="Poin"
                      type="Poin"
                      placeholder="Enter Poin"
                      className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    />
                    <GiftIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                  </div>
                </div>
              </div> */}



              {/* <div className="mb-4">
                <label htmlFor="image" className="mb-2 block text-sm font-medium">
                  Upload Customer Image
                </label>
                <div className="relative mt-2 rounded-md">
                  <div className="relative">
                    <input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    />
                    <InboxArrowDownIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                  </div>
                </div>
              </div> */}

              <div className="mt-6 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={handleChange}
                  className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                >
                  Cancel
                </button>
                <Button type="submit">Create Penjualan</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
