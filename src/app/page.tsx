"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Demo user ID
const DEMO_USER_ID = 'demo-user-123';

interface User {
  id: string;
  username: string;
  email: string;
  quc: number;
  minerales: number;
  referralCode: string;
  referredBy: string | null;
  referralEarnings: number;
  miners: any[];
  mines: any[];
  createdAt: number;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const pathname = usePathname();

  // Get user data
  const fetchUser = async () => {
    try {
      const res = await fetch(`/api/user?userId=${DEMO_USER_ID}`);
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
    // Refresh every 5 seconds
    const interval = setInterval(fetchUser, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleUpgrade = async (mineId: string) => {
    setUpgrading(mineId);
    try {
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'upgradeMine', userId: DEMO_USER_ID, mineId, minerGroups: 1 }),
      });
      const result = await res.json();
      alert(result.message);
      if (result.success) fetchUser();
    } catch (error) {
      alert('Error al mejorar mina');
    }
    setUpgrading(null);
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
        <RegisterForm onRegister={fetchUser} />
      </div>
    );
  }

  const totalProduction = user.mines.reduce((acc: number, mine: any) => 
    acc + (mine.productionPerSecond * (1 + mine.minerGroups * 0.1)), 0
  );

  return (
    <div className="min-h-screen pb-20" style={{ background: '#FEFCE8' }}>
      {/* Header */}
      <div className="p-4" style={{ background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#92400E', marginBottom: '1rem' }}>
          ⛏️ Asset Miner
        </h1>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-white rounded-lg">
            <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>QUC</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#F59E0B' }}>
              {user.quc.toFixed(2)}
            </p>
          </div>
          <div className="text-center p-3 bg-white rounded-lg">
            <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>Minerales</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8B5CF6' }}>
              {user.minerales.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="mt-4 p-3 bg-white rounded-lg">
          <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>📈 Producción por segundo</p>
          <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#10B981' }}>
            {totalProduction.toFixed(2)} minerales/s
          </p>
        </div>
      </div>

      {/* Mines */}
      <div className="p-4">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1F2937' }}>
          ⛏️ Tus Minas
        </h2>

        {user.mines.length === 0 ? (
          <div className="bg-white p-6 rounded-xl text-center">
            <p style={{ color: '#6B7280' }}>No tienes minas aún.</p>
            <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>¡Compra tu primera mina en la tienda!</p>
          </div>
        ) : (
          user.mines.map((mine: any) => (
            <div key={mine.id} style={{
              background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
              border: '2px solid #F59E0B',
              borderRadius: '1rem',
              padding: '1rem',
              marginBottom: '0.75rem'
            }}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 style={{ fontWeight: 'bold', color: '#92400E' }}>{mine.name}</h3>
                  <span style={{ 
                    background: '#F59E0B', 
                    color: 'white', 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem'
                  }}>
                    Nivel {mine.level}
                  </span>
                </div>
                <div className="text-right">
                  <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>Producción</p>
                  <p style={{ fontWeight: 'bold', color: '#10B981' }}>
                    {mine.productionPerSecond.toFixed(2)}/s
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                    👷 Grupos de mineros: {mine.minerGroups}
                  </p>
                </div>
                <button
                  onClick={() => handleUpgrade(mine.id)}
                  disabled={upgrading === mine.id}
                  style={{
                    background: '#F59E0B',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  {upgrading === mine.id ? '...' : 'Mejorar (+1)'}
                </button>
              </div>
            </div>
          ))
        )}

        {/* Miners */}
        {user.miners.length > 0 && (
          <div className="mt-6">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1F2937' }}>
              👷 Tus Mineros
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {user.miners.map((miner: any) => (
                <div key={miner.id} className="bg-white p-4 rounded-xl text-center">
                  <p style={{ fontSize: '2rem' }}>👷</p>
                  <p style={{ fontWeight: 'bold' }}>{miner.name}</p>
                  <p style={{ fontSize: '0.875rem', color: '#10B981' }}>
                    +{miner.production.toFixed(2)}/día
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'white',
        borderTop: '1px solid #E5E7EB',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '0.75rem',
        zIndex: 50
      }}>
        {[
          { path: '/', icon: '⛏️', label: 'Minas' },
          { path: '/tienda', icon: '🏪', label: 'Tienda' },
          { path: '/wallet', icon: '💰', label: 'Wallet' },
          { path: '/referidos', icon: '👥', label: 'Equipo' },
          { path: '/perfil', icon: '👤', label: 'Perfil' },
        ].map((item) => (
          <Link
            key={item.path}
            href={item.path}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              color: pathname === item.path ? '#F59E0B' : '#9CA3AF',
              textDecoration: 'none',
              fontSize: '0.75rem'
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}

function RegisterForm({ onRegister }: { onRegister: () => void }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'register', 
          username, 
          email, 
          referralCode: referralCode || undefined 
        }),
      });
      
      if (res.ok) {
        onRegister();
      }
    } catch (error) {
      console.error('Error:', error);
    }
    
    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-xl w-full max-w-md">
      <div className="text-center mb-6">
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#F59E0B' }}>Asset Miner</h1>
        <p style={{ color: '#6B7280' }}>¡Bienvenido al mundo de la minería!</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151' }}>Usuario</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              border: '1px solid #D1D5DB',
            }}
            placeholder="Tu nombre de usuario"
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151' }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              border: '1px solid #D1D5DB',
            }}
            placeholder="tu@email.com"
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151' }}>Código de referido (opcional)</label>
          <input
            type="text"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              border: '1px solid #D1D5DB',
            }}
            placeholder="Código de invitación"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            background: '#F59E0B',
            color: 'white',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            border: 'none',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          {loading ? 'Creando...' : '¡Empezar a minar!'}
        </button>
      </form>

      <p style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '1rem', textAlign: 'center' }}>
        ¡Recibes 100 QUC de bienvenida!
      </p>
    </div>
  );
}