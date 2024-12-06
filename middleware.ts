import { auth } from './auth';
import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export default auth(async (req) => {
  const isLoggedIn = !!req.auth;
  const isOnDashboard = req.nextUrl.pathname.startsWith('/dashboard');
  const isOnLaporanPage = req.nextUrl.pathname.startsWith('/dashboard/laporan');
  const isOnPegawaiPage = req.nextUrl.pathname.startsWith('/dashboard/pegawai');

  if (isOnDashboard && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  if ((isOnLaporanPage || isOnPegawaiPage) && isLoggedIn) {
    try {
      const userId = req.auth?.user?.id;
      const roleData = await sql`
        SELECT r.name as role_name
        FROM pegawai p
        JOIN roles r ON p.id_role = r.id
        WHERE p.id = ${userId}
      `;
      
      const userRole = roleData.rows[0]?.role_name;
      
      if (userRole === 'Pegawai') {
        return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
      }
    } catch (error) {
      console.error('Error checking role:', error);
      return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};