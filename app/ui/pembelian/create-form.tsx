'use client';

import { CustomerField, DistributorField, PegawaiField, ProductsField } from '@/app/lib/definitions';
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
import { createPembelian} from '@/app/lib/action';
import Breadcrumbs from '@/app/ui/distributors/breadcrumbs';
import React, { useState } from 'react';

export default function Form({
  pegawai, 
  distributors
}: {
  pegawai: PegawaiField[],
  distributors : DistributorField[]
}) {
  const [modal, setModal] = useState(false);
  const [selectedProductPrice, setSelectedProductPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);


  function handleChange() {
    setModal(!modal);
    if (modal) {
      resetForm();
    }
  }

  function handlePegawaiChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const selectedPegawaiId = event.target.value;
    const selectedPegawai = pegawai.find(pegawai => pegawai.id === selectedPegawaiId);
  }

  function handleDistributorChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const selectedDistributorId = event.target.value;
    const selectedDistributor = distributors.find(distributors => distributors.id === selectedDistributorId);
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
      await createPembelian(formData);
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
        <span className="hidden md:block">Create Pembelian</span>{' '}
        <PlusIcon className="h-5 md:ml-4" />
      </button>
      {modal && (
        <div className="modal fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="modal-box relative bg-white p-4 md:p-6 rounded-md shadow-md border border-gray-300 w-full max-w-xl">
            <form className="w-full max-w-lg" onSubmit={handleSubmit}>
              <div className="mb-4">
                <Breadcrumbs
                  breadcrumbs={[
                    { label: 'Pembelian', href: '/dashboard/pembelian' },
                    {
                      label: 'Create Pembelian',
                      href: '/dashboard/pembelian/create',
                      active: true,
                    },
                  ]}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="pegawai" className="mb-2 block text-sm font-medium">
                  Pegawai
                </label>
                <div className="relative">
                  <select
                    id="pegawai"
                    name="id_pegawai"
                    className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    defaultValue=""
                    onChange={handlePegawaiChange}
                  >
                    <option value="" disabled>
                      Select a pegawai
                    </option>
                    {pegawai.map((pegawai) => (
                      <option key={pegawai.id} value={pegawai.id}>
                        {pegawai.name}
                      </option>
                    ))}
                  </select>
                  <ShoppingCartIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="distributors" className="mb-2 block text-sm font-medium">
                  Distributor
                </label>
                <div className="relative">
                  <select
                    id="distributor"
                    name="id_distributor"
                    className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    defaultValue=""
                    onChange={handleDistributorChange}
                  >
                   <option value="" disabled>
                      Select a Distributor
                    </option>
                    {distributors.map((distributor) => (
                      <option key={distributor.id} value={distributor.id}>
                        {distributor.name}
                      </option>
                    ))}
                  </select>
                  <ShoppingCartIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="jumlah" className="mb-2 block text-sm font-medium">
                  Jumlah
                </label>
                <div className="relative mt-2 rounded-md">
                  <div className="relative">
                    <input
                      id="jumlah"
                      name="jumlah"
                      type="number"
                      placeholder="Enter Jumlah"
                      className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    />
                    <ArchiveBoxIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                  </div>
                </div>
              </div>


              <div className="mb-4">
                <label htmlFor="total" className="mb-2 block text-sm font-medium">
                  Total (IDR)
                </label>
                <div className="relative mt-2 rounded-md">
                  <div className="relative">
                    <input
                      id="total"
                      name="total"
                      type="number"
                      placeholder="Enter Total"
                      className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    />
                    <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                  </div>
                </div>
              </div>


              <div className="mt-6 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={handleChange}
                  className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                >
                  Cancel
                </button>
                <Button type="submit">Create Pembelian</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
