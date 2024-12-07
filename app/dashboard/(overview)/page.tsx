import { oswald } from '@/app/ui/fonts';
import { fetchDashboardData, fetchRevenueData, fetchCustomerGrowthData } from '@/app/lib/data';
import { formatCurrency } from '@/app/lib/utils';
import { BanknotesIcon, UserGroupIcon, UserPlusIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { DashboardChart } from '@/app/ui/dashboard/charts';
import { StatCard } from '@/app/ui/dashboard/stat-card';

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
        <StatCard
          title="Total Penjualan"
          value={`${formatCurrency(totalPenjualan)},-`}
          Icon={BanknotesIcon}
          iconColor="text-red-500"
          iconBgColor="bg-red-50"
        />

        <StatCard
          title="Total Pelanggan"
          value={totalCustomers}
          Icon={UserGroupIcon}
          iconColor="text-blue-500"
          iconBgColor="bg-blue-50"
        />

        <StatCard
          title="Pelanggan (baru saja)"
          value={newCustomers}
          Icon={UserPlusIcon}
          iconColor="text-green-500"
          iconBgColor="bg-green-50"
        />

        <StatCard
          title="Transaksi (baru saja)"
          value={recentTransactions}
          Icon={ShoppingCartIcon}
          iconColor="text-purple-500"
          iconBgColor="bg-purple-50"
        />
      </div>

      {/* Charts */}
      <DashboardChart data={revenueData} type="revenue" />
      <DashboardChart data={customerGrowthData} type="customers" />
    </main>
  );
}