const { randomBytes, scryptSync } = require('crypto');
const { writeFileSync } = require('fs');
const { join } = require('path');

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hashedPassword = scryptSync(password, salt, 64);
  return `${salt}:${hashedPassword.toString("hex")}`;
}

const adminUser = {
  id: `user_${randomBytes(16).toString("hex")}`,
  email: "admin@fiyova.co",
  name: "Admin",
  password_hash: hashPassword("pass"),
  role: "admin",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

const usersFile = join(process.cwd(), 'users.json');
writeFileSync(usersFile, JSON.stringify([adminUser], null, 2));

console.log('✓ Admin user created successfully!');
console.log('Email: admin@fiyova.co');
console.log('Password: pass');
