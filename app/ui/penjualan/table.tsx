import { fetchFilteredPenjualan } from '@/app/lib/data';
import { PenjualanTableContainer } from './table-container';

export default async function PenjualanTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const penjualan = await fetchFilteredPenjualan(query, currentPage);

  return <PenjualanTableContainer penjualan={penjualan} />;
}
