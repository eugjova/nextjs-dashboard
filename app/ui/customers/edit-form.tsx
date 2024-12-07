'use client';

import { CustomerField } from '@/app/lib/definitions';
import {
  UserCircleIcon,
  InboxArrowDownIcon,
  PhoneIcon,
  IdentificationIcon,
  GiftIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { updateCustomer } from '@/app/lib/action';
import { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';

export default function EditForm({ 
  customer,
  onClose 
}: { 
  customer: CustomerField;
  onClose: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

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

      if (!['Male', 'Female'].includes(gender)) {
        toast.error('Gender harus Male atau Female');
        setIsSubmitting(false);
        return;
      }

      if (poin && isNaN(Number(poin))) {
        toast.error('Poin harus berupa angka');
        setIsSubmitting(false);
        return;
      }

      formData.append('id', customer.id);
      const result = await updateCustomer(formData);
      
      if (result?.success) {
        toast.success('Customer berhasil diupdate!');
        onClose();
        window.location.reload();
      } else {
        toast.error(result?.error || 'Gagal mengupdate customer');
      }
    } catch (error) {
      console.error('Error updating customer:', error);
      toast.error('Terjadi kesalahan sistem');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="modal fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="modal-box relative bg-white p-4 md:p-6 rounded-md shadow-md border border-gray-300 w-full max-w-xl">
        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="rounded-md bg-gray-50 p-4 md:p-6">
            <div className="mb-4">
              <label htmlFor="name" className="mb-2 block text-sm font-medium">
                Nama Customer
              </label>
              <div className="relative">
                <input
                  id="name"
                  name="name"
                  defaultValue={customer.name}
                  placeholder="Masukkan nama customer"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="phone" className="mb-2 block text-sm font-medium">
                Nomor Telepon
              </label>
              <div className="relative">
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  defaultValue={customer.phone}
                  placeholder="Contoh: 08123456789"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="gender" className="mb-2 block text-sm font-medium">
                Gender
              </label>
              <div className="relative">
                <select
                  id="gender"
                  name="gender"
                  defaultValue={customer.gender}
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                >
                  <option value="" disabled>
                    Pilih gender
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <IdentificationIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="poin" className="mb-2 block text-sm font-medium">
                Poin
              </label>
              <div className="relative mt-2 rounded-md">
                <div className="relative">
                  <input
                    id="poin"
                    name="poin"
                    type="number"
                    defaultValue={customer.poin}
                    min="0"
                    placeholder="Masukkan Poin Customer"
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  />
                  <GiftIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="image" className="mb-2 block text-sm font-medium">
                Update Customer Image
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
                  <InboxArrowDownIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
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
              {isSubmitting ? 'Updating...' : 'Update Customer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
