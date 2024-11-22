import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchFilteredPenjualan } from '@/app/lib/data';

export default async function PenjualanTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const penjualan = await fetchFilteredPenjualan(query, currentPage);

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
                <th scope="col" className="px-3 py-5 font-medium">Produk</th>
                <th scope="col" className="px-3 py-5 font-medium text-center">Jumlah</th>
                <th scope="col" className="px-3 py-5 font-medium">Total</th>
                <th scope="col" className="px-3 py-5 font-medium text-center">Poin Digunakan</th>
                <th scope="col" className="px-3 py-5 font-medium">Total Bayar</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {penjualan?.map((penjualan) => (
                <tr key={penjualan.id} className="w-full border-b py-3 text-sm last-of-type:border-none">
                  <td className="whitespace-nowrap px-3 py-3">{formatDateToLocal(penjualan.date)}</td>
                  <td className="whitespace-nowrap px-3 py-3">{penjualan.nama_customer}</td>
                  <td className="whitespace-nowrap px-3 py-3">{penjualan.nama_pegawai}</td>
                  <td className="whitespace-nowrap px-3 py-3">{penjualan.nama_produk}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-center">{penjualan.jumlah}</td>
                  <td className="whitespace-nowrap px-3 py-3">{formatCurrency(penjualan.total)}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-center">{penjualan.poin}</td>
                  <td className="whitespace-nowrap px-3 py-3">{formatCurrency(penjualan.total_bayar)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
