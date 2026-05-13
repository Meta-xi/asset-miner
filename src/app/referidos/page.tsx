"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const DEMO_USER_ID = 'demo-user-123';

interface User {
  referralCode: string;
  referredBy: string | null;
  referralEarnings: number;
}

export default function Referidos() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    fetch(`/api/user?userId=${DEMO_USER_ID}`).then(res => res.json()).then(data => { setUser(data); setLoading(false); });
  }, []);

  const copyToClipboard = () => {
    if (user?.referralCode) {
      navigator.clipboard.writeText(user.referralCode);
      alert('¡Código copiado al portapapeles!');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center" style={{background:'#FEFCE8'}}><p>Cargando...</p></div>;

  return (
    <div className="min-h-screen pb-20" style={{ background: '#FEFCE8' }}>
      <div className="p-4">
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1F2937' }}>👥 Equipo de Referidos</h1>

        <div style={{ background: 'linear-gradient(135deg, #DBEAFE 0%, #93C5FD 100%)', textAlign: 'center', padding: '1.5rem', borderRadius: '1rem', marginBottom: '1rem' }}>
          <p style={{ fontSize: '0.875rem', color: '#1E40AF', marginBottom: '0.5rem' }}>Tu código de referido</p>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563EB', letterSpacing: '0.1em' }}>{user?.referralCode || 'N/A'}</p>
          <button onClick={copyToClipboard} style={{ background: '#2563EB', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', marginTop: '1rem' }}>
            📋 Copiar código
          </button>
          <p style={{ fontSize: '0.875rem', color: '#1E40AF', marginTop: '1rem' }}>¡Comparte y gana QUC!</p>
        </div>

        <div style={{ background: 'white', borderRadius: '1rem', padding: '1rem', marginBottom: '1rem' }}>
          <h3 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>💰 Ganancias por Referidos</h3>
          <div style={{ textAlign: 'center', padding: '1rem', background: '#ECFDF5', borderRadius: '0.5rem' }}>
            <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>Total ganado</p>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10B981' }}>{user?.referralEarnings.toFixed(2) || 0} QUC</p>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '1rem', padding: '1rem' }}>
          <h3 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>📚 ¿Cómo funciona?</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.5rem' }}>1️⃣</span>
              <div><p style={{ fontWeight: 'bold' }}>Comparte tu código</p><p style={{ fontSize: '0.875rem', color: '#6B7280' }}>Envía tu código a amigos</p></div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.5rem' }}>2️⃣</span>
              <div><p style={{ fontWeight: 'bold' }}>Se registran</p><p style={{ fontSize: '0.875rem', color: '#6B7280' }}>Usan tu código al crear cuenta</p></div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.5rem' }}>3️⃣</span>
              <div><p style={{ fontWeight: 'bold' }}>Ganas recompensas</p><p style={{ fontSize: '0.875rem', color: '#6B7280' }}>Recibes QUC por cada referido</p></div>
            </div>
          </div>
        </div>

        {user?.referredBy && (
          <div style={{ marginTop: '1rem', padding: '1rem', background: '#F3F4F6', borderRadius: '0.5rem' }}>
            <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>Te unió un referido: <strong>{user.referredBy}</strong></p>
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