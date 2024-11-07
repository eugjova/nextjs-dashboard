import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import type { Pegawai } from './app/lib/definitions';
import bcrypt from 'bcrypt';

async function getPegawai(email: string): Promise<Pegawai | undefined> {
    try {
        const pegawai = await sql<Pegawai>`SELECT * FROM pegawai WHERE email=${email}`;
        return pegawai.rows[0];
    } catch (error) {
        console.error('Failed to fetch pegawai:', error);
        throw new Error('Failed to fetch pegawai.');
    }
}

export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                //   console.log('Credentials parsed successfully');
                    const { email, password } = parsedCredentials.data;
                    // console.log('Email:', email);
                    // console.log('Password (plaintext):', password);

                    const pegawai = await getPegawai(email);
                    console.log('Retrieved pegawai:', pegawai);

                    if (!pegawai) {
                      console.log('No pegawai found for the given email');
                      return null;
                    }

                    const passwordsMatch = await bcrypt.compare(password, pegawai.password);
                     console.log('Do passwords match?', passwordsMatch);

                    if (passwordsMatch) return pegawai;
                }

                console.log('Invalid credentials');
                return null;
            },
        }),
    ],
});