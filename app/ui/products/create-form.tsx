'use client';

import {
  CurrencyDollarIcon,
  PlusIcon,
  ArchiveBoxIcon,
  RectangleStackIcon,
  BuildingStorefrontIcon,
  InboxArrowDownIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createProduct } from '@/app/lib/action';
import Breadcrumbs from '@/app/ui/products/breadcrumbs';
import { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { formatCurrency } from '@/app/lib/utils';

interface Props {
  distributors: Array<{
    id: string;
    name: string;
  }>;
  onSuccess?: () => void;
}

export default function Form({ distributors, onSuccess }: Props) {
  const [modal, setModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [price, setPrice] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  
  function handleChange() {
    if (!isSubmitting) {
      setModal(!modal);
      setPreview(null);
      setPrice('');
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Ukuran gambar maksimal 5MB');
        e.target.value = '';
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value === '') {
      setPrice('');
      return;
    }
    const numericValue = parseInt(value);
    setPrice(numericValue.toString());
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(event.currentTarget);
      formData.set('price', price);
      
      const result = await createProduct(formData);
      
      if (result.success) {
        toast.success('Produk berhasil dibuat!');
        setModal(false);
        formRef.current?.reset();
        setPreview(null);
        setPrice('');
        onSuccess?.();
      } else {
        toast.error(result.error || 'Gagal membuat produk');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Terjadi kesalahan sistem');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex items-start justify-center">
      <button
        type="button"
        className="flex h-10 items-center rounded-lg bg-red-600 px-4 text-sm font-medium text-white transition-colors hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuschia-600"
        onClick={handleChange}
      >
        <span className="hidden md:block">Create Product</span>{' '}
        <PlusIcon className="h-5 md:ml-4" />
      </button>
      
      {modal && (
        <div className="modal fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="modal-box relative bg-white p-4 md:p-6 rounded-md shadow-md border border-gray-300 w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <form ref={formRef} className="w-full max-w-lg" onSubmit={handleSubmit}>
              <div className="mb-4">
                <Breadcrumbs
                  breadcrumbs={[
                    { label: 'Products', href: '/dashboard/products' },
                    {
                      label: 'Create Product',
                      href: '/dashboard/products/create',
                      active: true,
                    },
                  ]}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="name" className="mb-2 block text-sm font-medium">
                  Product Name
                </label>
                <div className="relative mt-2 rounded-md">
                  <div className="relative">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      minLength={3}
                      placeholder="Enter Product Name"
                      className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    />
                    <ArchiveBoxIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="stock" className="mb-2 block text-sm font-medium">
                  Stock
                </label>
                <div className="relative mt-2 rounded-md">
                  <div className="relative">
                    <input
                      id="stock"
                      name="stock"
                      type="number"
                      required
                      min="0"
                      placeholder="Enter Stock Amount"
                      className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    />
                    <RectangleStackIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="price" className="mb-2 block text-sm font-medium">
                  Price
                </label>
                <div className="relative mt-2 rounded-md">
                  <div className="relative">
                    <input
                      id="price"
                      name="price"
                      type="text"
                      required
                      value={price ? formatCurrency(parseInt(price)) : ''}
                      onChange={handlePriceChange}
                      placeholder="Enter Price"
                      className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    />
                    <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="distributorId" className="mb-2 block text-sm font-medium">
                  Distributor
                </label>
                <div className="relative mt-2 rounded-md">
                  <div className="relative">
                    <select
                      id="distributorId"
                      name="distributorId"
                      required
                      className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    >
                      <option value="">Select Distributor</option>
                      {distributors.map((distributor) => (
                        <option key={distributor.id} value={distributor.id}>
                          {distributor.name}
                        </option>
                      ))}
                    </select>
                    <BuildingStorefrontIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="image" className="mb-2 block text-sm font-medium">
                  Product Image (Max 5MB)
                </label>
                <div className="relative mt-2 rounded-md">
                  <div className="relative">
                    <input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    />
                    <InboxArrowDownIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                  </div>
                  {preview && (
                    <div className="mt-2">
                      <Image
                        src={preview}
                        alt="Preview"
                        width={128}
                        height={128}
                        className="object-cover rounded-md"
                      />
                    </div>
                  )}
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
                  {isSubmitting ? 'Creating...' : 'Create Product'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
