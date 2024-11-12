import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deletePegawai } from '@/app/lib/action';
 
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
 
export function UpdatePegawai({ id }: { id: string }) {
  return (
    <Link
    href={`/dashboard/pegawai/${id}/edit`}
      className="rounded-md border p-2 hover:bg-yellow-500"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}
 
export function DeletePegawai({ id }: { id: string }) {
  const deletePegawaiWithId = deletePegawai.bind(null, id);
 
  return (
    <form action={deletePegawaiWithId}>
      <button className="rounded-md border p-2 hover:bg-red-500">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}