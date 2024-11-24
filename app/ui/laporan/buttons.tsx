'use client';

import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import * as XLSX from 'xlsx';
import { fetchFilteredPenjualan, fetchFilteredPembelian } from '@/app/lib/data';

export function ExportButton({ 
  type,
  query,
  startDate,
  endDate 
}: { 
  type: string;
  query: string;
  startDate?: string;
  endDate?: string;
}) {
  const handleExport = async () => {
    try {
      let data;
      if (type === 'penjualan') {
        const response = await fetch(
          `/api/laporan/penjualan?${new URLSearchParams({
            query: query || '',
            startDate: startDate || '',
            endDate: endDate || ''
          }).toString()}`
        );
        data = await response.json();
      } else {
        const response = await fetch(
          `/api/laporan/pembelian?${new URLSearchParams({
            query: query || '',
            startDate: startDate || '',
            endDate: endDate || ''
          }).toString()}`
        );
        data = await response.json();
      }

      const formattedData = data.map((item: any) => ({
        ...item,
        date: new Date(item.date).toLocaleDateString('id-ID'),
        total: type === 'penjualan' ? item.total_amount : item.total,
        total_bayar: type === 'penjualan' ? item.total_bayar : item.total,
      }));

      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan");
      
      XLSX.writeFile(workbook, `laporan_${type}_${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
    }
  };

  return (
    <button
      onClick={handleExport}
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <ArrowDownTrayIcon className="w-5 mr-2" />
      Export Excel
    </button>
  );
} 