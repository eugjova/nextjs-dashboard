// import { db } from '@vercel/postgres'
// import type { NextApiRequest, NextApiResponse } from 'next'
 
// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   try {
//     const user = req.body
//     const sessionId = generateSessionId()
//     await db.query(
//         'INSERT INTO sessions (sessionId, userId, createdAt) VALUES ($1, $2, $3)',
//         [sessionId, user.id, new Date()]
//       );
 
//     res.status(200).json({ sessionId })
//   } catch (error) {
//     res.status(500).json({ error: 'Internal Server Error' })
//   }
// }


// function generateSessionId() {
//     throw new Error('Function not implemented.');
// }

