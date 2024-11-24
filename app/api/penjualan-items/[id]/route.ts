import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = await params.id;

  try {
    const items = await sql`
      SELECT 
        pi.*,
        p.name as nama_produk
      FROM penjualan_items pi
      JOIN products p ON pi.product_id = p.id
      WHERE pi.penjualan_id = ${id}
      ORDER BY pi.id ASC
    `;
    
    return NextResponse.json(items.rows);
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Failed to fetch penjualan items.' }, { status: 500 });
  }
} 