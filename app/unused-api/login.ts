// import { serialize } from 'cookie'
// import type { NextApiRequest, NextApiResponse } from 'next'
// import { encrypt } from '../lib/session'
 
// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const sessionData = req.body
//   const encryptedSessionData = await encrypt(sessionData)
 
//   const cookie = serialize('session', encryptedSessionData, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//     maxAge: 60 * 60 * 24 * 7, // One week
//     path: '/',
//   })
//   res.setHeader('Set-Cookie', cookie)
//   res.status(200).json({ message: 'Successfully set cookie!' })

// }