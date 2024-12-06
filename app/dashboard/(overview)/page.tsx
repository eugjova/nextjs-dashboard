import { oswald } from '@/app/ui/fonts';
import { fetchDashboardData, fetchRevenueData, fetchCustomerGrowthData } from '@/app/lib/data';
import { formatCurrency } from '@/app/lib/utils';
import { BanknotesIcon, UserGroupIcon, UserPlusIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { DashboardChart } from '@/app/ui/dashboard/charts';

export default async function Page() {
  const { totalCustomers, totalPenjualan, newCustomers, recentTransactions } = await fetchDashboardData();
  const revenueData = await fetchRevenueData();
  const customerGrowthData = await fetchCustomerGrowthData();

  return (
    <main>
      <h1 className={`${oswald.variable} text-xl md:text-2xl text-white mb-4`}>
        Dashboard
      </h1>
      
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 mb-6">
        {/* Card Total Penjualan */}
        <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-gray-600 font-medium">Total Penjualan</div>
              <div className={`${oswald.variable} text-2xl font-bold text-gray-900`}>
                {formatCurrency(totalPenjualan)},-
              </div>
            </div>
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-500">
              <BanknotesIcon className="w-8 h-8" />
            </div>
          </div>
        </div>

        {/* Card Total Pelanggan */}
        <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-gray-600 font-medium">Total Pelanggan</div>
              <div className={`${oswald.variable} text-2xl font-bold text-gray-900`}>
                {totalCustomers}
              </div>
            </div>
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-500">
              <UserGroupIcon className="w-8 h-8" />
            </div>
          </div>
        </div>

        {/* Card Pelanggan Baru */}
        <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-gray-600 font-medium">Pelanggan (baru saja)</div>
              <div className={`${oswald.variable} text-2xl font-bold text-gray-900`}>
                {newCustomers}
              </div>
            </div>
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-50 text-green-500">
              <UserPlusIcon className="w-8 h-8" />
            </div>
          </div>
        </div>

        {/* Card Transaksi Baru */}
        <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-gray-600 font-medium">Transaksi (baru saja)</div>
              <div className={`${oswald.variable} text-2xl font-bold text-gray-900`}>
                {recentTransactions}
              </div>
            </div>
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-purple-50 text-purple-500">
              <ShoppingCartIcon className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <DashboardChart data={revenueData} type="revenue" />
      <DashboardChart data={customerGrowthData} type="customers" />
    </main>
  );
}