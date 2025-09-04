export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/lib/userService';
import { validateEmail, validatePassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    // Validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, message: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { success: false, message: 'Email inválido' },
        { status: 400 }
      );
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { success: false, message: passwordValidation.message },
        { status: 400 }
      );
    }

    if (name.trim().length < 2) {
      return NextResponse.json(
        { success: false, message: 'Nome deve ter pelo menos 2 caracteres' },
        { status: 400 }
      );
    }

    // Register user
    const result = await UserService.register({
      email: email.toLowerCase().trim(),
      password,
      name: name.trim()
    });

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    // Set cookie with token
    const response = NextResponse.json(result);
    response.cookies.set('auth-token', result.token!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;

  } catch (error) {
    console.error('Register API error:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
