'use client'; 

import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { DetailTransaksiPembelian } from '@/app/lib/placeholder-data';
import * as XLSX from 'xlsx';
import { useState } from 'react';

export default function DetailPembelianTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const [tableData] = useState(DetailTransaksiPembelian);

  const ExportExcelButton = ({ data }: { data: typeof DetailTransaksiPembelian }) => {
    const handleExport = () => {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Data Pembelian');
      XLSX.writeFile(wb, 'detailtransaksipembelian.xlsx');
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
          <div className="md:hidden">
            {tableData?.map((detailtransaksipembelian) => (
              <div
                key={detailtransaksipembelian.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{detailtransaksipembelian.id_pembelian}</p>
                    </div>
                    <p className="text-sm text-gray-500">{detailtransaksipembelian.distributorId}</p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                  <p className="text-sm text-gray-500">{detailtransaksipembelian.jumlah}</p>
                    <p className="text-xl font-medium">
                      {formatCurrency(detailtransaksipembelian.total_biaya_transaksi)}
                    </p>
                    <p>{formatDateToLocal(detailtransaksipembelian.date)}</p>
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
                  Pegawai
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Distributor
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Jumlah
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
              {tableData?.map((detailtransaksipembelian) => (
                <tr key={detailtransaksipembelian.id}>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <p>{detailtransaksipembelian.id_pembelian}</p>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {detailtransaksipembelian.distributorId}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {detailtransaksipembelian.jumlah}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatCurrency(detailtransaksipembelian.total_biaya_transaksi)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(detailtransaksipembelian.date)}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      {/* <UpdateInvoice id={detailtransaksipembelian.id} />
                      <DeleteInvoice id={detailtransaksipembelian.id} /> */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
         </div>
       </div>
     </div>
  );
}
