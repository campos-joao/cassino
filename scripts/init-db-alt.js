const { Pool } = require('pg');

// Configuração explícita do banco
const pool = new Pool({
  user: 'postgres',
  password: '123',
  host: 'localhost',
  port: 5432,
  database: 'cassino',
});

async function createTables() {
  const client = await pool.connect();
  
  try {
    console.log('📋 Creating tables...');
    
    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'player' CHECK (role IN ('player', 'admin')),
        balance DECIMAL(10,2) DEFAULT 0.00,
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'banned')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Transactions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(20) NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'bet', 'win')),
        amount DECIMAL(10,2) NOT NULL,
        description TEXT,
        status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Game sessions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS game_sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        game_type VARCHAR(50) NOT NULL,
        bet_amount DECIMAL(10,2) NOT NULL,
        win_amount DECIMAL(10,2) DEFAULT 0.00,
        result JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Tables created successfully');
    
  } finally {
    client.release();
  }
}

async function createUsers() {
  const bcrypt = require('bcryptjs');
  const client = await pool.connect();
  
  try {
    console.log('👤 Creating users...');
    
    // Hash passwords
    const adminPassword = await bcrypt.hash('Admin123!', 12);
    const playerPassword = await bcrypt.hash('Player123!', 12);
    
    // Create admin user
    await client.query(`
      INSERT INTO users (email, password, name, role, balance) 
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (email) DO NOTHING
    `, ['admin@cassino.com', adminPassword, 'Administrador', 'admin', 1000.00]);
    
    // Create test player
    await client.query(`
      INSERT INTO users (email, password, name, role, balance) 
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (email) DO NOTHING
    `, ['player@test.com', playerPassword, 'Jogador Teste', 'player', 100.00]);
    
    console.log('✅ Users created successfully');
    console.log('📧 Admin email: admin@cassino.com');
    console.log('🔑 Admin password: Admin123!');
    console.log('📧 Player email: player@test.com');
    console.log('🔑 Player password: Player123!');
    
  } finally {
    client.release();
  }
}

async function initializeDatabase() {
  try {
    console.log('🚀 Initializing database...');
    
    // Test connection
    const client = await pool.connect();
    console.log('✅ Database connection successful');
    client.release();
    
    // Create tables
    await createTables();
    
    // Create users
    await createUsers();
    
    console.log('🎉 Database initialization completed!');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run initialization
initializeDatabase();
