'use client';

import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { useState } from 'react';
import { EyeIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { fetchPenjualanItems } from '@/app/lib/data';

function DetailModal({ items, penjualan, onClose }: { 
  items: any[]; 
  penjualan: any;
  onClose: () => void; 
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-3xl rounded-lg bg-white p-6" style={{ maxHeight: '80vh' }}>
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        
        <h3 className="mb-4 text-lg font-medium">Detail Transaksi</h3>
        
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(80vh - 10rem)' }}>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="sticky top-0 bg-white">
              <tr>
                <th className="px-4 py-2 text-left">Produk</th>
                <th className="px-4 py-2 text-center">Jumlah</th>
                <th className="px-4 py-2 text-right">Harga Satuan</th>
                <th className="px-4 py-2 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="px-4 py-2">{item.nama_produk}</td>
                  <td className="px-4 py-2 text-center">{item.quantity}</td>
                  <td className="px-4 py-2 text-right">{formatCurrency(item.price_per_item)}</td>
                  <td className="px-4 py-2 text-right">{formatCurrency(item.subtotal)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="px-4 py-2 text-right font-medium">Total Harga:</td>
                <td className="px-4 py-2 text-right font-medium">{formatCurrency(penjualan.total_amount)}</td>
              </tr>
              <tr>
                <td colSpan={3} className="px-4 py-2 text-right font-medium">Poin Digunakan:</td>
                <td className="px-4 py-2 text-right font-medium">{penjualan.poin_used} ({formatCurrency(penjualan.poin_used * 5000)})</td>
              </tr>
              <tr className="border-t-2 border-gray-200">
                <td colSpan={3} className="px-4 py-2 text-right font-medium">Total Bayar:</td>
                <td className="px-4 py-2 text-right font-medium">{formatCurrency(penjualan.total_bayar)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

export function PenjualanTableContainer({ penjualan }: { penjualan: any[] }) {
  const [detailItems, setDetailItems] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPenjualan, setSelectedPenjualan] = useState<any>(null);

  const handleShowDetail = async (penjualan: any) => {
    try {
      const items = await fetchPenjualanItems(penjualan.id);
      setDetailItems(items);
      setSelectedPenjualan(penjualan);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching details:', error);
    }
  };

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
                <th scope="col" className="px-3 py-5 font-medium text-center">Detail</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {penjualan?.map((penjualan) => (
                <tr key={penjualan.id} className="w-full border-b py-3 text-sm last-of-type:border-none">
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(penjualan.date)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {penjualan.nama_customer}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {penjualan.nama_pegawai}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-center">
                    {penjualan.total_items}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-right">
                    {formatCurrency(penjualan.total_amount)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-center">
                    {penjualan.poin_used}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-right">
                    {formatCurrency(penjualan.total_bayar)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-center">
                    <button
                      onClick={() => handleShowDetail(penjualan)}
                      className="rounded-md border p-2 hover:bg-gray-100"
                    >
                      <EyeIcon className="w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && selectedPenjualan && (
        <DetailModal 
          items={detailItems} 
          penjualan={selectedPenjualan}
          onClose={() => {
            setShowModal(false);
            setSelectedPenjualan(null);
          }} 
        />
      )}
    </div>
  );
} 