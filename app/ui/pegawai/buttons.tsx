'use client'

import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deletePegawai } from '@/app/lib/action';
import { useState } from 'react';
import EditForm from './edit-form';
import { PegawaiForm } from '@/app/lib/definitions';
 
export function CreatePegawai() {
  return (
    <Link
      href="/dashboard/pegawai/create"
      className="flex h-10 items-center rounded-lg bg-purple-600 px-4 text-sm font-medium text-white transition-colors hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Pegawai</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}
 
export function UpdatePegawai({ pegawai }: { pegawai: PegawaiForm }) {
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setShowEditModal(true)}
        className="rounded-md border p-2 hover:bg-yellow-500"
      >
        <PencilIcon className="w-5" />
      </button>

      {showEditModal && (
        <EditForm 
          pegawai={pegawai} 
          onClose={() => setShowEditModal(false)}
        />
      )}
    </>
  );
}
 
export function DeletePegawai({ id }: { id: string }) {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleDelete = async () => {
    try {
      const result = await deletePegawai(id);
      if (result.success) {
        setModalOpen(false);
      } else {
        console.error('Failed to delete:', result.error);
      }
    } catch (error) {
      console.error('Error deleting pegawai:', error);
    }
  };

  return (
    <>
      <button
        type="button"
        className="rounded-md border p-2 hover:bg-red-500"
        onClick={() => setModalOpen(true)}
      >
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-md">
            <h3 className="font-bold text-lg mb-4">Apakah Anda yakin ingin menghapus data ini?</h3>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 rounded bg-gray-100 text-gray-600 hover:bg-gray-200"
                onClick={() => setModalOpen(false)}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                onClick={handleDelete}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


