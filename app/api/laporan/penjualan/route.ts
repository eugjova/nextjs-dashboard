import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || '';
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  try {
    let queryString = `
      SELECT 
        p.id,
        p.date,
        c.name as nama_customer,
        peg.name as nama_pegawai,
        COUNT(pi.id) as total_items,
        p.total_amount,
        p.total_bayar,
        p.poin_used
      FROM penjualan p
      JOIN customers c ON p.customerId = c.id
      JOIN pegawai peg ON p.pegawaiId = peg.id
      LEFT JOIN penjualan_items pi ON p.id = pi.penjualan_id
    `;

    const conditions = [];
    const values = [];
    
    if (query) {
      conditions.push(`(c.name ILIKE $${values.length + 1} OR peg.name ILIKE $${values.length + 1})`);
      values.push(`%${query}%`);
    }

    if (startDate) {
      conditions.push(`p.date >= $${values.length + 1}`);
      values.push(startDate);
    }

    if (endDate) {
      conditions.push(`p.date <= $${values.length + 1}`);
      values.push(endDate);
    }

    if (conditions.length > 0) {
      queryString += ` WHERE ${conditions.join(' AND ')}`;
    }

    queryString += `
      GROUP BY 
        p.id, 
        p.date, 
        c.name, 
        peg.name, 
        p.total_amount, 
        p.total_bayar, 
        p.poin_used
      ORDER BY p.date DESC
    `;

    const data = await sql.query(queryString, values);
    return NextResponse.json(data.rows);
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
} 