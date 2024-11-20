'use client';

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  ShoppingCartIcon,
  CreditCardIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  { name: 'Products', href: '/dashboard/products', icon: ShoppingCartIcon },
  { name: 'Pegawai', href: '/dashboard/pegawai', icon: UserGroupIcon },
  { name: 'Customers', href: '/dashboard/customers', icon: UserGroupIcon },
  { name: 'Distributor', href: '/dashboard/distributors', icon: UserGroupIcon },
  { name: 'Penjualan', href: '/dashboard/penjualan', icon: CreditCardIcon ,},
  { name: 'Pembelian', href: '/dashboard/pembelian', icon: CreditCardIcon ,},
  { name: 'Detail Transaksi Penjualan', href: '/dashboard/detailpenjualan', icon: DocumentDuplicateIcon },
  { name: 'Detail Transaksi Pembelian', href: '/dashboard/detailpembelian', icon: DocumentDuplicateIcon },
];

type NavLinksProps = {
  collapsed: boolean;
};

export default function NavLinks({ collapsed }: NavLinksProps) {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[40px] items-center justify-start gap-2 rounded-md bg-white p-3 text-sm font-medium transition duration-700 hover:bg-red-500 hover:text-gray-800 md:flex-none md:justify-start md:p-2 md:px-3 mb-3 z-50',
              {
                'bg-gradient-to-r from-red-700 to-red-500 hover:text-yellow-400': pathname === link.href,
              },
            )}
          >
            <LinkIcon className="w-6" />
            {!collapsed && <p>{link.name}</p>}
          </Link>
        );
      })}
    </>
  );
}

