import pool from './database';
import { hashPassword, comparePassword, generateToken, generateReferenceId } from './auth';
import { User, Transaction, Deposit, LoginRequest, RegisterRequest, DepositRequest, AuthResponse } from '@/types/user';

export class UserService {
  
  // Register new user
  static async register(data: RegisterRequest): Promise<AuthResponse> {
    const client = await pool.connect();
    
    try {
      // Check if user already exists
      const existingUser = await client.query(
        'SELECT id FROM users WHERE email = $1',
        [data.email]
      );
      
      if (existingUser.rows.length > 0) {
        return { success: false, message: 'Email já está em uso' };
      }
      
      // Hash password
      const hashedPassword = await hashPassword(data.password);
      
      // Create user
      const result = await client.query(
        `INSERT INTO users (email, password, name, role, balance) 
         VALUES ($1, $2, $3, 'player', 0.00) 
         RETURNING id, email, name, role, balance, status, created_at, updated_at`,
        [data.email, hashedPassword, data.name]
      );
      
      const user = result.rows[0];
      const token = generateToken(user);
      
      return { success: true, user, token };
      
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, message: 'Erro interno do servidor' };
    } finally {
      client.release();
    }
  }
  
  // Login user
  static async login(data: LoginRequest): Promise<AuthResponse> {
    const client = await pool.connect();
    
    try {
      const result = await client.query(
        'SELECT * FROM users WHERE email = $1',
        [data.email]
      );
      
      if (result.rows.length === 0) {
        return { success: false, message: 'Email ou senha incorretos' };
      }
      
      const user = result.rows[0];
      
      if (user.status !== 'active') {
        return { success: false, message: 'Conta suspensa ou banida' };
      }
      
      const isValidPassword = await comparePassword(data.password, user.password);
      
      if (!isValidPassword) {
        return { success: false, message: 'Email ou senha incorretos' };
      }
      
      // Remove password from response
      delete user.password;
      
      const token = generateToken(user);
      
      return { success: true, user, token };
      
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Erro interno do servidor' };
    } finally {
      client.release();
    }
  }
  
  // Get user by ID
  static async getUserById(id: number): Promise<User | null> {
    const client = await pool.connect();
    
    try {
      const result = await client.query(
        'SELECT id, email, name, role, balance, status, created_at, updated_at FROM users WHERE id = $1',
        [id]
      );
      
      return result.rows[0] || null;
      
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    } finally {
      client.release();
    }
  }
  
  // Update user balance
  static async updateBalance(userId: number, amount: number, type: 'add' | 'subtract'): Promise<boolean> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      const operator = type === 'add' ? '+' : '-';
      const balanceCondition = type === 'subtract' ? ' AND balance >= $1' : '';
      const query = `UPDATE users 
        SET balance = balance ${operator} $1, updated_at = CURRENT_TIMESTAMP 
        WHERE id = $2${balanceCondition}
        RETURNING balance`;
      const params = [amount, userId];
      const result = await client.query(query, params);
      
      if (result.rows.length === 0) {
        await client.query('ROLLBACK');
        return false;
      }
      
      await client.query('COMMIT');
      return true;
      
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Update balance error:', error);
      return false;
    } finally {
      client.release();
    }
  }
  
  // Create transaction
  static async createTransaction(
    userId: number, 
    type: Transaction['type'], 
    amount: number, 
    description?: string,
    referenceId?: string
  ): Promise<Transaction | null> {
    const client = await pool.connect();
    
    try {
      const result = await client.query(
        `INSERT INTO transactions (user_id, type, amount, description, reference_id) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING *`,
        [userId, type, amount, description, referenceId || generateReferenceId()]
      );
      
      return result.rows[0];
      
    } catch (error) {
      console.error('Create transaction error:', error);
      return null;
    } finally {
      client.release();
    }
  }
  
  // Get user transactions
  static async getUserTransactions(userId: number, limit: number = 50): Promise<Transaction[]> {
    const client = await pool.connect();
    
    try {
      const result = await client.query(
        'SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2',
        [userId, limit]
      );
      
      return result.rows;
      
    } catch (error) {
      console.error('Get transactions error:', error);
      return [];
    } finally {
      client.release();
    }
  }
  
  // Process deposit
  static async processDeposit(userId: number, data: DepositRequest): Promise<{ success: boolean; message?: string; deposit?: Deposit }> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Create deposit record
      const depositResult = await client.query(
        `INSERT INTO deposits (user_id, amount, payment_method, payment_reference, status) 
         VALUES ($1, $2, $3, $4, 'completed') 
         RETURNING *`,
        [userId, data.amount, data.payment_method, data.payment_reference || generateReferenceId()]
      );
      
      const deposit = depositResult.rows[0];
      
      // Update user balance
      const balanceUpdated = await this.updateBalance(userId, data.amount, 'add');
      
      if (!balanceUpdated) {
        await client.query('ROLLBACK');
        return { success: false, message: 'Erro ao atualizar saldo' };
      }
      
      // Create transaction record
      await this.createTransaction(
        userId, 
        'deposit', 
        data.amount, 
        `Depósito via ${data.payment_method}`,
        deposit.payment_reference
      );
      
      await client.query('COMMIT');
      
      return { success: true, deposit };
      
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Process deposit error:', error);
      return { success: false, message: 'Erro ao processar depósito' };
    } finally {
      client.release();
    }
  }
  
  // Get all users (admin only)
  static async getAllUsers(limit: number = 100): Promise<User[]> {
    const client = await pool.connect();
    
    try {
      const result = await client.query(
        'SELECT id, email, name, role, balance, status, created_at, updated_at FROM users ORDER BY created_at DESC LIMIT $1',
        [limit]
      );
      
      return result.rows;
      
    } catch (error) {
      console.error('Get all users error:', error);
      return [];
    } finally {
      client.release();
    }
  }
  
  // Update user status (admin only)
  static async updateUserStatus(userId: number, status: User['status']): Promise<boolean> {
    const client = await pool.connect();
    
    try {
      const result = await client.query(
        'UPDATE users SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [status, userId]
      );
      
      return (result.rowCount || 0) > 0;
      
    } catch (error) {
      console.error('Update user status error:', error);
      return false;
    } finally {
      client.release();
    }
  }

  // Update user role (admin only)
  static async updateUserRole(userId: number, role: User['role']): Promise<boolean> {
    const client = await pool.connect();
    
    try {
      const result = await client.query(
        'UPDATE users SET role = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [role, userId]
      );
      
      return (result.rowCount || 0) > 0;
      
    } catch (error) {
      console.error('Update user role error:', error);
      return false;
    } finally {
      client.release();
    }
  }
}
