"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface User {
  username: string;
  phone: string;
  quc: number;
  minerales: number;
  referralCode: string;
  referredBy: string | null;
  referralEarnings: number;
  miners: any[];
  mines: any[];
  createdAt: number;
}

export default function Perfil() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
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

  const formatDate = (timestamp: number) => new Date(timestamp).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });

  if (loading) return <div className="min-h-screen flex items-center justify-center" style={{background:'#FEFCE8'}}><p>Cargando...</p></div>;

  const totalMines = user?.mines?.length || 0;
  const totalMiners = user?.miners?.length || 0;
  const totalProduction = user?.mines?.reduce((acc: number, mine: any) => acc + (mine.productionPerSecond * (1 + mine.minerGroups * 0.1)), 0) || 0;

  return (
    <div className="min-h-screen pb-20" style={{ background: '#FEFCE8' }}>
      <div className="p-4" style={{ background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#92400E' }}>👤 Mi Perfil</h1>
        
        <div style={{ textAlign: 'center', padding: '1.5rem', background: 'white', borderRadius: '1rem' }}>
          <div style={{ width: '4rem', height: '4rem', borderRadius: '50%', background: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '2rem' }}>👤</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#92400E' }}>{user?.username || 'Usuario'}</h2>
          <p style={{ color: '#92400E' }}>{user?.phone}</p>
          <p style={{ fontSize: '0.875rem', color: '#92400E', marginTop: '0.5rem' }}>Member since {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}</p>
        </div>
      </div>

      <div className="p-4">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ background: 'white', padding: '1rem', borderRadius: '1rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>QUC Balance</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#F59E0B' }}>{user?.quc?.toFixed(2)}</p>
          </div>
          <div style={{ background: 'white', padding: '1rem', borderRadius: '1rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>Minerales</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8B5CF6' }}>{user?.minerales?.toFixed(2)}</p>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '1rem', padding: '1rem', marginBottom: '1rem' }}>
          <h3 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>📦 Mi Inventario</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div style={{ textAlign: 'center', padding: '0.75rem', background: '#F3F4F6', borderRadius: '0.5rem' }}>
              <p style={{ fontSize: '2rem' }}>⛏️</p>
              <p style={{ fontWeight: 'bold' }}>{totalMines}</p>
              <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>Minas</p>
            </div>
            <div style={{ textAlign: 'center', padding: '0.75rem', background: '#F3F4F6', borderRadius: '0.5rem' }}>
              <p style={{ fontSize: '2rem' }}>👷</p>
              <p style={{ fontWeight: 'bold' }}>{totalMiners}</p>
              <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>Mineros</p>
            </div>
            <div style={{ textAlign: 'center', padding: '0.75rem', background: '#F3F4F6', borderRadius: '0.5rem' }}>
              <p style={{ fontSize: '2rem' }}>📈</p>
              <p style={{ fontWeight: 'bold' }}>{totalProduction.toFixed(1)}</p>
              <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>/seg</p>
            </div>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '1rem', padding: '1rem', marginBottom: '1rem' }}>
          <h3 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>🔗 Información de Referidos</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#6B7280' }}>Tu código:</span><span style={{ fontWeight: 'bold', color: '#2563FB' }}>{user?.referralCode}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#6B7280' }}>Ganancias:</span><span style={{ fontWeight: 'bold', color: '#10B981' }}>{user?.referralEarnings?.toFixed(2)} QUC</span></div>
            {user?.referredBy && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#6B7280' }}>Te unió:</span><span style={{ fontWeight: 'bold' }}>{user.referredBy}</span></div>}
          </div>
        </div>

        <p style={{ textAlign: 'center', color: '#9CA3AF', fontSize: '0.75rem', marginTop: '2rem' }}>Asset Miner v1.0.0</p>
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