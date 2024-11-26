'use client';

import { DistributorField } from '@/app/lib/definitions';
import { UserCircleIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { updateDistributors } from '@/app/lib/action';
import { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';

export default function EditForm({ 
  distributor,
  onClose 
}: { 
  distributor: DistributorField;
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
      
      if (!name || !phone) {
        toast.error('Mohon lengkapi semua field yang wajib diisi');
        setIsSubmitting(false);
        return;
      }

      if (!/^[0-9]{10,13}$/.test(phone)) {
        toast.error('Nomor telepon harus 10-13 digit angka');
        setIsSubmitting(false);
        return;
      }

      formData.append('id', distributor.id);
      const result = await updateDistributors(formData);
      
      if (result?.success) {
        toast.success('Distributor berhasil diupdate!');
        onClose();
        window.location.reload();
      } else {
        toast.error(result?.error || 'Gagal mengupdate distributor');
      }
    } catch (error) {
      console.error('Error:', error);
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
                Nama Distributor
              </label>
              <div className="relative">
                <input
                  id="name"
                  name="name"
                  defaultValue={distributor.name}
                  placeholder="Masukkan nama distributor"
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
                  defaultValue={distributor.phone}
                  placeholder="Contoh: 08123456789"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
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
              {isSubmitting ? 'Updating...' : 'Update Distributor'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
