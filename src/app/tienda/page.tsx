"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const DEMO_USER_ID = 'demo-user-123';

interface User {
  id: string;
  username: string;
  quc: number;
  minerales: number;
}

export default function Tienda() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'mines' | 'mineros' | 'minerales'>('mines');
  const [processing, setProcessing] = useState<string | null>(null);
  const [sellAmount, setSellAmount] = useState('');
  const pathname = usePathname();

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
  }, []);

  const minePrices: Record<string, number> = {
    basic: 50, intermediate: 250, professional: 600, elite: 1500, diamond: 3500,
  };

  const minerPrices: Record<string, number> = {
    basic: 25, intermediate: 100, professional: 300, elite: 750, diamond: 1750,
  };

  const mineNames: Record<string, string> = {
    basic: 'Mina Básica', intermediate: 'Mina Intermedia', professional: 'Mina Profesional',
    elite: 'Mina Elite', diamond: 'Mina Diamante',
  };

  const minerNames: Record<string, string> = {
    basic: 'Minero Básico', intermediate: 'Minero Intermedio', professional: 'Minero Profesional',
    elite: 'Minero Elite', diamond: 'Minero Diamante',
  };

  const handleBuy = async (type: 'mine' | 'miner', id: string) => {
    setProcessing(id);
    try {
      const action = type === 'mine' ? 'buyMine' : 'buyMiner';
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, userId: DEMO_USER_ID, [type === 'mine' ? 'mineType' : 'minerType']: id }),
      });
      const result = await res.json();
      alert(result.message);
      if (result.success) fetchUser();
    } catch (error) {
      alert('Error al comprar');
    }
    setProcessing(null);
  };

  const handleSell = async () => {
    const amount = parseFloat(sellAmount);
    if (isNaN(amount) || amount <= 0) { alert('Cantidad inválida'); return; }
    setProcessing('sell');
    try {
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sellMinerales', userId: DEMO_USER_ID, amount }),
      });
      const result = await res.json();
      alert(result.message);
      if (result.success) { fetchUser(); setSellAmount(''); }
    } catch (error) { alert('Error al vender'); }
    setProcessing(null);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center" style={{background:'#FEFCE8'}}><p>Cargando...</p></div>;
  if (!user) return <div className="min-h-screen flex items-center justify-center" style={{background:'#FEFCE8'}}><p>Error: usuario no encontrado</p></div>;

  return (
    <div className="min-h-screen pb-20" style={{ background: '#FEFCE8' }}>
      <div className="p-4" style={{ background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#92400E' }}>🏪 Tienda</h1>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-white rounded-lg">
            <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>TU QUC</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#F59E0B' }}>{user.quc.toFixed(2)}</p>
          </div>
          <div className="text-center p-3 bg-white rounded-lg">
            <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>TUS MINERALES</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8B5CF6' }}>{user.minerales.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex gap-2 mb-4">
          {(['mines', 'mineros', 'minerales'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: 'none', fontWeight: '600',
              background: activeTab === tab ? (tab === 'mines' ? '#F59E0B' : tab === 'mineros' ? '#3B82F6' : '#8B5CF6') : 'white',
              color: activeTab === tab ? 'white' : '#6B7280'
            }}>
              {tab === 'mines' ? '⛏️ Minas' : tab === 'mineros' ? '👷 Mineros' : '💎 Minerales'}
            </button>
          ))}
        </div>

        {activeTab === 'mines' && (
          <div>{Object.entries(minePrices).map(([id, cost]) => (
            <div key={id} style={{ background: 'white', border: '2px solid #E5E7EB', borderRadius: '0.75rem', padding: '1rem', marginBottom: '0.75rem' }}>
              <div className="flex justify-between items-center">
                <div><h3 style={{ fontWeight: 'bold' }}>{mineNames[id]}</h3><p style={{ fontSize: '0.875rem', color: '#6B7280' }}>Produce minerales constantemente</p></div>
                <button onClick={() => handleBuy('mine', id)} disabled={processing === id || user.quc < cost}
                  style={{ background: '#F59E0B', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', opacity: user.quc < cost ? 0.5 : 1 }}>
                  {processing === id ? '...' : `${cost} QUC`}
                </button>
              </div>
            </div>
          ))}</div>
        )}

        {activeTab === 'mineros' && (
          <div>{Object.entries(minerPrices).map(([id, cost]) => (
            <div key={id} style={{ background: 'white', border: '2px solid #E5E7EB', borderRadius: '0.75rem', padding: '1rem', marginBottom: '0.75rem' }}>
              <div className="flex justify-between items-center">
                <div><h3 style={{ fontWeight: 'bold' }}>{minerNames[id]}</h3><p style={{ fontSize: '0.875rem', color: '#6B7280' }}>Aumenta producción</p></div>
                <button onClick={() => handleBuy('miner', id)} disabled={processing === id || user.quc < cost}
                  style={{ background: '#3B82F6', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', opacity: user.quc < cost ? 0.5 : 1 }}>
                  {processing === id ? '...' : `${cost} QUC`}
                </button>
              </div>
            </div>
          ))}</div>
        )}

        {activeTab === 'minerales' && (
          <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1rem' }}>
            <h3 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>💎 Vender Minerales</h3>
            <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '1rem' }}>Precio: 0.10 QUC por mineral</p>
            <div className="flex gap-2">
              <input type="number" value={sellAmount} onChange={(e) => setSellAmount(e.target.value)} placeholder="Cantidad"
                style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #D1D5DB' }} />
              <button onClick={handleSell} disabled={processing === 'sell'} style={{ background: '#8B5CF6', color: 'white', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }}>
                {processing === 'sell' ? '...' : 'Vender'}
              </button>
            </div>
          </div>
        )}
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