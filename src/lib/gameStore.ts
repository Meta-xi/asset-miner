import { sql } from '@vercel/postgres';

// Database schema
const initSchema = async () => {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(255) PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      phone VARCHAR(50) UNIQUE NOT NULL,
      quc DECIMAL(20, 2) DEFAULT 100,
      minerales DECIMAL(20, 2) DEFAULT 0,
      referral_code VARCHAR(50) UNIQUE NOT NULL,
      referred_by VARCHAR(50),
      referral_earnings DECIMAL(20, 2) DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    );
    
    CREATE TABLE IF NOT EXISTS user_mines (
      id VARCHAR(255) PRIMARY KEY,
      user_id VARCHAR(255) REFERENCES users(id),
      mine_id VARCHAR(50) NOT NULL,
      name VARCHAR(100) NOT NULL,
      level INTEGER DEFAULT 1,
      production_per_second DECIMAL(20, 4) DEFAULT 0,
      miner_groups INTEGER DEFAULT 0,
      last_update TIMESTAMP DEFAULT NOW()
    );
    
    CREATE TABLE IF NOT EXISTS user_miners (
      id VARCHAR(255) PRIMARY KEY,
      user_id VARCHAR(255) REFERENCES users(id),
      name VARCHAR(100) NOT NULL,
      type VARCHAR(50) NOT NULL,
      production DECIMAL(20, 4) DEFAULT 0,
      cost DECIMAL(20, 2) DEFAULT 0
    );
  `;
};

// User type
export interface User {
  id: string;
  username: string;
  phone: string;
  quc: number;
  minerales: number;
  referralCode: string;
  referredBy: string | null;
  referralEarnings: number;
  miners: Miner[];
  mines: UserMine[];
  createdAt: number;
}

// Miner type
export interface Miner {
  id: string;
  name: string;
  type: 'basic' | 'intermediate' | 'professional' | 'elite' | 'diamond';
  production: number;
  cost: number;
  image: string;
}

// Mine type
export interface UserMine {
  id: string;
  mineId: string;
  name: string;
  level: number;
  productionPerSecond: number;
  minerGroups: number;
  lastUpdate: number;
}

// Mine types available in store
export const MINE_TYPES: Omit<UserMine, 'id' | 'lastUpdate'>[] = [
  { mineId: 'basic', name: 'Mina Básica', level: 1, productionPerSecond: 0.5, minerGroups: 0 },
  { mineId: 'intermediate', name: 'Mina Intermedia', level: 1, productionPerSecond: 3, minerGroups: 0 },
  { mineId: 'professional', name: 'Mina Profesional', level: 1, productionPerSecond: 7, minerGroups: 0 },
  { mineId: 'elite', name: 'Mina Elite', level: 1, productionPerSecond: 20, minerGroups: 0 },
  { mineId: 'diamond', name: 'Mina Diamante', level: 1, productionPerSecond: 50, minerGroups: 0 },
];

// Mine costs
export const MINE_COSTS: Record<string, number> = {
  basic: 50,
  intermediate: 250,
  professional: 600,
  elite: 1500,
  diamond: 3500,
};

// Miner costs
export const MINER_COSTS: Record<string, number> = {
  basic: 25,
  intermediate: 100,
  professional: 300,
  elite: 750,
  diamond: 1750,
};

// Mineral sell price
export const MINERAL_PRICE = 0.10;

// Generate unique ID
function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

// Generate referral code
function generateReferralCode(): string {
  return Math.random().toString(36).substr(2, 8).toUpperCase();
}

// In-memory storage (fallback when no database)
const users: Map<string, User> = new Map();

// Create demo user if not exists
function ensureDemoUser() {
  const demoPhone = 'demo';
  if (!users.has('demo-user')) {
    const demoUser: User = {
      id: 'demo-user',
      username: 'Demo Player',
      phone: demoPhone,
      quc: 500,
      minerales: 100,
      referralCode: 'DEMO123',
      referredBy: null,
      referralEarnings: 0,
      miners: [],
      mines: [
        {
          id: 'mine-1',
          mineId: 'basic',
          name: 'Mina Básica',
          level: 1,
          productionPerSecond: 0.5,
          minerGroups: 0,
          lastUpdate: Date.now(),
        },
        {
          id: 'mine-2',
          mineId: 'intermediate',
          name: 'Mina Intermedia',
          level: 1,
          productionPerSecond: 3,
          minerGroups: 0,
          lastUpdate: Date.now(),
        },
      ],
      createdAt: Date.now(),
    };
    users.set('demo-user', demoUser);
  }
}

// Initialize demo user on module load
ensureDemoUser();

// Get or create user (by phone)
export function getOrCreateUser(username: string, phone: string, referralCode?: string): User {
  // For demo user, return the demo user
  if (phone === 'demo' || phone === 'demo123') {
    return users.get('demo-user')!;
  }
  // Check if user exists by phone
  let user = Array.from(users.values()).find(u => u.phone === phone);
  
  if (!user) {
    // Create new user
    user = {
      id: generateId(),
      username,
      phone,
      quc: 100,
      minerales: 0,
      referralCode: generateReferralCode(),
      referredBy: referralCode || null,
      referralEarnings: 0,
      miners: [],
      mines: [],
      createdAt: Date.now(),
    };
    
    // Add starter mine
    user.mines.push({
      id: generateId(),
      mineId: 'basic',
      name: 'Mina Básica',
      level: 1,
      productionPerSecond: 0.5,
      minerGroups: 0,
      lastUpdate: Date.now(),
    });
    
    users.set(user.id, user);
  }
  
  return user;
}

// Get user by ID
export function getUser(id: string): User | undefined {
  return users.get(id);
}

// Get user by phone
export function getUserByPhone(phone: string): User | undefined {
  return Array.from(users.values()).find(u => u.phone === phone);
}

// Get user by referral code
export function getUserByReferralCode(code: string): User | undefined {
  return Array.from(users.values()).find(u => u.referralCode === code);
}

// Buy a mine
export function buyMine(userId: string, mineType: string): { success: boolean; message: string } {
  const user = users.get(userId);
  if (!user) return { success: false, message: 'Usuario no encontrado' };
  
  const cost = MINE_COSTS[mineType];
  if (!cost) return { success: false, message: 'Tipo de mina inválido' };
  
  if (user.quc < cost) {
    return { success: false, message: 'QUC insuficiente' };
  }
  
  user.quc -= cost;
  
  const mineInfo = MINE_TYPES.find(m => m.mineId === mineType);
  if (!mineInfo) return { success: false, message: 'Mina no encontrada' };
  
  user.mines.push({
    id: generateId(),
    mineId: mineType,
    name: mineInfo.name,
    level: 1,
    productionPerSecond: mineInfo.productionPerSecond,
    minerGroups: 0,
    lastUpdate: Date.now(),
  });
  
  return { success: true, message: 'Mina comprada exitosamente' };
}

// Buy a miner
export function buyMiner(userId: string, minerType: string): { success: boolean; message: string } {
  const user = users.get(userId);
  if (!user) return { success: false, message: 'Usuario no encontrado' };
  
  const cost = MINER_COSTS[minerType];
  if (!cost) return { success: false, message: 'Tipo de minero inválido' };
  
  if (user.quc < cost) {
    return { success: false, message: 'QUC insuficiente' };
  }
  
  user.quc -= cost;
  
  const miner: Miner = {
    id: generateId(),
    name: `Minero ${minerType.charAt(0).toUpperCase() + minerType.slice(1)}`,
    type: minerType as any,
    production: cost / 10,
    cost,
    image: '👷',
  };
  
  user.miners.push(miner);
  
  return { success: true, message: 'Minero comprado exitosamente' };
}

// Sell minerals
export function sellMinerales(userId: string, amount: number): { success: boolean; message: string } {
  const user = users.get(userId);
  if (!user) return { success: false, message: 'Usuario no encontrado' };
  
  if (amount <= 0) return { success: false, message: 'Cantidad inválida' };
  if (user.minerales < amount) return { success: false, message: 'Minerales insuficientes' };
  
  user.minerales -= amount;
  user.quc += amount * MINERAL_PRICE;
  
  return { success: true, message: `Vendiste ${amount} minerales por ${(amount * MINERAL_PRICE).toFixed(2)} QUC` };
}

// Upgrade mine with miner groups
export function upgradeMine(userId: string, mineId: string, minerGroups: number): { success: boolean; message: string } {
  const user = users.get(userId);
  if (!user) return { success: false, message: 'Usuario no encontrado' };
  
  const mine = user.mines.find(m => m.id === mineId);
  if (!mine) return { success: false, message: 'Mina no encontrada' };
  
  if (minerGroups <= 0) return { success: false, message: 'Cantidad inválida' };
  
  const costPerGroup = 10 * mine.level;
  const totalCost = minerGroups * costPerGroup;
  
  if (user.quc < totalCost) return { success: false, message: 'QUC insuficiente' };
  
  user.quc -= totalCost;
  mine.minerGroups += minerGroups;
  mine.level += Math.floor(minerGroups / 3);
  mine.productionPerSecond *= (1 + 0.1 * minerGroups);
  
  return { success: true, message: `Mina mejorada! Nuevo nivel: ${mine.level}` };
}

// Calculate mineral production
export function calculateProduction(userId: string): number {
  const user = users.get(userId);
  if (!user) return 0;
  
  let totalProduction = 0;
  
  for (const mine of user.mines) {
    const timePassed = (Date.now() - mine.lastUpdate) / 1000;
    totalProduction += mine.productionPerSecond * timePassed;
  }
  
  for (const miner of user.miners) {
    const timePassed = (Date.now() - user.createdAt) / 1000 / 86400;
    totalProduction += miner.production * timePassed;
  }
  
  return totalProduction;
}

// Update user minerals from production
export function updateMinerales(userId: string): void {
  const user = users.get(userId);
  if (!user) return;
  
  const production = calculateProduction(userId);
  user.minerales += production;
  
  for (const mine of user.mines) {
    mine.lastUpdate = Date.now();
  }
}

// Deposit (mock)
export function deposit(userId: string, amount: number): { success: boolean; message: string } {
  const user = users.get(userId);
  if (!user) return { success: false, message: 'Usuario no encontrado' };
  
  if (amount <= 0) return { success: false, message: 'Cantidad inválida' };
  
  user.quc += amount;
  
  return { success: true, message: `Depósito de ${amount} QUC realizado` };
}

// Withdraw (mock)
export function withdraw(userId: string, amount: number): { success: boolean; message: string } {
  const user = users.get(userId);
  if (!user) return { success: false, message: 'Usuario no encontrado' };
  
  if (amount <= 0) return { success: false, message: 'Cantidad inválida' };
  if (user.quc < amount) return { success: false, message: 'QUC insuficiente' };
  
  user.quc -= amount;
  
  return { success: true, message: `Retiro de ${amount} QUC procesado` };
}