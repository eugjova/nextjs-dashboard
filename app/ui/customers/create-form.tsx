'use client';

import { CustomerField } from '@/app/lib/definitions';
import {
  UserCircleIcon,
  EnvelopeIcon,
  InboxArrowDownIcon,
  PlusIcon,
  PhoneIcon,
  IdentificationIcon,
  CheckBadgeIcon,
  GiftIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createCustomer } from '@/app/lib/action';
import Breadcrumbs from '@/app/ui/customers/breadcrumbs';
import { useState } from 'react';

export default function Form() {
  const [modal, setModal] = useState(false);

  function handleChange() {
    setModal(!modal);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    try {
      await createCustomer(formData);
      setModal(false);
    } catch (error) {
      console.error('Failed to create customer:', error);
    }
  }

  return (
    <div className="flex items-start justify-center">
      <button
        className="flex h-10 items-center rounded-lg bg-red-600 px-4 text-sm font-medium text-white transition-colors hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuschia-600"
        onClick={handleChange}
      >
        <span className="hidden md:block">Create Customer</span>{' '}
        <PlusIcon className="h-5 md:ml-4" />
      </button>
      {modal && (
        <div className="modal fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="modal-box relative bg-white p-4 md:p-6 rounded-md shadow-md border border-gray-300 w-full max-w-xl">
            <form className="w-full max-w-lg" onSubmit={handleSubmit}>
              <div className="mb-4">
                <Breadcrumbs
                  breadcrumbs={[
                    { label: 'Customers', href: '/dashboard/customers' },
                    {
                      label: 'Create Customer',
                      href: '/dashboard/customers/create',
                      active: true,
                    },
                  ]}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="name" className="mb-2 block text-sm font-medium">
                  Customer Name
                </label>
                <div className="relative mt-2 rounded-md">
                  <div className="relative">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter Customer Name"
                      className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    />
                    <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="phone" className="mb-2 block text-sm font-medium">
                 Customer Phone
                </label>
                <div className="relative mt-2 rounded-md">
                  <div className="relative">
                    <input
                      id="phone"
                      name="phone"
                      type="phone"
                      placeholder="Enter Customer Phone"
                      className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    />
                    <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="gender" className="mb-2 block text-sm font-medium">
                  Customer Gender
                </label>
                <div className="relative mt-2 rounded-md">
                  <div className="relative">
                    <input
                      id="gender"
                      name="gender"
                      type="text"
                      placeholder="Enter Customer Gender"
                      className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    />
                    <IdentificationIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="poin" className="mb-2 block text-sm font-medium">
                 Customer Poin
                </label>
                <div className="relative mt-2 rounded-md">
                  <div className="relative">
                    <input
                      id="poin"
                      name="poin"
                      type="poin"
                      placeholder="Enter Customer poin"
                      className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    />
                    <GiftIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                  </div>
                </div>
              </div>

              <div className="mb-4">
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
              </div>

              <div className="mt-6 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={handleChange}
                  className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                >
                  Cancel
                </button>
                <Button type="submit">Create Customer</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
