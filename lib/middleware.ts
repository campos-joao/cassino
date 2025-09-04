import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './auth';
import { UserService } from './userService';

export interface AuthenticatedRequest extends NextRequest {
  user?: any;
}

export async function authenticate(request: NextRequest): Promise<{ success: boolean; user?: any; message?: string }> {
  try {
    // Get token from cookie or Authorization header
    const token = request.cookies.get('auth-token')?.value || 
                  request.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return { success: false, message: 'Token de autenticação não encontrado' };
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return { success: false, message: 'Token inválido ou expirado' };
    }

    // Get user from database
    const user = await UserService.getUserById(decoded.id);
    if (!user) {
      return { success: false, message: 'Usuário não encontrado' };
    }

    if (user.status !== 'active') {
      return { success: false, message: 'Conta suspensa ou banida' };
    }

    return { success: true, user };

  } catch (error) {
    console.error('Authentication error:', error);
    return { success: false, message: 'Erro de autenticação' };
  }
}

export function requireAuth(handler: (request: AuthenticatedRequest) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const auth = await authenticate(request);
    
    if (!auth.success) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: 401 }
      );
    }

    // Add user to request
    (request as AuthenticatedRequest).user = auth.user;
    
    return handler(request as AuthenticatedRequest);
  };
}

export function requireAdmin(handler: (request: AuthenticatedRequest) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const auth = await authenticate(request);
    
    if (!auth.success) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: 401 }
      );
    }

    if (auth.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Acesso negado. Apenas administradores.' },
        { status: 403 }
      );
    }

    // Add user to request
    (request as AuthenticatedRequest).user = auth.user;
    
    return handler(request as AuthenticatedRequest);
  };
}
