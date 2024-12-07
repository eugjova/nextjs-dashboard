'use client';

import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import * as XLSX from 'xlsx';
import { 
  fetchAllPenjualan, 
  fetchAllPembelian,
} from '@/app/lib/data';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

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
        data = await fetchAllPenjualan(query, startDate, endDate);
      } else {
        data = await fetchAllPembelian(query, startDate, endDate);
      }

      let formattedData;
      if (type === 'penjualan') {
        formattedData = data.map((item: any) => ({
          'ID': item.id,
          'Tanggal': new Date(item.date).toLocaleDateString('id-ID'),
          'Nama Kustomer': item.nama_customer,
          'Nama Pegawai': item.nama_pegawai,
          'Jumlah Item': item.total_items,
          'Total Harga': item.total_amount,
          'Poin Digunakan': item.poin_used ? `${item.poin_used} (${formatCurrency(item.poin_used * 5000)})` : '0 (Rp0)',
          'Total Bayar': item.total_bayar
        }));
      } else {
        formattedData = data.map((item: any) => ({
          'ID': item.id,
          'Tanggal': new Date(item.date).toLocaleDateString('id-ID'),
          'Nama Pegawai': item.nama_pegawai,
          'Distributor': item.nama_distributor,
          'Total Harga': item.total
        }));
      }

      const worksheet = XLSX.utils.aoa_to_sheet([[]]);
      XLSX.utils.sheet_add_json(worksheet, formattedData, { origin: 'A2' });

      const colWidths = type === 'penjualan' 
        ? [20, 15, 20, 20, 15, 15, 20, 15]
        : [20, 15, 20, 20, 15];
      
      worksheet['!cols'] = colWidths.map(width => ({ width }));

      const titleCell = XLSX.utils.encode_cell({ r: 0, c: 0 });
      worksheet[titleCell] = {
        v: type === 'penjualan' ? 'LAPORAN PENJUALAN' : 'LAPORAN PEMBELIAN',
        t: 's',
        s: {
          font: { bold: true, sz: 14 },
          alignment: { horizontal: 'center', vertical: 'center' },
          border: {
            top: { style: 'medium' },
            left: { style: 'medium' },
            bottom: { style: 'medium' },
            right: { style: 'medium' }
          }
        }
      };

      const titleMergeRange = type === 'penjualan'
        ? { s: { r: 0, c: 0 }, e: { r: 0, c: 7 } }
        : { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } };

      const lastRow = formattedData.length + 2;
      const totalMergeRange = type === 'penjualan'
        ? { s: { r: lastRow, c: 0 }, e: { r: lastRow, c: 4 } }
        : { s: { r: lastRow, c: 0 }, e: { r: lastRow, c: 3 } };

      worksheet['!merges'] = [titleMergeRange, totalMergeRange];

      worksheet['!rows'] = [
        { hpt: 30 },
        { hpt: 25 },
        ...Array(formattedData.length).fill({ hpt: 20 }),
        { hpt: 25 }
      ];

      const borderStyle = {
        border: {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        }
      };

      const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
      for (let R = range.s.r; R <= range.e.r; R++) {
        for (let C = range.s.c; C <= range.e.c; C++) {
          const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
          if (!worksheet[cellRef]) worksheet[cellRef] = { v: '', t: 's' };
          if (R !== 0) {
            worksheet[cellRef].s = borderStyle;
          }
        }
      }

      const totalRow = type === 'penjualan'
        ? {
            'ID': 'TOTAL',
            'Tanggal': '',
            'Nama Kustomer': '',
            'Nama Pegawai': '',
            'Jumlah Item': '',
            'Total Harga': formatCurrency(formattedData.reduce((sum: number, item: any) => sum + item['Total Harga'], 0)),
            'Poin Digunakan': (() => {
              const totalPoin = formattedData.reduce((sum: number, item: any) => {
                const poinValue = item['Poin Digunakan'].split(' ')[0];
                return sum + (parseInt(poinValue) || 0);
              }, 0);
              return `${totalPoin} (${formatCurrency(totalPoin * 5000)})`;
            })(),
            'Total Bayar': formatCurrency(formattedData.reduce((sum: number, item: any) => sum + item['Total Bayar'], 0))
          }
        : {
            'ID': 'TOTAL',
            'Tanggal': '',
            'Nama Pegawai': '',
            'Distributor': '',
            'Total Harga': formatCurrency(formattedData.reduce((sum: number, item: any) => sum + item['Total Harga'], 0))
          };

      XLSX.utils.sheet_add_json(worksheet, [totalRow], {
        skipHeader: true,
        origin: -1
      });

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan");

      XLSX.writeFile(workbook, `laporan_${type}_${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
      console.error('Error exporting data:', error);
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