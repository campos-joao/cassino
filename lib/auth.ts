import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '@/types/user';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

export const generateToken = (user: User): string => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token: string): jwt.JwtPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
  } catch {
    return null;
  }
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { valid: boolean; message?: string } => {
  if (password.length < 6) {
    return { valid: false, message: 'Senha deve ter pelo menos 6 caracteres' };
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    return { valid: false, message: 'Senha deve conter pelo menos uma letra minúscula' };
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    return { valid: false, message: 'Senha deve conter pelo menos uma letra maiúscula' };
  }
  
  if (!/(?=.*\d)/.test(password)) {
    return { valid: false, message: 'Senha deve conter pelo menos um número' };
  }
  
  return { valid: true };
};

export const generateReferenceId = (): string => {
  return `REF_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
