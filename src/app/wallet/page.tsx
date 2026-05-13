"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface User {
  id: string;
  username: string;
  phone: string;
  quc: number;
  minerales: number;
  referralCode: string;
}

export default function Wallet() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [processing, setProcessing] = useState<'deposit' | 'withdraw' | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const savedUser = localStorage.getItem('assetMinerUser');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (e) {
        localStorage.removeItem('assetMinerUser');
      }
    }
    setLoading(false);
  }, []);

  const updateUser = (updatedUser: User) => {
    localStorage.setItem('assetMinerUser', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const handleDeposit = () => {
    if (!user) return;
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) { alert('Cantidad inválida'); return; }
    const updatedUser = { ...user, quc: user.quc + value };
    updateUser(updatedUser);
    setAmount('');
    alert(`Depósito de ${value} QUC realizado`);
  };

  const handleWithdraw = () => {
    if (!user) return;
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) { alert('Cantidad inválida'); return; }
    if (value > user.quc) { alert('QUC insuficiente'); return; }
    const updatedUser = { ...user, quc: user.quc - value };
    updateUser(updatedUser);
    setAmount('');
    alert(`Retiro de ${value} QUC procesado`);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center" style={{background:'#FEFCE8'}}><p>Cargando...</p></div>;

  return (
    <div className="min-h-screen pb-20" style={{ background: '#FEFCE8' }}>
      <div className="p-4" style={{ background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#92400E' }}>💰 Wallet</h1>
        <div style={{ textAlign: 'center', padding: '2rem', background: 'white', borderRadius: '1rem' }}>
          <p style={{ fontSize: '0.875rem', color: '#92400E', marginBottom: '0.5rem' }}>Balance disponible</p>
          <p style={{ fontSize: '3rem', fontWeight: 'bold', color: '#F59E0B' }}>{user?.quc.toFixed(2) || 0}</p>
          <p style={{ fontSize: '0.875rem', color: '#92400E' }}>QUC</p>
        </div>
      </div>

      <div className="p-4">
        <div style={{ background: 'white', borderRadius: '1rem', padding: '1rem', marginBottom: '1rem' }}>
          <h3 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>📥 Depósito</h3>
          <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '1rem' }}>Agrega fondos a tu cuenta</p>
          <div className="flex gap-2">
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Cantidad"
              style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #D1D5DB' }} />
            <button onClick={handleDeposit} disabled={processing === 'deposit'}
              style={{ background: '#10B981', color: 'white', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }}>
              {processing === 'deposit' ? '...' : 'Depositar'}
            </button>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '1rem', padding: '1rem' }}>
          <h3 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>📤 Retiro</h3>
          <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '1rem' }}>Retira tus ganancias</p>
          <div className="flex gap-2">
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Cantidad"
              style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #D1D5DB' }} />
            <button onClick={handleWithdraw} disabled={processing === 'withdraw'}
              style={{ background: '#EF4444', color: 'white', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }}>
              {processing === 'withdraw' ? '...' : 'Retirar'}
            </button>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p style={{ fontSize: '0.875rem', color: '#2563EB' }}>ℹ️ En modo demo, los depósitos crean dinero ficticio.</p>
        </div>
      </div>

      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', borderTop: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-around', padding: '0.75rem', zIndex: 50 }}>
        {[{ path: '/', icon: '⛏️', label: 'Minas' }, { path: '/tienda', icon: '🏪', label: 'Tienda' }, { path: '/wallet', icon: '💰', label: 'Wallet' }, { path: '/referidos', icon: '👥', label: 'Equipo' }, { path: '/perfil', icon: '👤', label: 'Perfil' }].map(item => (
          <Link key={item.path} href={item.path} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: pathname === item.path ? '#F59E0B' : '#9CA3AF', textDecoration: 'none', fontSize: '0.75rem' }}>
            <span style={{ fontSize: '1.5rem' }}>{item.icon}</span><span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}