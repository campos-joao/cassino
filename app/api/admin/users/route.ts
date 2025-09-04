export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { requireAdmin, AuthenticatedRequest } from '@/lib/middleware';
import { UserService } from '@/lib/userService';

async function handleGET(request: AuthenticatedRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    
    const users = await UserService.getAllUsers(limit);
    
    return NextResponse.json({
      success: true,
      users
    });

  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

async function handlePUT(request: AuthenticatedRequest) {
  try {
    const body = await request.json();
    const { userId, user_id, status, role } = body;
    
    // Support both userId and user_id for compatibility
    const targetUserId = userId || user_id;

    if (!targetUserId) {
      return NextResponse.json(
        { success: false, message: 'ID do usuário é obrigatório' },
        { status: 400 }
      );
    }

    // Handle status update
    if (status) {
      if (!['active', 'suspended', 'banned'].includes(status)) {
        return NextResponse.json(
          { success: false, message: 'Status inválido' },
          { status: 400 }
        );
      }

      const success = await UserService.updateUserStatus(targetUserId, status);
      
      if (!success) {
        return NextResponse.json(
          { success: false, message: 'Erro ao atualizar status do usuário' },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Status do usuário atualizado com sucesso'
      });
    }

    // Handle role update (promotion)
    if (role) {
      if (!['player', 'admin'].includes(role)) {
        return NextResponse.json(
          { success: false, message: 'Role inválido' },
          { status: 400 }
        );
      }

      const success = await UserService.updateUserRole(targetUserId, role);
      
      if (!success) {
        return NextResponse.json(
          { success: false, message: 'Erro ao atualizar role do usuário' },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: `Usuário ${role === 'admin' ? 'promovido a administrador' : 'rebaixado a jogador'} com sucesso`
      });
    }

    return NextResponse.json(
      { success: false, message: 'Status ou role deve ser fornecido' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export const GET = requireAdmin(handleGET);
export const PUT = requireAdmin(handlePUT);
