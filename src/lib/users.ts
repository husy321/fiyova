import { User, SignupRequest } from "@/types";
import { randomBytes, scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const scryptAsync = promisify(scrypt);

// Persistent user storage for development
const USERS_FILE = join(process.cwd(), 'users.json');

function loadUsers(): User[] {
  try {
    if (existsSync(USERS_FILE)) {
      const data = readFileSync(USERS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading users:', error);
  }
  return [];
}

function saveUsers(users: User[]): void {
  try {
    writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error saving users:', error);
  }
}

export class UserService {
  private static async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString("hex");
    const hashedPassword = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${salt}:${hashedPassword.toString("hex")}`;
  }

  private static async verifyPassword(password: string, hash: string): Promise<boolean> {
    const [salt, storedHash] = hash.split(":");
    const hashedPassword = (await scryptAsync(password, salt, 64)) as Buffer;
    const storedHashBuffer = Buffer.from(storedHash, "hex");
    return timingSafeEqual(hashedPassword, storedHashBuffer);
  }

  static async createUser(userData: SignupRequest): Promise<Omit<User, 'password_hash'>> {
    const users = loadUsers();

    // Check if user already exists
    const existingUser = users.find(user => user.email.toLowerCase() === userData.email.toLowerCase());
    if (existingUser) {
      throw new Error("User already exists with this email");
    }

    // Hash password
    const password_hash = await this.hashPassword(userData.password);

    // Create user
    const user: User = {
      id: `user_${randomBytes(16).toString("hex")}`,
      email: userData.email.toLowerCase(),
      name: userData.name,
      password_hash,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Store user
    users.push(user);
    saveUsers(users);

    // Return user without password hash
    const { password_hash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static async findUserByEmail(email: string): Promise<User | null> {
    const users = loadUsers();
    const user = users.find(user => user.email.toLowerCase() === email.toLowerCase());
    return user || null;
  }

  static async verifyUserCredentials(email: string, password: string): Promise<Omit<User, 'password_hash'> | null> {
    const user = await this.findUserByEmail(email);
    if (!user) {
      return null;
    }

    const isValid = await this.verifyPassword(password, user.password_hash);
    if (!isValid) {
      return null;
    }

    const { password_hash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static async getUserById(id: string): Promise<Omit<User, 'password_hash'> | null> {
    const users = loadUsers();
    const user = users.find(user => user.id === id);
    if (!user) {
      return null;
    }

    const { password_hash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static getAllUsers(): Omit<User, 'password_hash'>[] {
    const users = loadUsers();
    return users.map(user => {
      const { password_hash: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }
}