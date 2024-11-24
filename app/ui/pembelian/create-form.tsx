'use client';

import { PegawaiField, DistributorField } from '@/app/lib/definitions';
import { createPembelian } from '@/app/lib/action';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import { useFormStatus } from 'react-dom';
import {
  CalendarIcon,
  UserCircleIcon,
  CurrencyDollarIcon,
  ArchiveBoxIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { formatCurrency } from '@/app/lib/utils';

export default function Form({ 
  pegawai,
  distributors,
}: { 
  pegawai: PegawaiField[];
  distributors: DistributorField[];
}) {
  const router = useRouter();
  const [modal, setModal] = useState(false);
  const [quantity, setQuantity] = useState<number>(0);
  const [total, setTotal] = useState<string>('0');
  const [error, setError] = useState<string>('');

  function handleChange() {
    if (modal) {
      resetForm();
    }
    setModal(!modal);
  }

  function resetForm() {
    setQuantity(0);
    setTotal('0');
    setError('');
  }

  const handleTotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/\D/g, '');
    setTotal(numericValue);
  };

  const formattedTotal = formatCurrency(parseInt(total) || 0);

  const handleSubmit = async (formData: FormData) => {
    if (quantity <= 0) {
      setError('Jumlah item harus lebih dari 0');
      return;
    }

    if (parseInt(total) <= 0) {
      setError('Total harga harus lebih dari 0');
      return;
    }

    try {
      const result = await createPembelian(formData);
      
      if (result.success) {
        toast.success('Pembelian berhasil dibuat!');
        resetForm();
        setModal(false);
        router.refresh();
      } else {
        toast.error(result.error || 'Terjadi kesalahan');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat membuat pembelian');
      console.error('Error:', error);
    }
  };

  function SubmitButton() {
    const { pending } = useFormStatus();
    
    return (
      <button
        type="submit"
        className={`flex h-10 items-center rounded-lg px-4 text-sm font-medium text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 ${
          pending ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-500'
        }`}
        disabled={pending}
      >
        {pending ? 'Memproses...' : 'Bayar'}
      </button>
    );
  }

  function CancelButton({ onClick }: { onClick: () => void }) {
    const { pending } = useFormStatus();
    
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        className={`flex h-10 items-center rounded-lg px-4 text-sm font-medium transition-colors ${
          pending 
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        Batal
      </button>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <button
        className="flex h-10 items-center rounded-lg bg-red-600 px-4 text-sm font-medium text-white transition-colors hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
        onClick={handleChange}
      >
        <span className="hidden md:block">Create Pembelian</span>{' '}
        <PlusIcon className="h-5 md:ml-4" />
      </button>

      {modal && (
        <div className="modal fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-full max-w-3xl rounded-xl bg-white p-6 shadow-lg">
            <form action={handleSubmit}>
              {error && (
                <div className="mb-4 rounded-lg bg-red-100 p-3 text-red-500">
                  {error}
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium">
                    Tanggal Transaksi
                  </label>
                  <div className="relative mt-1">
                    <input
                      type="date"
                      id="date"
                      name="date"
                      className="block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm"
                      required
                    />
                    <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                  </div>
                </div>

                <div>
                  <label htmlFor="pegawai" className="block text-sm font-medium">
                    Pegawai
                  </label>
                  <div className="relative mt-1">
                    <select
                      id="pegawai"
                      name="pegawaiId"
                      className="block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm"
                      required
                    >
                      <option value="">Pilih pegawai</option>
                      {pegawai.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                    <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                  </div>
                </div>

                <div>
                  <label htmlFor="distributor" className="block text-sm font-medium">
                    Distributor
                  </label>
                  <div className="relative mt-1">
                    <select
                      id="distributor"
                      name="distributorId"
                      className="block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm"
                      required
                    >
                      <option value="">Pilih distributor</option>
                      {distributors.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                    <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                  </div>
                </div>

                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium">
                    Jumlah Item
                  </label>
                  <div className="relative mt-1">
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      value={quantity === 0 ? '' : quantity}
                      onChange={(e) => {
                        const value = e.target.value === '' ? 0 : parseInt(e.target.value);
                        setQuantity(value);
                        setError('');
                      }}
                      className="block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm"
                      required
                    />
                    <ArchiveBoxIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                  </div>
                </div>

                <div>
                  <label htmlFor="total" className="block text-sm font-medium">
                    Total Harga
                  </label>
                  <div className="relative mt-1">
                    <input
                      type="text"
                      id="total"
                      name="total"
                      value={formattedTotal}
                      onChange={handleTotalChange}
                      className="block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm"
                      required
                    />
                    <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-4">
                <CancelButton onClick={handleChange} />
                <SubmitButton />
              </div>
            </form>
          </div>
        </div>
      )}
      
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}
