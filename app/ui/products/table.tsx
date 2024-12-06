'use client';

import { UpdateProduct, DeleteProduct } from '@/app/ui/products/buttons';
import { formatCurrency } from '@/app/lib/utils';
import { useState, useEffect, useCallback } from 'react';
import { fetchFilteredProducts } from '@/app/lib/data';
import { CldImage } from 'next-cloudinary';
import EditForm from './edit-form';

function ProductSkeleton() {
  return (
    <div className="flex flex-col rounded-lg overflow-hidden shadow-lg bg-gray-800 transform transition duration-300 hover:scale-105">
      <div className="relative w-full h-48 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 animate-shimmer bg-[length:400%_100%]" />
      <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="h-6 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded animate-shimmer bg-[length:400%_100%]" />
          <div className="h-4 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded w-2/3 animate-shimmer bg-[length:400%_100%]" />
        </div>
        <div className="space-y-2">
          <div className="h-5 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded w-1/3 animate-shimmer bg-[length:400%_100%]" />
          <div className="h-5 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded w-1/4 animate-shimmer bg-[length:400%_100%]" />
        </div>
        <div className="flex justify-end space-x-2">
          <div className="h-10 w-10 bg-blue-600/30 rounded-lg animate-shimmer bg-[length:400%_100%]" />
          <div className="h-10 w-10 bg-red-600/30 rounded-lg animate-shimmer bg-[length:400%_100%]" />
        </div>
      </div>
    </div>
  );
}

export default function ProductsTable({
  query,
  currentPage,
  onDeleteClick,
  isRefetching,
  selectedProductId,
  distributors,
}: {
  query: string;
  currentPage: number;
  onDeleteClick: (id: string) => void;
  isRefetching?: boolean;
  selectedProductId?: string | null;
  distributors: Array<{ id: string; name: string; }>;
}) {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorImages, setErrorImages] = useState<{[key: string]: boolean}>({});
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const defaultImage = 'products/default';

  const getImageUrl = (url: string) => {
    if (!url) return defaultImage;
    return url;
  };

  const handleImageError = (productId: string) => {
    setErrorImages(prev => ({
      ...prev,
      [productId]: true
    }));
  };

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    const data = await fetchFilteredProducts(query, currentPage);
    setProducts(data);
    setIsLoading(false);
  }, [query, currentPage]);

  useEffect(() => {
    loadProducts();
  }, [query, currentPage, loadProducts]);

  useEffect(() => {
    if (isRefetching) {
      loadProducts();
    }
  }, [isRefetching, loadProducts]);

  if (isLoading || isRefetching) {
    return (
      <div className="mt-6 flow-root">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 flow-root">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products?.map((product) => (
          <div 
            key={product.id} 
            className={`flex flex-col rounded-lg overflow-hidden shadow-lg bg-gray-800 transform transition duration-300 hover:scale-105 hover:shadow-2xl
              ${selectedProductId === product.id ? 'opacity-50' : ''}`}
          >
            <div className="relative w-full pt-[75%] overflow-hidden bg-gray-900">
              {!errorImages[product.id] ? (
                <CldImage
                  src={getImageUrl(product.image_url)}
                  alt={product.name}
                  width={400}
                  height={300}
                  crop="fill"
                  loading="lazy"
                  quality={80}
                  format="auto"
                  className="absolute inset-0 w-full h-full object-cover transition duration-300 hover:opacity-90"
                  onError={() => handleImageError(product.id)}
                />
              ) : (
                <CldImage
                  src={defaultImage}
                  alt="Default"
                  width={400}
                  height={300}
                  crop="fill"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between bg-gradient-to-b from-gray-800 to-gray-900">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {product.name}
                </h3>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 text-sm bg-gray-700 rounded-full text-gray-300">
                    Stock: {product.stock}
                  </span>
                  <span className="text-lg font-semibold text-green-400">
                    {formatCurrency(product.price)}
                  </span>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button 
                  onClick={() => setEditingProduct(product)}
                  className="flex justify-center items-center p-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  <UpdateProduct id={product.id} className="w-5 h-5 text-white" />
                </button>
                <button 
                  onClick={() => onDeleteClick(product.id)}
                  disabled={selectedProductId === product.id}
                  className={`flex justify-center items-center p-2 rounded-lg transition-colors
                    ${selectedProductId === product.id 
                      ? 'bg-gray-600 cursor-not-allowed' 
                      : 'bg-red-600 hover:bg-red-700'}`}
                >
                  <DeleteProduct 
                    id={product.id} 
                    className="w-5 h-5 text-white"
                  />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingProduct && (
        <EditForm
          product={editingProduct}
          distributors={distributors}
          onClose={() => setEditingProduct(null)}
          onSuccess={() => {
            setEditingProduct(null);
            loadProducts();
          }}
        />
      )}
    </div>
  );
}
