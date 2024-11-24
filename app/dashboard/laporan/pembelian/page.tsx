import { Suspense } from 'react';
import { SearchSkeleton, InvoicesTableSkeleton } from '@/app/ui/skeletons';
import Search from '@/app/ui/search';
import { DateRangePicker } from '@/app/ui/laporan/date-picker';
import { ExportButton } from '@/app/ui/laporan/buttons';
import { LaporanPembelianTable } from '@/app/ui/laporan/pembelian-table';
import { LaporanNav } from '@/app/ui/laporan/nav';
import Pagination from '@/app/ui/laporan/pagination';
import { fetchLaporanPembelianPages } from '@/app/lib/data';

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
    startDate?: string;
    endDate?: string;
  };
}) {
  const params = await Promise.resolve(searchParams);
  const query = params?.query || '';
  const currentPage = Number(params?.page) || 1;
  const startDate = params?.startDate;
  const endDate = params?.endDate;

  const totalPages = await fetchLaporanPembelianPages(query, startDate, endDate);

  return (
    <div>
      <div className="mb-8">
        <LaporanNav />
      </div>
      
      <div className="flex items-center justify-between gap-2">
        <Suspense fallback={<SearchSkeleton />}>
          <Search placeholder="Cari pembelian..." />
        </Suspense>
        <div className="flex items-center gap-2">
          <DateRangePicker />
          <ExportButton 
            type="pembelian" 
            query={query}
            startDate={startDate} 
            endDate={endDate} 
          />
        </div>
      </div>

      <Suspense key={query + currentPage + startDate + endDate} fallback={<InvoicesTableSkeleton />}>
        <LaporanPembelianTable 
          query={query} 
          currentPage={currentPage}
          startDate={startDate}
          endDate={endDate}
        />
      </Suspense>

      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
} 