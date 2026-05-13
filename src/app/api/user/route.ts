import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateUser, getUser, getUserByReferralCode, getUserByPhone, buyMine, buyMiner, sellMinerales, upgradeMine, updateMinerales, deposit, withdraw, MINE_COSTS, MINER_COSTS } from '@/lib/gameStore';

// GET - Get user data
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId');
  const referralCode = searchParams.get('referralCode');
  const phone = searchParams.get('phone');

  // Get user by ID
  if (userId) {
    const user = getUser(userId);
    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }
    // Update minerals from production
    updateMinerales(userId);
    return NextResponse.json(user);
  }

  // Get user by phone
  if (phone) {
    const user = getUserByPhone(phone);
    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }
    updateMinerales(user.id);
    return NextResponse.json(user);
  }

  // Get user by referral code
  if (referralCode) {
    const user = getUserByReferralCode(referralCode);
    if (!user) {
      return NextResponse.json({ error: 'Código de referido inválido' }, { status: 404 });
    }
    return NextResponse.json(user);
  }

  return NextResponse.json({ error: 'Parámetros inválidos' }, { status: 400 });
}

// POST - Create user or perform actions
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action, userId, username, phone, referralCode, mineType, minerType, amount, mineId, minerGroups } = body;

  switch (action) {
    case 'register': {
      // Register new user with phone number
      if (!username || !phone) {
        return NextResponse.json({ error: 'Nombre de usuario y teléfono son requeridos' }, { status: 400 });
      }
      const user = getOrCreateUser(username, phone, referralCode);
      return NextResponse.json(user);
    }

    case 'login': {
      // Login with phone number
      if (!phone) {
        return NextResponse.json({ error: 'Teléfono es requerido' }, { status: 400 });
      }
      const user = getUserByPhone(phone);
      if (!user) {
        return NextResponse.json({ error: 'Usuario no encontrado. Regístrate primero.' }, { status: 404 });
      }
      return NextResponse.json(user);
    }

    case 'buyMine': {
      const result = buyMine(userId, mineType);
      return NextResponse.json(result);
    }

    case 'buyMiner': {
      const result = buyMiner(userId, minerType);
      return NextResponse.json(result);
    }

    case 'sellMinerales': {
      const result = sellMinerales(userId, amount);
      return NextResponse.json(result);
    }

    case 'upgradeMine': {
      const result = upgradeMine(userId, mineId, minerGroups);
      return NextResponse.json(result);
    }

    case 'deposit': {
      const result = deposit(userId, amount);
      return NextResponse.json(result);
    }

    case 'withdraw': {
      const result = withdraw(userId, amount);
      return NextResponse.json(result);
    }

    case 'getStore': {
      // Return store items
      return NextResponse.json({
        mines: Object.entries(MINE_COSTS).map(([id, cost]) => ({
          id,
          cost,
          name: id.charAt(0).toUpperCase() + id.slice(1),
        })),
        miners: Object.entries(MINER_COSTS).map(([id, cost]) => ({
          id,
          cost,
          name: id.charAt(0).toUpperCase() + id.slice(1),
        })),
      });
    }

    default:
      return NextResponse.json({ error: 'Acción inválida' }, { status: 400 });
  }
}