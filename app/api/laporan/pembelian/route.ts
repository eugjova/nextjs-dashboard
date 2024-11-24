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
        pg.name as nama_pegawai,
        d.name as nama_distributor,
        p.jumlah,
        p.total
      FROM pembelian p
      JOIN distributors d ON p.distributorId = d.id
      JOIN pegawai pg ON p.pegawaiId = pg.id
    `;

    const conditions = [];
    const values = [];
    
    if (query) {
      conditions.push(`(d.name ILIKE $${values.length + 1} OR pg.name ILIKE $${values.length + 1})`);
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

    queryString += ` ORDER BY p.date DESC`;

    const data = await sql.query(queryString, values);
    return NextResponse.json(data.rows);
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
} 