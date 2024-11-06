// import crypto from 'crypto';

// const algorithm = 'aes-256-cbc';
// const key = crypto.randomBytes(32); // Gunakan kunci tetap untuk produksi, jangan gunakan `randomBytes` di sini.
// const iv = crypto.randomBytes(16);  // Inisialisasi vektor untuk algoritma enkripsi.

// /**
//  * Encrypts the session data into a cookie-friendly string
//  * @param {Object} data - Session data to encrypt
//  * @returns {string} - Encrypted session string
//  */
// export function encrypt(data) {
//   const cipher = crypto.createCipheriv(algorithm, key, iv);
//   let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
//   encrypted += cipher.final('hex');
  
//   return `${iv.toString('hex')}:${encrypted}`;
// }

// /**
//  * Decrypts the session data from a cookie
//  * @param {string} encryptedData - Encrypted session string
//  * @returns {Object|null} - Decrypted session data or null if invalid
//  */
// export function decrypt(encryptedData) {
//   try {
//     const [ivHex, encrypted] = encryptedData.split(':');
//     const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(ivHex, 'hex'));
//     let decrypted = decipher.update(encrypted, 'hex', 'utf8');
//     decrypted += decipher.final('utf8');
    
//     return JSON.parse(decrypted);
//   } catch (error) {
//     console.error("Failed to decrypt session:", error);
//     return null;
//   }
// }

// export async function createSession(userId, role) {
//     const sessionData = { userId, role };
//     return encrypt(sessionData);
//   }
