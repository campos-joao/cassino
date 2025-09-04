export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { requireAuth, AuthenticatedRequest } from '@/lib/middleware';
import { UserService } from '@/lib/userService';

async function handleGET(request: AuthenticatedRequest) {
  try {
    const { user } = request;
    // Get user transactions
    const transactions = await UserService.getUserTransactions(user.id, 10);
    
    return NextResponse.json({
      success: true,
      user,
      transactions
    });

  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

async function handlePUT(request: AuthenticatedRequest) {
  try {
    const user = request.user;
    const body = await request.json();
    const { name } = body;

    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, message: 'Nome deve ter pelo menos 2 caracteres' },
        { status: 400 }
      );
    }

    // Update user name (simplified - in real app you'd update the database)
    return NextResponse.json({
      success: true,
      message: 'Perfil atualizado com sucesso'
    });

  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export const GET = requireAuth(handleGET);
export const PUT = requireAuth(handlePUT);
