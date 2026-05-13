"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const DEMO_USER_ID = 'demo-user-123';

interface User {
  id: string;
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

// Demo user data - stored in localStorage for persistence
const DEMO_USER_DATA: User = {
  id: DEMO_USER_ID,
  username: 'Demo Player',
  phone: 'demo',
  quc: 500,
  minerales: 100,
  referralCode: 'DEMO123',
  referredBy: null,
  referralEarnings: 0,
  miners: [],
  mines: [
    { id: 'mine-1', mineId: 'basic', name: 'Mina Básica', level: 1, productionPerSecond: 0.5, minerGroups: 0, lastUpdate: Date.now() },
    { id: 'mine-2', mineId: 'intermediate', name: 'Mina Intermedia', level: 1, productionPerSecond: 3, minerGroups: 0, lastUpdate: Date.now() },
  ],
  createdAt: Date.now(),
};

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const pathname = usePathname();

  // Load user from localStorage on mount
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

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('assetMinerUser', JSON.stringify(user));
    }
  }, [user]);

  // Production update every 5 seconds
  useEffect(() => {
    if (user) {
      const interval = setInterval(() => {
        setUser(prev => {
          if (!prev) return prev;
          const newMinerales = prev.minerales + (prev.mines.reduce((acc: number, mine: any) => acc + mine.productionPerSecond, 0) * 5);
          return { ...prev, minerales: newMinerales };
        });
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleSkip = () => {
    // Save demo user to localStorage
    localStorage.setItem('assetMinerUser', JSON.stringify(DEMO_USER_DATA));
    setUser(DEMO_USER_DATA);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo, just save the phone/username and create a user
    const newUser: User = {
      id: 'user-' + Date.now(),
      username: username || 'Player',
      phone: phone,
      quc: 100,
      minerales: 0,
      referralCode: Math.random().toString(36).substr(2, 8).toUpperCase(),
      referredBy: null,
      referralEarnings: 0,
      miners: [],
      mines: [{ id: 'mine-1', mineId: 'basic', name: 'Mina Básica', level: 1, productionPerSecond: 0.5, minerGroups: 0, lastUpdate: Date.now() }],
      createdAt: Date.now(),
    };
    localStorage.setItem('assetMinerUser', JSON.stringify(newUser));
    setUser(newUser);
    setShowLogin(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('assetMinerUser');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#FEFCE8' }}>
        <div className="text-center">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⛏️</div>
          <p style={{ color: '#6B7280' }}>Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#FEFCE8' }}>
        <div className="bg-white p-6 rounded-xl w-full max-w-md">
          <div className="text-center mb-6">
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#F59E0B' }}>Asset Miner</h1>
            <p style={{ color: '#6B7280' }}>¡Bienvenido al mundo de la minería!</p>
          </div>

          {/* Login Form */}
          {showLogin ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151' }}>Usuario</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #D1D5DB' }}
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151' }}>Teléfono</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #D1D5DB' }}
                  placeholder="+1234567890"
                />
              </div>
              <button type="submit" style={{ width: '100%', background: '#F59E0B', color: 'white', padding: '0.75rem', borderRadius: '0.5rem', border: 'none', fontWeight: '600', cursor: 'pointer' }}>
                Iniciar Sesión
              </button>
              <button type="button" onClick={() => setShowLogin(false)} style={{ width: '100%', background: '#6B7280', color: 'white', padding: '0.75rem', borderRadius: '0.5rem', border: 'none', fontWeight: '600', cursor: 'pointer', marginTop: '0.5rem' }}>
                Volver
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <button onClick={handleSkip} style={{ width: '100%', background: '#F59E0B', color: 'white', padding: '0.75rem', borderRadius: '0.5rem', border: 'none', fontWeight: '600', cursor: 'pointer' }}>
                Saltar (Demo)
              </button>
              <button onClick={() => setShowLogin(true)} style={{ width: '100%', background: '#3B82F6', color: 'white', padding: '0.75rem', borderRadius: '0.5rem', border: 'none', fontWeight: '600', cursor: 'pointer' }}>
                Iniciar Sesión / Registrarse
              </button>
            </div>
          )}
          <p style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '1rem', textAlign: 'center' }}>
            ¡Recibes 100 QUC de bienvenida!
          </p>
        </div>
      </div>
    );
  }

  const totalProduction = user.mines.reduce((acc: number, mine: any) => acc + (mine.productionPerSecond * (1 + mine.minerGroups * 0.1)), 0);

  return (
    <div className="min-h-screen pb-20" style={{ background: '#FEFCE8' }}>
      {/* Header */}
      <div className="p-4" style={{ background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#92400E' }}>⛏️ Asset Miner</h1>
          <button onClick={handleLogout} style={{ background: '#EF4444', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', border: 'none', fontSize: '0.75rem', cursor: 'pointer' }}>
            Salir
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-white rounded-lg">
            <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>QUC</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#F59E0B' }}>{user.quc.toFixed(2)}</p>
          </div>
          <div className="text-center p-3 bg-white rounded-lg">
            <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>Minerales</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8B5CF6' }}>{user.minerales.toFixed(2)}</p>
          </div>
        </div>

        <div className="mt-4 p-3 bg-white rounded-lg">
          <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>📈 Producción por segundo</p>
          <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#10B981' }}>{totalProduction.toFixed(2)} minerales/s</p>
        </div>
      </div>

      {/* Mines */}
      <div className="p-4">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1F2937' }}>⛏️ Tus Minas</h2>

        {user.mines.length === 0 ? (
          <div className="bg-white p-6 rounded-xl text-center">
            <p style={{ color: '#6B7280' }}>No tienes minas aún.</p>
            <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>¡Compra tu primera mina en la tienda!</p>
          </div>
        ) : (
          user.mines.map((mine: any) => (
            <div key={mine.id} style={{ background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)', border: '2px solid #F59E0B', borderRadius: '1rem', padding: '1rem', marginBottom: '0.75rem' }}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 style={{ fontWeight: 'bold', color: '#92400E' }}>{mine.name}</h3>
                  <span style={{ background: '#F59E0B', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem' }}>Nivel {mine.level}</span>
                </div>
                <div className="text-right">
                  <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>Producción</p>
                  <p style={{ fontWeight: 'bold', color: '#10B981' }}>{mine.productionPerSecond.toFixed(2)}/s</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>👷 Grupos de mineros: {mine.minerGroups}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom Nav */}
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