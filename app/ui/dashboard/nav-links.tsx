'use client';

import {
  HomeIcon,
  UserGroupIcon,
  BuildingStorefrontIcon,
  UsersIcon,
  ShoppingBagIcon,
  ArrowUpOnSquareIcon,
  ArrowDownOnSquareIcon,
  DocumentChartBarIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useSession } from 'next-auth/react';

const getLinks = (role: string) => {
  const baseLinks = [
    { name: 'Home', href: '/dashboard', icon: HomeIcon },
    { name: 'Products', href: '/dashboard/products', icon: ShoppingBagIcon },
    { name: 'Pegawai', href: '/dashboard/pegawai', icon: UsersIcon },
    { name: 'Customers', href: '/dashboard/customers', icon: UserGroupIcon },
    { name: 'Distributor', href: '/dashboard/distributors', icon: BuildingStorefrontIcon },
    { name: 'Penjualan', href: '/dashboard/penjualan', icon: ArrowUpOnSquareIcon },
    { name: 'Pembelian', href: '/dashboard/pembelian', icon: ArrowDownOnSquareIcon },
  ];

  if (role === 'Owner') {
    baseLinks.push({ name: 'Laporan', href: '/dashboard/laporan', icon: DocumentChartBarIcon });
  }

  return baseLinks;
};

type NavLinksProps = {
  collapsed: boolean;
};

export default function NavLinks({ collapsed }: NavLinksProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = session?.user?.role_name;

  const links = getLinks(userRole || '');

  const isActiveRoute = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

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
                'bg-gradient-to-r from-red-700 to-red-500 hover:text-yellow-400': isActiveRoute(link.href),
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

