import { createTables } from '../lib/database';
import { UserService } from '../lib/userService';

async function initializeDatabase() {
  try {
    console.log('🚀 Initializing database...');
    
    // Create tables
    await createTables();
    console.log('✅ Database tables created successfully');
    
    // Create admin user
    const adminResult = await UserService.register({
      email: 'admin@cassino.com',
      password: 'Admin123!',
      name: 'Administrador'
    });
    
    if (adminResult.success && adminResult.user) {
      // Update user role to admin
      console.log('✅ Admin user created successfully');
      console.log('📧 Admin email: admin@cassino.com');
      console.log('🔑 Admin password: Admin123!');
    }
    
    // Create test player
    const playerResult = await UserService.register({
      email: 'player@test.com',
      password: 'Player123!',
      name: 'Jogador Teste'
    });
    
    if (playerResult.success) {
      console.log('✅ Test player created successfully');
      console.log('📧 Player email: player@test.com');
      console.log('🔑 Player password: Player123!');
    }
    
    console.log('🎉 Database initialization completed!');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

// Run initialization
initializeDatabase();
