// Simple in-memory data store for the mining game
// In production, this would be replaced with a real database

// User type
export interface User {
  id: string;
  username: string;
  email: string;
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
  production: number; // minerals per day
  cost: number; // cost in QUC
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
export const MINERAL_PRICE = 0.10; // QUC per mineral

// In-memory storage
const users: Map<string, User> = new Map();

// Generate unique ID
function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

// Generate referral code
function generateReferralCode(): string {
  return Math.random().toString(36).substr(2, 8).toUpperCase();
}

// Get or create user
export function getOrCreateUser(username: string, email: string, referralCode?: string): User {
  // Check if user exists by email
  let user = Array.from(users.values()).find(u => u.email === email);
  
  if (!user) {
    // Create new user
    user = {
      id: generateId(),
      username,
      email,
      quc: 100, // Starting bonus
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
  
  // Deduct cost
  user.quc -= cost;
  
  // Add new mine
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
  
  // Deduct cost
  user.quc -= cost;
  
  // Add new miner
  const miner: Miner = {
    id: generateId(),
    name: `Minero ${minerType.charAt(0).toUpperCase() + minerType.slice(1)}`,
    type: minerType as any,
    production: cost / 10, // production based on cost
    cost,
    image: `👷`,
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
  
  // Deduct minerals and add QUC
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
  
  const costPerGroup = 10 * mine.level; // Cost increases with level
  const totalCost = minerGroups * costPerGroup;
  
  if (user.quc < totalCost) return { success: false, message: 'QUC insuficiente' };
  
  // Deduct cost and add miner groups
  user.quc -= totalCost;
  mine.minerGroups += minerGroups;
  mine.level += Math.floor(minerGroups / 3); // Every 3 groups = 1 level
  mine.productionPerSecond *= (1 + 0.1 * minerGroups); // 10% per group
  
  return { success: true, message: `Mina mejorada! Nuevo nivel: ${mine.level}` };
}

// Calculate mineral production
export function calculateProduction(userId: string): number {
  const user = users.get(userId);
  if (!user) return 0;
  
  let totalProduction = 0;
  
  // Mines production
  for (const mine of user.mines) {
    const timePassed = (Date.now() - mine.lastUpdate) / 1000;
    totalProduction += mine.productionPerSecond * timePassed;
  }
  
  // Miners production (bonus)
  for (const miner of user.miners) {
    const timePassed = (Date.now() - user.createdAt) / 1000 / 86400; // days
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
  
  // Update last update times
  for (const mine of user.mines) {
    mine.lastUpdate = Date.now();
  }
}

// Deposit (mock)
export function deposit(userId: string, amount: number): { success: boolean; message: string } {
  const user = users.get(userId);
  if (!user) return { success: false, message: 'Usuario no encontrado' };
  
  if (amount <= 0) return { success: false, message: 'Cantidad inválida' };
  
  // In real app, this would integrate with payment processor
  user.quc += amount;
  
  return { success: true, message: `Depósito de ${amount} QUC realizado` };
}

// Withdraw (mock)
export function withdraw(userId: string, amount: number): { success: boolean; message: string } {
  const user = users.get(userId);
  if (!user) return { success: false, message: 'Usuario no encontrado' };
  
  if (amount <= 0) return { success: false, message: 'Cantidad inválida' };
  if (user.quc < amount) return { success: false, message: 'QUC insuficiente' };
  
  // In real app, this would integrate with payment processor
  user.quc -= amount;
  
  return { success: true, message: `Retiro de ${amount} QUC procesado` };
}