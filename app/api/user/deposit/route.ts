export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { requireAuth, AuthenticatedRequest } from '@/lib/middleware';
import { UserService } from '@/lib/userService';

async function handlePOST(request: AuthenticatedRequest) {
  try {
    const user = request.user;
    const body = await request.json();
    const { amount, payment_method, payment_reference } = body;

    // Validation
    if (!amount || !payment_method) {
      return NextResponse.json(
        { success: false, message: 'Valor e método de pagamento são obrigatórios' },
        { status: 400 }
      );
    }

    const depositAmount = parseFloat(amount);
    if (isNaN(depositAmount) || depositAmount <= 0) {
      return NextResponse.json(
        { success: false, message: 'Valor do depósito deve ser maior que zero' },
        { status: 400 }
      );
    }

    if (depositAmount < 10) {
      return NextResponse.json(
        { success: false, message: 'Valor mínimo para depósito é R$ 10,00' },
        { status: 400 }
      );
    }

    if (depositAmount > 10000) {
      return NextResponse.json(
        { success: false, message: 'Valor máximo para depósito é R$ 10.000,00' },
        { status: 400 }
      );
    }

    // Ensure authenticated user exists
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Usuário não autenticado' },
        { status: 401 }
      );
    }

    // Process deposit
    const result = await UserService.processDeposit(user.id, {
      amount: depositAmount,
      payment_method,
      payment_reference
    });

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    // Get updated user data
    const updatedUser = await UserService.getUserById(user.id);

    return NextResponse.json({
      success: true,
      message: 'Depósito processado com sucesso',
      deposit: result.deposit,
      new_balance: updatedUser?.balance
    });

  } catch (error) {
    console.error('Deposit API error:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

async function handleGET(request: AuthenticatedRequest) {
  try {
    const user = request.user;
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Usuário não autenticado' },
        { status: 401 }
      );
    }

    // Get user deposit history
    const transactions = await UserService.getUserTransactions(user.id, 50);
    const deposits = transactions.filter(t => t.type === 'deposit');

    return NextResponse.json({
      success: true,
      deposits
    });

  } catch (error) {
    console.error('Get deposits error:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export const POST = requireAuth(handlePOST);
export const GET = requireAuth(handleGET);
