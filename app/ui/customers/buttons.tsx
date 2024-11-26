'use client'

import { PencilIcon, PlusIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteCustomer } from '@/app/lib/action';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import EditForm from './edit-form';
import { CustomerField } from '@/app/lib/definitions';
import { toast } from 'react-hot-toast';

export function CreateCustomer() {
  return (
    <Link
      href="/dashboard/customers/create"
      className="flex h-10 items-center rounded-lg bg-purple-600 px-4 text-sm font-medium text-white transition-colors hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Customer</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateCustomer({ customer }: { customer: CustomerField }) {
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowEditModal(true)}
        className="rounded-md border p-2 hover:bg-gray-100"
      >
        <PencilIcon className="w-5" />
      </button>
      
      {showEditModal && (
        <EditForm 
          customer={customer}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </>
  );
}

export function DeleteCustomer({ id }: { id: string }) {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!id) return;

    try {
      setIsDeleting(true);
      const result = await deleteCustomer(id);
      
      if (result.success) {
        toast.success('Customer berhasil dihapus');
        setShowDeleteModal(false);
        router.refresh();
      } else {
        toast.error(result.error || 'Gagal menghapus customer');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat menghapus customer');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowDeleteModal(true)}
        className="rounded-md border p-2 hover:bg-red-500 hover:text-white"
      >
        <TrashIcon className="w-5" />
      </button>

      {showDeleteModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => !isDeleting && setShowDeleteModal(false)}
          />
          <div className="relative z-[70] w-full max-w-sm bg-gray-800 rounded-lg shadow-xl">
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-white">Konfirmasi Hapus</h3>
                {!isDeleting && (
                  <button 
                    onClick={() => setShowDeleteModal(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
              
              <div className="mt-3">
                <p className="text-sm text-gray-300">
                  Apakah Anda yakin ingin menghapus customer ini? 
                  <br />
                  Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
              
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => !isDeleting && setShowDeleteModal(false)}
                  disabled={isDeleting}
                  className={`px-3 py-1.5 text-xs rounded-lg bg-gray-600 text-white transition-colors
                    ${isDeleting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'}`}
                >
                  Batal
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className={`px-3 py-1.5 text-xs rounded-lg bg-red-600 text-white transition-colors
                    ${isDeleting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'}`}
                >
                  {isDeleting ? 'Menghapus...' : 'Hapus'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}