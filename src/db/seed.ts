import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env.development.local') });

// default password: 'password123456789',
const users = [
  {
    id: 1,
    uid: 'USR_p1xM8QrYeZGnL3X0xHojkFNUAYv7rChWqE',
    email: 'example1@email.com',
    password: '$2b$10$2YC2ht8x06Yto5VAr08kben8.oxjTPrMn0yJhv8xxSVVltH3bOs4u',
  },
  {
    id: 2,
    uid: 'USR_p2xM8QrYeZGnL3X0xHojkFNUAYv7rChWqE',
    email: 'example2@email.com',
    password: '$2b$10$2YC2ht8x06Yto5VAr08kben8.oxjTPrMn0yJhv8xxSVVltH3bOs4u',
  },
  {
    id: 3,
    uid: 'USR_p3xM8QrYeZGnL3X0xHojkFNUAYv7rChWqE',
    email: 'example3@email.com',
    password: '$2b$10$2YC2ht8x06Yto5VAr08kben8.oxjTPrMn0yJhv8xxSVVltH3bOs4u',
  },
  {
    id: 4,
    uid: 'USR_p4xM8QrYeZGnL3X0xHojkFNUAYv7rChWqE',
    email: 'example4@email.com',
    password: '$2b$10$2YC2ht8x06Yto5VAr08kben8.oxjTPrMn0yJhv8xxSVVltH3bOs4u',
  },
];

(async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  // ✅ Include createdAt and updatedAt columns
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS users (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        uid VARCHAR(100) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);

  for (const user of users) {
    await connection.execute(
      'INSERT INTO users (id, uid, email, password, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(), NOW())',
      [user.id, user.uid, user.email, user.password]
    );
  }

  console.log('Seeding complete');
  await connection.end();
})();
