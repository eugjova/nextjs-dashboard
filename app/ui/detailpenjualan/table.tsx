'use client'; 

import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { DetailTransaksiPenjualan } from '@/app/lib/placeholder-data';
import { useState } from 'react';
import * as XLSX from 'xlsx';

export default function DetailPenjualanTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const [tableData] = useState(DetailTransaksiPenjualan);

  const ExportExcelButton = ({ data }: { data: typeof DetailTransaksiPenjualan }) => {
    const handleExport = () => {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Data Penjualan');
      XLSX.writeFile(wb, 'detailtransaksipenjualan.xlsx');
    };

    return (
      <button
        onClick={handleExport}
        className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
      >
        Ekspor ke Excel
      </button>
    );
  };

  return (
    <div className="mt-6 flow-root">
      <ExportExcelButton data={tableData} />
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
        <div className="mb-4 flex items-center gap-4">
          </div>
          <div className="md:hidden">
            {tableData?.map((detailtransaksipenjualan) => (
              <div
                key={detailtransaksipenjualan.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{detailtransaksipenjualan.id_penjualan}</p>
                    </div>
                    <p className="text-sm text-gray-500">{detailtransaksipenjualan.id_produk}</p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                  <p className="text-xl font-medium">
                      {detailtransaksipenjualan.jumlah}
                    </p>
                    <p className="text-xl font-medium">
                      {formatCurrency(detailtransaksipenjualan.harga)}
                    </p>
                    <p>{formatDateToLocal(detailtransaksipenjualan.date)}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
              <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  ID
                </th>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Produk
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Jumlah
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Harga
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Total
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Date
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {tableData?.map((detailtransaksipenjualan) => (
                <tr key={detailtransaksipenjualan.id}>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <p>{detailtransaksipenjualan.id_penjualan}</p>
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <p>{detailtransaksipenjualan.id_produk}</p>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {detailtransaksipenjualan.jumlah}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatCurrency(detailtransaksipenjualan.harga)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatCurrency(detailtransaksipenjualan.jumlah * detailtransaksipenjualan.harga)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(detailtransaksipenjualan.date)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          
         </div>
       </div>
     </div>
  )
};
