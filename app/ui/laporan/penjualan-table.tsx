import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchFilteredPenjualan } from '@/app/lib/data';

export async function LaporanPenjualanTable({
  query,
  currentPage,
  startDate,
  endDate,
}: {
  query: string;
  currentPage: number;
  startDate?: string;
  endDate?: string;
}) {
  const penjualan = await fetchFilteredPenjualan(query, currentPage, startDate, endDate);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-3 py-5 font-medium">Tanggal</th>
                <th scope="col" className="px-3 py-5 font-medium">Kustomer</th>
                <th scope="col" className="px-3 py-5 font-medium">Pegawai</th>
                <th scope="col" className="px-3 py-5 font-medium text-center">Jumlah Item</th>
                <th scope="col" className="px-3 py-5 font-medium text-right">Total</th>
                <th scope="col" className="px-3 py-5 font-medium text-center">Poin Digunakan</th>
                <th scope="col" className="px-3 py-5 font-medium text-right">Total Bayar</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {penjualan?.map((item) => (
                <tr key={item.id} className="w-full border-b py-3 text-sm last-of-type:border-none">
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(item.date)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {item.nama_customer}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {item.nama_pegawai}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-center">
                    {item.total_items}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-right">
                    {formatCurrency(item.total_amount)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-center">
                    {item.poin_used}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-right">
                    {formatCurrency(item.total_bayar)}
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