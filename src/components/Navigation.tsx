"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Types
interface User {
  id: string;
  username: string;
  email: string;
  quc: number;
  minerales: number;
  referralCode: string;
  referredBy: string | null;
  miners: any[];
  mines: any[];
}

interface UserMine {
  id: string;
  mineId: string;
  name: string;
  level: number;
  productionPerSecond: number;
  minerGroups: number;
}

// Component props
interface BottomNavProps {
  user: User;
}

export default function BottomNav({ user }: BottomNavProps) {
  const pathname = usePathname();

  const navItems = [
    { path: '/', icon: '⛏️', label: 'Minas' },
    { path: '/tienda', icon: '🏪', label: 'Tienda' },
    { path: '/wallet', icon: '💰', label: 'Wallet' },
    { path: '/referidos', icon: '👥', label: 'Equipo' },
    { path: '/perfil', icon: '👤', label: 'Perfil' },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <Link
          key={item.path}
          href={item.path}
          className={`bottom-nav-item ${pathname === item.path ? 'active' : ''}`}
        >
          <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}

// API helper functions
export async function registerUser(username: string, email: string, referralCode?: string): Promise<User> {
  const response = await fetch('/api/user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'register', username, email, referralCode }),
  });
  if (!response.ok) throw new Error('Error al registrar');
  return response.json();
}

export async function getUser(userId: string): Promise<User> {
  const response = await fetch(`/api/user?userId=${userId}`);
  if (!response.ok) throw new Error('Error al obtener usuario');
  return response.json();
}

export async function buyMine(userId: string, mineType: string): Promise<{ success: boolean; message: string }> {
  const response = await fetch('/api/user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'buyMine', userId, mineType }),
  });
  return response.json();
}

export async function buyMiner(userId: string, minerType: string): Promise<{ success: boolean; message: string }> {
  const response = await fetch('/api/user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'buyMiner', userId, minerType }),
  });
  return response.json();
}

export async function sellMinerales(userId: string, amount: number): Promise<{ success: boolean; message: string }> {
  const response = await fetch('/api/user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'sellMinerales', userId, amount }),
  });
  return response.json();
}

export async function upgradeMine(userId: string, mineId: string, minerGroups: number): Promise<{ success: boolean; message: string }> {
  const response = await fetch('/api/user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'upgradeMine', userId, mineId, minerGroups }),
  });
  return response.json();
}

export async function deposit(userId: string, amount: number): Promise<{ success: boolean; message: string }> {
  const response = await fetch('/api/user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'deposit', userId, amount }),
  });
  return response.json();
}

export async function withdraw(userId: string, amount: number): Promise<{ success: boolean; message: string }> {
  const response = await fetch('/api/user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'withdraw', userId, amount }),
  });
  return response.json();
}