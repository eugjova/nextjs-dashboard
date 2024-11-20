'use client'; 

import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { DetailTransaksiPenjualan, penjualan } from '@/app/lib/placeholder-data';
import { useState } from 'react';
import * as XLSX from 'xlsx';
// import { fetchFilteredPenjualan } from '@/app/lib/data';

type ExportExcelButtonProps = {
  data: typeof DetailTransaksiPenjualan; // Menggunakan tipe data DetailTransaksiPenjualan
};

const ExportExcelButton = ({ data }: ExportExcelButtonProps) => {
  const handleExport = () => {
    // Membuat worksheet dari data
    const ws = XLSX.utils.json_to_sheet(data);

    // Membuat workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data Penjualan');

    // Menyimpan file Excel
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


export default async function DetailPenjualanTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  


  // const [filters, setFilters] = useState({
  //   category: "",
  // });

  // const [filtered, setFilteredLaporan] = useState(DetailTransaksiPenjualan);

  // // Fungsi untuk memfilter produk
  // const handleFilter = () => {
  //   const result = DetailTransaksiPenjualan.filter((detailtransaksipenjualan) => {
  //     return (
  //       (filters.category ? detailtransaksipenjualan.id_produk === filters.category : true) // Filter berdasarkan id_produk, bukan category
  //     );
  //   });
  //   setFilteredLaporan(result);
  // };


  // const [selectedFilter, setSelectedFilter] = useState(0);
  // const [filteredReports, setFilteredReports] = useState(0); // Start with all reports

  // const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) {
  //   const selectedFilterId = event.target.value;
  //   const selectedFilter = DetailTransaksiPenjualan.find(penjualan => penjualan.id === SelectedFilterId);
  //     if (selectedFilter) {
  //       return true; // Show all if no filter selected
  //     } else {
  //       return detailtransaksipenjualan.jenisLaporan === filterValue; // Filter by jenisLaporan
  //     }
  //   });
  //   setFilteredReports(filtered);
  // };

  // const detailtransaksipenjualan = await fetchFilteredPenjualan(query, currentPage);

  const data = DetailTransaksiPenjualan;
  return (
    <div className="mt-6 flow-root">
      <ExportExcelButton data={data} />
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
        <div className="mb-4 flex items-center gap-4">
          </div>
          <div className="md:hidden">
            {DetailTransaksiPenjualan?.map((detailtransaksipenjualan) => (
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
                      {detailtransaksipenjualan.id_jumlah}
                    </p>
                    <p className="text-xl font-medium">
                      {formatCurrency(detailtransaksipenjualan.id_harga)}
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
              {DetailTransaksiPenjualan?.map((detailtransaksipenjualan) => (
                <tr
                  key={detailtransaksipenjualan.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <p>{detailtransaksipenjualan.id_penjualan}</p>
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <p>{detailtransaksipenjualan.id_produk}</p>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {detailtransaksipenjualan.id_jumlah}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatCurrency(detailtransaksipenjualan.id_harga)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatCurrency(detailtransaksipenjualan.id_jumlah*detailtransaksipenjualan.id_harga)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(detailtransaksipenjualan.date)}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3"> 
                    </div>
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
