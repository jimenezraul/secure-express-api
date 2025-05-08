import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env.development.local') });

// Seed roles first
const roles = [
  { id: 1, uid: 'ROL_admin_XYZ123', name: 'admin', description: 'Administrator' },
  { id: 2, uid: 'ROL_user_ABC456', name: 'user', description: 'User' },
];

// Default password: 'password123456789'
const users = [
  {
    id: 1,
    uid: 'USR_p1xM8QrYeZGnL3X0xHojkFNUAYv7rChWqE',
    email: 'example1@email.com',
    password: '$2b$10$2YC2ht8x06Yto5VAr08kben8.oxjTPrMn0yJhv8xxSVVltH3bOs4u',
    roleIds: [1], // admin
  },
  {
    id: 2,
    uid: 'USR_p2xM8QrYeZGnL3X0xHojkFNUAYv7rChWqE',
    email: 'example2@email.com',
    password: '$2b$10$2YC2ht8x06Yto5VAr08kben8.oxjTPrMn0yJhv8xxSVVltH3bOs4u',
    roleIds: [2], // user
  },
  {
    id: 3,
    uid: 'USR_p3xM8QrYeZGnL3X0xHojkFNUAYv7rChWqE',
    email: 'example3@email.com',
    password: '$2b$10$2YC2ht8x06Yto5VAr08kben8.oxjTPrMn0yJhv8xxSVVltH3bOs4u',
    roleIds: [2],
  },
  {
    id: 4,
    uid: 'USR_p4xM8QrYeZGnL3X0xHojkFNUAYv7rChWqE',
    email: 'example4@email.com',
    password: '$2b$10$2YC2ht8x06Yto5VAr08kben8.oxjTPrMn0yJhv8xxSVVltH3bOs4u',
    roleIds: [1, 2], // admin and user
  },
];

(async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  // Create roles table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS roles (
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      uid VARCHAR(100) NOT NULL UNIQUE,
      name VARCHAR(50) NOT NULL UNIQUE,
      description VARCHAR(255) NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);

  // Create users table (remove direct roleId)
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

  // Create user_roles junction table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS user_roles (
      userId INT NOT NULL,
      roleId INT NOT NULL,
      PRIMARY KEY (userId, roleId),
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (roleId) REFERENCES roles(id) ON DELETE CASCADE
    );
  `);

  // Seed roles
  for (const role of roles) {
    await connection.execute(
      'INSERT INTO roles (id, uid, name, description, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(), NOW())',
      [role.id, role.uid, role.name, role.description]
    );    
  }

  // Seed users and user_roles
  for (const user of users) {
    await connection.execute(
      'INSERT INTO users (id, uid, email, password, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(), NOW())',
      [user.id, user.uid, user.email, user.password]
    );

    for (const roleId of user.roleIds) {
      await connection.execute(
        'INSERT INTO user_roles (userId, roleId) VALUES (?, ?)',
        [user.id, roleId]
      );
    }
  }

  console.log('Seeding complete');
  await connection.end();
})();
