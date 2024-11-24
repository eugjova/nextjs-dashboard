'use client';

import { CustomerField, ProductsField, PegawaiField } from '@/app/lib/definitions';
import {
  CalendarIcon,
  UserCircleIcon,
  CurrencyDollarIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { createPenjualan } from '@/app/lib/action';
import { useEffect, useState } from 'react';
import { formatCurrency } from '@/app/lib/utils';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import { useFormStatus } from 'react-dom';

interface ProductItem {
  productId: string;
  quantity: number;
  price: number;
  subtotal: number;
}

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
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [quantity, setQuantity] = useState<number | ''>(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [usePoin, setUsePoin] = useState(false);
  const [customerPoin, setCustomerPoin] = useState(0);
  const [usedPoin, setUsedPoin] = useState(0);
  const [totalBayar, setTotalBayar] = useState(0);
  const [isToggleOn, setIsToggleOn] = useState(false);
  const [earnedPoin, setEarnedPoin] = useState(0);
  const [productItems, setProductItems] = useState<ProductItem[]>([{ 
    productId: '', 
    quantity: 1,
    price: 0,
    subtotal: 0
  }]);

  function handleChange() {
    if (modal) {
      resetForm();
    }
    setModal(!modal);
  }

  function resetForm() {
    setSelectedCustomer('');
    setQuantity(1);
    setTotalPrice(0);
    setUsePoin(false);
    setCustomerPoin(0);
    setUsedPoin(0);
    setTotalBayar(0);
    setIsToggleOn(false);
    setEarnedPoin(0);
    setProductItems([{
      productId: '',
      quantity: 1,
      price: 0,
      subtotal: 0
    }]);
  }

  useEffect(() => {
    const total = productItems.reduce((sum, item) => sum + item.subtotal, 0);
    setTotalPrice(total);

    const poinValue = usePoin ? usedPoin * 5000 : 0;
    const newTotalBayar = total - poinValue;
    setTotalBayar(newTotalBayar);

    if (!usePoin) {
      const newEarnedPoin = Math.floor(newTotalBayar / 30000) * 2;
      setEarnedPoin(newEarnedPoin);
    } else {
      setEarnedPoin(0);
    }
  }, [productItems, usePoin, usedPoin]);

  useEffect(() => {
    if (selectedCustomer) {
      const customer = customers.find(c => c.id === selectedCustomer);
      if (customer) {
        setCustomerPoin(customer.poin);
      }
    }
  }, [selectedCustomer, customers]);

  useEffect(() => {
    if (totalPrice > 0) {
      if (usePoin) {
        const poinValue = usedPoin * 5000;
        setTotalBayar(totalPrice - poinValue);
        setEarnedPoin(0);
      } else {
        setTotalBayar(totalPrice);
        const newEarnedPoin = Math.floor(totalPrice / 30000) * 2;
        setEarnedPoin(newEarnedPoin);
      }
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

    const maxPoinAllowed = Math.floor(totalPrice / 5000);
    
    if (value > maxPoinAllowed) {
      toast.error(`Maksimal poin yang dapat digunakan: ${maxPoinAllowed}`);
      return;
    }

    setUsedPoin(value);
    const poinValue = value * 5000;
    setTotalBayar(totalPrice - poinValue);
  };

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

  const addProductItem = () => {
    setProductItems([...productItems, { 
      productId: '', 
      quantity: 1,
      price: 0,
      subtotal: 0
    }]);
  };

  const removeProductItem = (index: number) => {
    const newItems = productItems.filter((_, i) => i !== index);
    setProductItems(newItems);
    calculateTotal(newItems);
  };

  const updateProductItem = (index: number, field: keyof ProductItem, value: string | number) => {
    const newItems = [...productItems];
    const item = newItems[index];

    if (field === 'productId') {
      const product = products.find(p => p.id === value);
      item.productId = value as string;
      item.price = product?.price || 0;
      item.subtotal = item.price * item.quantity;
    } else if (field === 'quantity') {
      if (value === '') {
        item.quantity = 0;
      } else {
        const numericValue = String(value).replace(/^0+/, '');
        item.quantity = numericValue === '' ? 0 : Number(numericValue);
      }
      item.subtotal = item.price * item.quantity;
    }

    setProductItems(newItems);
    calculateTotal(newItems);
  };

  const calculateTotal = (items: ProductItem[]) => {
    const total = items.reduce((sum, item) => sum + item.subtotal, 0);
    setTotalPrice(total);
    setTotalBayar(total);
    setEarnedPoin(Math.floor(total / 100000));
  };

  const handleTogglePoin = () => {
    const newState = !isToggleOn;
    setIsToggleOn(newState);
    setUsePoin(newState);
    if (!newState) {
      setUsedPoin(0);
    }
  };

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
                    const invalidItems = productItems.some(
                      item => !item.productId || item.quantity <= 0
                    );

                    if (invalidItems) {
                      toast.error('Pastikan semua produk dipilih dan jumlah item lebih dari 0');
                      return;
                    }

                    formData.append('productCount', productItems.length.toString());
                    
                    productItems.forEach((item, index) => {
                      formData.append(`product-${index}`, item.productId);
                      formData.append(`quantity-${index}`, item.quantity.toString());
                      formData.append(`price-${index}`, item.price.toString());
                    });

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
                    <label className="mb-2 block text-sm font-medium">
                      Produk
                    </label>
                    {productItems.map((item, index) => {
                      const availableProducts = products.filter(
                        product => !productItems.some(
                          (item, i) => i !== index && item.productId === product.id
                        )
                      );

                      return (
                        <div key={index} className="px-4 py-2 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="flex-1">
                              <select
                                name={`product-${index}`}
                                value={item.productId}
                                onChange={(e) => updateProductItem(index, 'productId', e.target.value)}
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                              >
                                <option value="">Pilih produk</option>
                                {availableProducts.map((product) => (
                                  <option key={product.id} value={product.id}>
                                    {product.name} - {formatCurrency(product.price)}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="flex items-center">
                              <button
                                type="button"
                                onClick={() => updateProductItem(index, 'quantity', item.quantity - 1)}
                                className="h-10 w-10 rounded-l-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-100"
                              >
                                -
                              </button>
                              <input
                                type="number"
                                value={item.quantity === 0 ? '' : item.quantity}
                                onChange={(e) => updateProductItem(index, 'quantity', e.target.value)}
                                className="h-10 w-20 border-y border-gray-200 text-center text-sm [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                              />
                              <button
                                type="button"
                                onClick={() => updateProductItem(index, 'quantity', item.quantity + 1)}
                                className="h-10 w-10 rounded-r-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-100"
                              >
                                +
                              </button>
                            </div>

                            {productItems.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeProductItem(index)}
                                className="rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50"
                              >
                                <TrashIcon className="w-5 h-5" />
                              </button>
                            )}
                          </div>

                          {item.productId && (
                            <div className="mt-2 text-sm text-gray-500">
                              Subtotal: {formatCurrency(item.subtotal)}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {productItems[productItems.length - 1].productId && 
                     products.length > productItems.length && (
                      <button
                        type="button"
                        onClick={addProductItem}
                        className="mt-2 flex items-center gap-1 rounded-lg border border-blue-600 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50"
                      >
                        <PlusIcon className="w-4 h-4" />
                        Tambah Produk
                      </button>
                    )}
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

                  {selectedCustomer && customerPoin > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium">
                          Gunakan Poin (Tersedia: {customerPoin})
                        </label>
                        <div 
                          onClick={handleTogglePoin}
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

                  {isToggleOn && selectedCustomer && customerPoin > 0 && (
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
                          Nilai Poin: {formatCurrency(usedPoin * 5000)}
                        </p>
                        <p className="text-gray-500">
                          Maksimal Poin: {Math.floor(totalPrice / 5000)}
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
                  <button
                    type="submit"
                    disabled={productItems.some(item => !item.productId || item.quantity <= 0)}
                    className={`flex h-10 items-center rounded-lg px-4 text-sm font-medium text-white transition-colors
                      ${productItems.some(item => !item.productId || item.quantity <= 0)
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-red-600 hover:bg-red-500'
                      }`}
                  >
                    Buat Penjualan
                  </button>
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
