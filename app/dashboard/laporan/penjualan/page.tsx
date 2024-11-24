import { Suspense } from 'react';
import { SearchSkeleton, InvoicesTableSkeleton } from '@/app/ui/skeletons';
import Search from '@/app/ui/search';
import { LaporanPenjualanTable } from '@/app/ui/laporan/penjualan-table';
import { DateRangePicker } from '@/app/ui/laporan/date-picker';
import { ExportButton } from '@/app/ui/laporan/buttons';
import { LaporanNav } from '@/app/ui/laporan/nav';
import Pagination from '@/app/ui/laporan/pagination';
import { fetchLaporanPenjualanPages } from '@/app/lib/data';

export default async function Page({
  searchParams,
}: {
  searchParams?: any;
}) {
  const params = await Promise.resolve(searchParams);
  const query = params?.query || '';
  const currentPage = Number(params?.page) || 1;
  const startDate = params?.startDate;
  const endDate = params?.endDate;

  const totalPages = await fetchLaporanPenjualanPages(query, startDate, endDate);

  return (
    <div>
      <div className="mb-8">
        <LaporanNav />
      </div>
      
      <div className="flex items-center justify-between gap-2">
        <Suspense fallback={<SearchSkeleton />}>
          <Search placeholder="Cari penjualan..." />
        </Suspense>
        <div className="flex items-center gap-2">
          <DateRangePicker />
          <ExportButton 
            type="penjualan" 
            query={query}
            startDate={startDate} 
            endDate={endDate} 
          />
        </div>
      </div>

      <Suspense key={query + currentPage + startDate + endDate} fallback={<InvoicesTableSkeleton />}>
        <LaporanPenjualanTable 
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