'use client';

import ProductsTable from '@/app/ui/products/table';
import Form from '@/app/ui/products/create-form';
import { useState } from 'react';
import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { deleteProduct } from '@/app/lib/action';
import { toast } from 'react-hot-toast';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import Pagination from '@/app/ui/products/pagination';

interface ProductsListProps {
  distributors: { id: string; name: string; }[];
  query: string;
  currentPage: number;
  totalPages: number;
}

export default function ProductsList({ 
  distributors,
  query,
  currentPage,
  totalPages,
}: ProductsListProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    params.set('page', '1');
    
    router.replace(`${pathname}?${params.toString()}`);
  }, 300);

  const handleDeleteClick = (id: string) => {
    setSelectedProductId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!selectedProductId) return;

    try {
      setIsDeleting(true);
      const result = await deleteProduct(selectedProductId);
      
      if (result.success) {
        toast.success('Produk berhasil dihapus');
        setIsRefetching(true);
        router.refresh();
        
        setTimeout(() => {
          setIsRefetching(false);
        }, 1000);
      } else {
        toast.error(result.error || 'Gagal menghapus produk');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat menghapus produk');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setSelectedProductId(null);
    }
  };

  const handleCreateSuccess = () => {
    setIsRefetching(true);
    router.refresh();
    setTimeout(() => {
      setIsRefetching(false);
    }, 1000);
  };

  return (
    <div>
      <div className="mt-4 flex items-center justify-between gap-2">
        <div className="relative flex-1">
          <label htmlFor="search" className="sr-only">
            Search products
          </label>
          <div className="relative">
            <input
              type="text"
              id="search"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500 bg-white text-gray-900 focus:border-gray-400"
              placeholder="Search products..."
              onChange={(e) => handleSearch(e.target.value)}
              defaultValue={searchParams.get('query')?.toString()}
            />
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
        </div>
        <Form 
          distributors={distributors} 
          onSuccess={handleCreateSuccess}
        />
      </div>
      <ProductsTable 
        query={query} 
        currentPage={currentPage} 
        onDeleteClick={handleDeleteClick}
        isRefetching={isRefetching}
        selectedProductId={selectedProductId}
        distributors={distributors}
      />

      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => !isDeleting && setShowDeleteModal(false)}
          />
          <div className="relative z-[70] bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">Konfirmasi Hapus</h3>
              {!isDeleting && (
                <div 
                  onClick={() => setShowDeleteModal(false)}
                  className="text-gray-400 hover:text-white cursor-pointer"
                >
                  <XMarkIcon className="h-6 w-6" />
                </div>
              )}
            </div>
            
            <p className="text-gray-300 mb-6">
              Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan.
            </p>
            
            <div className="flex justify-end space-x-3">
              <div
                onClick={() => !isDeleting && setShowDeleteModal(false)}
                className={`px-4 py-2 rounded-lg bg-gray-600 text-white transition-colors cursor-pointer
                  ${isDeleting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'}`}
              >
                Batal
              </div>
              <div
                onClick={handleDelete}
                className={`px-4 py-2 rounded-lg bg-red-600 text-white transition-colors cursor-pointer
                  ${isDeleting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'}`}
              >
                {isDeleting ? 'Menghapus...' : 'Hapus'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 