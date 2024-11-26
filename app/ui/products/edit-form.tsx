'use client';

import {
  CurrencyDollarIcon,
  ArchiveBoxIcon,
  RectangleStackIcon,
  BuildingStorefrontIcon,
  InboxArrowDownIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { updateProduct } from '@/app/lib/action';
import Breadcrumbs from '@/app/ui/products/breadcrumbs';
import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { formatCurrency } from '@/app/lib/utils';
import { CldImage } from 'next-cloudinary';

interface Props {
  product: {
    id: string;
    name: string;
    stock: number;
    price: number;
    distributorid: string;
    image_url: string;
  };
  distributors: Array<{
    id: string;
    name: string;
  }>;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditForm({ product, distributors, onClose, onSuccess }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: product.name,
    stock: product.stock.toString(),
    price: product.price.toString(),
    distributorId: product.distributorid
  });
  const formRef = useRef<HTMLFormElement>(null);
  const [isNewImage, setIsNewImage] = useState(false);

  useEffect(() => {
    if (product.image_url && !isNewImage) {
      setPreview(null);
    }
  }, [product.image_url, isNewImage]);

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
        setIsNewImage(true);
      };
      reader.readAsDataURL(file);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setFormData(prev => ({
      ...prev,
      price: value
    }));
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    
    try {
      const submitFormData = new FormData(event.currentTarget);
      submitFormData.set('price', formData.price);
      
      const result = await updateProduct(product.id, submitFormData);
      
      if (result.success) {
        toast.success('Produk berhasil diupdate!');
        onSuccess();
        onClose();
      } else {
        toast.error(result.error || 'Gagal mengupdate produk');
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
      <div className="modal-box relative bg-white p-4 md:p-6 rounded-md shadow-md border border-gray-300 w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <form ref={formRef} className="w-full max-w-lg" onSubmit={handleSubmit}>
          <div className="mb-4">
            <Breadcrumbs
              breadcrumbs={[
                { label: 'Products', href: '/dashboard/products' },
                {
                  label: 'Edit Product',
                  href: `/dashboard/products/${product.id}/edit`,
                  active: true,
                },
              ]}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="name" className="mb-2 block text-sm font-medium">
              Nama Produk
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  required
                />
                <RectangleStackIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
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
                  value={formData.stock}
                  onChange={handleInputChange}
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  required
                />
                <ArchiveBoxIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="price" className="mb-2 block text-sm font-medium">
              Harga
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="price"
                  name="price"
                  type="text"
                  value={formData.price ? formatCurrency(Number(formData.price)) : ''}
                  onChange={handlePriceChange}
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  required
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
                  value={formData.distributorId}
                  onChange={handleInputChange}
                  required
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                >
                  <option value="">Select Distributor</option>
                  {distributors.map((distributor) => (
                    <option 
                      key={distributor.id} 
                      value={distributor.id}
                    >
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
              <div className="mt-2">
                {isNewImage && preview ? (
                  <Image
                    src={preview}
                    alt="Preview"
                    width={128}
                    height={128}
                    className="object-cover rounded-md"
                  />
                ) : product.image_url ? (
                  <CldImage
                    src={product.image_url}
                    alt={product.name}
                    width={128}
                    height={128}
                    crop="fill"
                    className="object-cover rounded-md"
                  />
                ) : null}
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
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
