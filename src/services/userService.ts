import { querySingle } from '../lib/db';
import { UserRow } from '../lib/db-types';
import bcrypt from 'bcryptjs';

export interface CreateUserInput {
  email: string;
  password: string;
}

export interface UserResponse {
  id: string;
  email: string;
  createdAt: string;
}

export const userService = {
  async createUser({ email, password }: CreateUserInput): Promise<UserResponse> {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await querySingle<UserRow>`
      INSERT INTO users (email, password_hash)
      VALUES (${email}, ${passwordHash})
      RETURNING id, email, created_at
    `;

    if (!user) throw new Error('Failed to create user');

    return {
      id: user.id,
      email: user.email,
      createdAt: user.created_at,
    };
  },

  async validateUser(email: string, password: string): Promise<UserResponse | null> {
    const user = await querySingle<UserRow>`
      SELECT id, email, password_hash, created_at
      FROM users
      WHERE email = ${email}
    `;

    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) return null;

    return {
      id: user.id,
      email: user.email,
      createdAt: user.created_at,
    };
  },

  async getUserById(id: string): Promise<UserResponse | null> {
    const user = await querySingle<UserRow>`
      SELECT id, email, created_at
      FROM users
      WHERE id = ${id}
    `;

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      createdAt: user.created_at,
    };
  },
};
