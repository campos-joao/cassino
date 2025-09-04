export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/lib/userService';
import { validateEmail } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { success: false, message: 'Email inválido' },
        { status: 400 }
      );
    }

    // Login user
    const result = await UserService.login({
      email: email.toLowerCase().trim(),
      password
    });

    if (!result.success) {
      return NextResponse.json(result, { status: 401 });
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
    console.error('Login API error:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
