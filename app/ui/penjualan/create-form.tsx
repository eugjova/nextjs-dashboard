'use client';

import { CustomerField, ProductsField, PegawaiField } from '@/app/lib/definitions';
import {
  CalendarIcon,
  UserCircleIcon,
  CurrencyDollarIcon,
  ArchiveBoxIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { createPenjualan } from '@/app/lib/action';
import { useEffect, useState } from 'react';
import { formatCurrency } from '@/app/lib/utils';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import { useFormStatus } from 'react-dom';

export default function Form({ 
  customers,
  products,
  pegawai,
}: { 
  customers: CustomerField[];
  products: ProductsField[];
  pegawai: PegawaiField[];
}) {
  const router = useRouter();
  const [modal, setModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [quantity, setQuantity] = useState<number | ''>(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [usePoin, setUsePoin] = useState(false);
  const [customerPoin, setCustomerPoin] = useState(0);
  const [usedPoin, setUsedPoin] = useState(0);
  const [totalBayar, setTotalBayar] = useState(0);
  const [isToggleOn, setIsToggleOn] = useState(false);
  const [earnedPoin, setEarnedPoin] = useState(0);

  function handleChange() {
    if (modal) {
      resetForm();
    }
    setModal(!modal);
  }

  function resetForm() {
    setSelectedProduct('');
    setSelectedCustomer('');
    setQuantity(1);
    setTotalPrice(0);
    setUsePoin(false);
    setCustomerPoin(0);
    setUsedPoin(0);
    setTotalBayar(0);
    setIsToggleOn(false);
    setEarnedPoin(0);
  }

  useEffect(() => {
    if (selectedProduct && quantity) {
      const product = products.find(p => p.id === selectedProduct);
      if (product) {
        setTotalPrice(product.price * Number(quantity));
      }
    } else {
      setTotalPrice(0);
    }
  }, [selectedProduct, quantity, products]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    if (inputValue === '') {
      setQuantity('');
      return;
    }

    const value = parseInt(inputValue, 10);

    setQuantity(value);
  };

  useEffect(() => {
    if (selectedCustomer) {
      const customer = customers.find(c => c.id === selectedCustomer);
      if (customer) {
        setCustomerPoin(customer.poin);
      }
    }
  }, [selectedCustomer, customers]);

  useEffect(() => {
    if (selectedProduct && quantity) {
      const product = products.find(p => p.id === selectedProduct);
      if (product) {
        const newTotalPrice = product.price * Number(quantity);
        setTotalPrice(newTotalPrice);
        
        if (usePoin) {
          const maxPoinAllowed = Math.floor(newTotalPrice / 1000);
          if (usedPoin > maxPoinAllowed) {
            setUsedPoin(0);
          }
        }
      }
    } else {
      setTotalPrice(0);
    }
  }, [selectedProduct, quantity, products, usePoin, usedPoin]);

  useEffect(() => {
    if (totalPrice > 0) {
      const poinValue = usePoin ? usedPoin * 1000 : 0;
      const newTotalBayar = totalPrice - poinValue;
      setTotalBayar(newTotalBayar);
      
      if (!usePoin) {
        const newEarnedPoin = Math.floor(newTotalBayar / 30000) * 2;
        setEarnedPoin(newEarnedPoin);
      } else {
        setEarnedPoin(0);
      }
    } else {
      setTotalBayar(0);
      setEarnedPoin(0);
    }
  }, [totalPrice, usePoin, usedPoin]);

  const handlePoinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;

    if (!inputValue) {
      setUsedPoin(0);
      setTotalBayar(totalPrice);
      return;
    }

    while (inputValue.startsWith('0') && inputValue.length > 1) {
      inputValue = inputValue.slice(1);
    }

    const value = parseInt(inputValue);

    if (value < 0) {
      toast.error('Poin tidak boleh negatif');
      return;
    }

    if (value > customerPoin) {
      toast.error(`Poin tidak mencukupi. Sisa poin: ${customerPoin}`);
      return;
    }

    const maxPoinAllowed = Math.floor(totalPrice / 1000);
    
    if (value > maxPoinAllowed) {
      toast.error(`Maksimal poin yang dapat digunakan: ${maxPoinAllowed}`);
      return;
    }

    setUsedPoin(value);
    const poinValue = value * 1000;
    setTotalBayar(totalPrice - poinValue);
  };

  function SubmitButton() {
    const { pending } = useFormStatus();
    
    return (
      <button
        aria-disabled={pending}
        type="submit"
        className={`flex h-10 items-center rounded-lg px-4 text-sm font-medium text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 ${
          pending ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-500'
        }`}
      >
        {pending ? (
          <div className="flex items-center">
            <span>Memproses...</span>
          </div>
        ) : (
          'Buat Penjualan'
        )}
      </button>
    );
  }

  function CancelButton({ onClick }: { onClick: () => void }) {
    const { pending } = useFormStatus();
    
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        className={`flex h-10 items-center rounded-lg px-4 text-sm font-medium transition-colors ${
          pending 
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        Batal
      </button>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <button
        className="flex h-10 items-center rounded-lg bg-red-600 px-4 text-sm font-medium text-white transition-colors hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
        onClick={handleChange}
      >
        <span className="hidden md:block">Create Penjualan</span>{' '}
        <PlusIcon className="h-5 md:ml-4" />
      </button>

      {modal && (
        <div className="modal fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-full max-w-3xl rounded-xl bg-white shadow-lg" style={{ maxHeight: '90vh' }}>
            <div className="max-h-[calc(90vh-4rem)] overflow-y-auto">
              <form 
                action={async (formData) => {
                  try {
                    if (usePoin && usedPoin > 0) {
                      formData.append('usedPoin', usedPoin.toString());
                    }
                    formData.append('earnedPoin', earnedPoin.toString());
                    
                    const result = await createPenjualan(formData);
                    
                    if (result.success) {
                      toast.success('Penjualan berhasil dibuat!');
                      resetForm();
                      setModal(false);
                      router.refresh();
                    } else {
                      toast.error(result.error || 'Terjadi kesalahan');
                    }
                  } catch (error) {
                    toast.error('Terjadi kesalahan saat membuat penjualan');
                    console.error('Error:', error);
                  }
                }}
              >
                <div className="rounded-md bg-gray-50 p-4 md:p-6">
                  <div className="mb-4">
                    <label htmlFor="date" className="mb-2 block text-sm font-medium">
                      Tanggal Transaksi
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        id="date"
                        name="date"
                        className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                        required
                      />
                      <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="customer" className="mb-2 block text-sm font-medium">
                      Pilih Customer
                    </label>
                    <div className="relative">
                      <select
                        id="customer"
                        name="customerId"
                        className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                        value={selectedCustomer}
                        onChange={(e) => {
                          setSelectedCustomer(e.target.value);
                          const customer = customers.find(c => c.id === e.target.value);
                          if (customer) {
                            setCustomerPoin(customer.poin);
                          }
                        }}
                        required
                      >
                        <option value="" disabled>
                          Pilih customer
                        </option>
                        {customers.map((customer) => (
                          <option key={customer.id} value={customer.id}>
                            {customer.name} (Poin: {customer.poin})
                          </option>
                        ))}
                      </select>
                      <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="pegawai" className="mb-2 block text-sm font-medium">
                      Pilih Pegawai
                    </label>
                    <div className="relative">
                      <select
                        id="pegawai"
                        name="pegawaiId"
                        className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                        defaultValue=""
                        required
                      >
                        <option value="" disabled>
                          Pilih pegawai
                        </option>
                        {pegawai.map((peg) => (
                          <option key={peg.id} value={peg.id}>
                            {peg.name}
                          </option>
                        ))}
                      </select>
                      <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="product" className="mb-2 block text-sm font-medium">
                      Pilih Produk
                    </label>
                    <div className="relative">
                      <select
                        id="product"
                        name="productId"
                        className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                        defaultValue=""
                        onChange={(e) => setSelectedProduct(e.target.value)}
                        required
                      >
                        <option value="" disabled>
                          Pilih produk
                        </option>
                        {products.map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.name} - {formatCurrency(product.price)}
                          </option>
                        ))}
                      </select>
                      <ArchiveBoxIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="quantity" className="mb-2 block text-sm font-medium">
                      Jumlah Item
                    </label>
                    <div className="relative mt-2 rounded-md">
                      <div className="relative">
                        <input
                          id="quantity"
                          name="quantity"
                          type="number"
                          min="1"
                          step="1"
                          value={quantity}
                          onChange={handleQuantityChange}
                          pattern="[1-9]*"
                          placeholder="Masukkan jumlah"
                          className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                          required
                        />
                        <ArchiveBoxIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="total" className="mb-2 block text-sm font-medium">
                      Total Harga
                    </label>
                    <div className="relative mt-2 rounded-md">
                      <div className="relative">
                        <input
                          id="total"
                          name="total"
                          type="text"
                          value={quantity ? formatCurrency(totalPrice) : ''}
                          className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 bg-gray-100"
                          readOnly
                        />
                        <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                      </div>
                    </div>
                  </div>

                  {selectedProduct && selectedCustomer && customerPoin > 0 && totalPrice > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium">
                          Gunakan Poin (Tersedia: {customerPoin})
                        </label>
                        <div 
                          onClick={() => {
                            const newState = !isToggleOn;
                            setIsToggleOn(newState);
                            setUsePoin(newState);
                            if (!newState) {
                              setUsedPoin(0);
                              setTotalBayar(totalPrice);
                            }
                          }}
                          className="relative inline-block w-12 cursor-pointer"
                        >
                          <div className={`w-12 h-6 rounded-full transition-colors duration-200 ease-in-out ${
                            isToggleOn ? 'bg-red-600' : 'bg-gray-200'
                          }`}>
                            <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out ${
                              isToggleOn ? 'translate-x-6' : 'translate-x-0'
                            }`} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {isToggleOn && selectedProduct && selectedCustomer && customerPoin > 0 && totalPrice > 0 && (
                    <div className="mb-4">
                      <label htmlFor="poin" className="mb-2 block text-sm font-medium">
                        Jumlah Poin yang Digunakan (Tersedia: {customerPoin})
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="poin"
                          name="poin"
                          value={usedPoin}
                          onChange={handlePoinChange}
                          placeholder="Masukkan jumlah poin"
                          className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                        />
                        <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                      </div>
                      <div className="mt-2 text-sm">
                        <p className="text-gray-500">
                          Nilai Poin: {formatCurrency(usedPoin * 1000)}
                        </p>
                        <p className="text-gray-500">
                          Maksimal Poin: {Math.floor(totalPrice / 1000)}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="mb-4">
                    <label htmlFor="totalBayar" className="mb-2 block text-sm font-medium">
                      Total Bayar
                    </label>
                    <div className="relative mt-2 rounded-md">
                      <div className="relative">
                        <input
                          id="totalBayar"
                          name="totalBayar"
                          type="text"
                          value={formatCurrency(totalBayar)}
                          className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 bg-gray-100"
                          readOnly
                        />
                        <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium">
                      Informasi Poin
                    </label>
                    <div className="text-sm text-gray-500">
                      {usePoin ? (
                        <p>Tidak ada poin yang didapat karena menggunakan poin untuk pembayaran</p>
                      ) : (
                        <p>Poin yang akan didapat: {earnedPoin} poin</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="sticky bottom-0 flex justify-end gap-4 bg-white p-4 rounded-b-xl">
                  <CancelButton onClick={handleChange} />
                  <SubmitButton />
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}
