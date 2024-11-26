'use client';

import {
  UserCircleIcon,
  InboxArrowDownIcon,
  PlusIcon,
  PhoneIcon,
  IdentificationIcon,
  GiftIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createCustomer } from '@/app/lib/action';
import Breadcrumbs from '@/app/ui/customers/breadcrumbs';
import { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';

export default function Form() {
  const [modal, setModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  function handleChange() {
    if (!isSubmitting) {
      setModal(!modal);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(event.currentTarget);
      const name = formData.get('name') as string;
      const phone = formData.get('phone') as string;
      const gender = formData.get('gender') as string;
      const poin = formData.get('poin') as string;
      const image = formData.get('image') as File;
      
      if (!name || !phone || !gender) {
        toast.error('Mohon lengkapi semua field yang wajib diisi');
        setIsSubmitting(false);
        return;
      }

      if (!/^[0-9]{10,13}$/.test(phone)) {
        toast.error('Nomor telepon harus 10-13 digit angka');
        setIsSubmitting(false);
        return;
      }

      if (!['male', 'female'].includes(gender)) {
        toast.error('Gender harus Male atau Female');
        setIsSubmitting(false);
        return;
      }

      if (poin && isNaN(Number(poin))) {
        toast.error('Poin harus berupa angka');
        setIsSubmitting(false);
        return;
      }

      const result = await createCustomer(formData);
      
      if (result?.success) {
        toast.success('Customer berhasil dibuat!');
        setModal(false);
        if (formRef.current) {
          formRef.current.reset();
        }
        window.location.reload();
      } else {
        toast.error(result?.error || 'Gagal membuat customer');
      }
    } catch (error) {
      console.error('Error creating customer:', error);
      toast.error('Terjadi kesalahan sistem');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex items-start justify-center">
      <button
        className="flex h-10 items-center rounded-lg bg-red-600 px-4 text-sm font-medium text-white transition-colors hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuschia-600 disabled:bg-gray-400"
        onClick={handleChange}
        disabled={isSubmitting}
      >
        <span className="hidden md:block">Create Customer</span>{' '}
        <PlusIcon className="h-5 md:ml-4" />
      </button>
      {modal && (
        <div className="modal fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="modal-box relative bg-white p-4 md:p-6 rounded-md shadow-md border border-gray-300 w-full max-w-xl">
            <form ref={formRef} className="w-full max-w-lg" onSubmit={handleSubmit}>
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
                      required
                      minLength={3}
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
                      type="tel"
                      required
                      pattern="[0-9]{10,13}"
                      placeholder="Enter Phone Number"
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
                    <select
                      id="gender"
                      name="gender"
                      required
                      className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                      defaultValue=""
                    >
                      <option value="" disabled>Pilih Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
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
                      type="number"
                      min="0"
                      placeholder="Masukkan Poin Customer"
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
                  disabled={isSubmitting}
                  className={`flex h-10 items-center rounded-lg px-4 text-sm font-medium transition-colors
                    ${isSubmitting 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  Cancel
                </button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Customer'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
