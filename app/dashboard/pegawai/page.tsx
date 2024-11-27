import { Suspense } from 'react';
import { fetchPegawaiPages } from '@/app/lib/data';
import PegawaiTable from '@/app/ui/pegawai/table';
import { CreatePegawai } from '@/app/ui/pegawai/buttons';
import Search from '@/app/ui/search';
import { oswald } from '@/app/ui/fonts';
import {
  SearchSkeleton,
  InvoicesTableSkeleton,
  CreateSkeleton,
} from '@/app/ui/skeletons';

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const params = await Promise.resolve(searchParams);
  const query = params?.query || '';
  const currentPage = Number(params?.page) || 1;
  const totalPages = await fetchPegawaiPages(query);

  return (
    <div className="flex min-h-screen flex-col">
      <p className={`${oswald.variable} text-3xl text-white`}>Pegawai</p>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Suspense fallback={<SearchSkeleton />}>
          <Search placeholder="Cari pegawai..." />
        </Suspense>
        <Suspense fallback={<CreateSkeleton />}>
          <CreatePegawai />
        </Suspense>
      </div>
      <div className="mt flow-root">
        <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
          <PegawaiTable query={query} currentPage={currentPage} totalPages={totalPages} />
        </Suspense>
      </div>
    </div>
  );
}
