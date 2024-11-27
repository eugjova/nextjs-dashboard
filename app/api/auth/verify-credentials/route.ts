import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { z } from 'zod';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    });

    const result = schema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid credentials format' },
        { status: 400 }
      );
    }

    const { email, password } = result.data;

    const pegawai = await sql`
      SELECT id, name, email, password
      FROM pegawai 
      WHERE email=${email}
    `;

    const user = pegawai.rows[0];
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('Verify credentials error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 