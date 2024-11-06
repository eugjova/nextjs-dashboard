import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  InboxIcon,
} from '@heroicons/react/24/outline';
import { oswald } from '@/app/ui/fonts';
import { fetchCardData } from '@/app/lib/data';

const iconMap = {
  collected: BanknotesIcon,
  customers: UserGroupIcon,
  pending: ClockIcon,
  invoices: InboxIcon,
};

export default async function CardWrapper() {
  const {
    numberOfInvoices,
    numberOfCustomers,
    totalPaidInvoices,
    totalPendingInvoices,
  } = await fetchCardData();
  
  return (
    <div className="flex items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="container max-w-8xl px-5 mx-auto my-28">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <Card title="Collected" value={`$${totalPaidInvoices}`} type="collected" />
          <Card title="Pending" value={`$${totalPendingInvoices}`} type="pending" />
          <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
          <Card title="Total Customers" value={numberOfCustomers} type="customers" />
        </div>
      </div>
    </div>
  );
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: 'invoices' | 'customers' | 'pending' | 'collected';
}) {
  const Icon = iconMap[type];

  return (
    <div className="p-6 bg-black rounded shadow-sm">
      <div className="flex justify-between items-center space-x-4">
        <div>
          <div className="text-gray-400">{title}</div>
          <div className={`${oswald.className} text-2xl font-bold text-white`}>{value}</div>
        </div>
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-900 text-gray-400">
          {Icon && <Icon className="h-8 w-8" />}
        </div>
      </div>
    </div>
  );
}
