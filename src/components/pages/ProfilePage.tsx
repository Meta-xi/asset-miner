"use client";

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

interface Props {
  user: User;
}

export default function ProfilePage({ user }: Props) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const totalMines = user.mines.length;
  const totalMiners = user.miners.length;
  const totalProduction = user.mines.reduce((acc: number, mine: any) => 
    acc + (mine.productionPerSecond * (1 + mine.minerGroups * 0.1)), 0
  );

  return (
    <div className="p-4">
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1F2937' }}>
        👤 Mi Perfil
      </h1>

      {/* Profile Header */}
      <div className="card mb-4" style={{ 
        background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
        textAlign: 'center'
      }}>
        <div style={{ 
          width: '4rem', 
          height: '4rem', 
          borderRadius: '50%', 
          background: '#F59E0B',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem',
          fontSize: '2rem'
        }}>
          👤
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#92400E' }}>
          {user.username}
        </h2>
        <p style={{ color: '#92400E' }}>{user.email}</p>
        <p style={{ fontSize: '0.875rem', color: '#92400E', marginTop: '0.5rem' }}>
          Member since {formatDate(user.createdAt)}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="card text-center">
          <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>QUC Balance</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#F59E0B' }}>
            {user.quc.toFixed(2)}
          </p>
        </div>
        <div className="card text-center">
          <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>Minerales</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8B5CF6' }}>
            {user.minerales.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Inventory */}
      <div className="card mb-4">
        <h3 style={{ fontWeight: 'bold', marginBottom: '1rem', color: '#1F2937' }}>
          📦 Mi Inventario
        </h3>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p style={{ fontSize: '2rem' }}>⛏️</p>
            <p style={{ fontWeight: 'bold' }}>{totalMines}</p>
            <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>Minas</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p style={{ fontSize: '2rem' }}>👷</p>
            <p style={{ fontWeight: 'bold' }}>{totalMiners}</p>
            <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>Mineros</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p style={{ fontSize: '2rem' }}>📈</p>
            <p style={{ fontWeight: 'bold' }}>{totalProduction.toFixed(1)}</p>
            <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>/seg</p>
          </div>
        </div>
      </div>

      {/* Referral Info */}
      <div className="card mb-4">
        <h3 style={{ fontWeight: 'bold', marginBottom: '1rem', color: '#1F2937' }}>
          🔗 Información de Referidos
        </h3>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span style={{ color: '#6B7280' }}>Tu código:</span>
            <span style={{ fontWeight: 'bold', color: '#2563EB' }}>{user.referralCode}</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: '#6B7280' }}>Ganancias por referidos:</span>
            <span style={{ fontWeight: 'bold', color: '#10B981' }}>{user.referralEarnings.toFixed(2)} QUC</span>
          </div>
          {user.referredBy && (
            <div className="flex justify-between">
              <span style={{ color: '#6B7280' }}>Te unió:</span>
              <span style={{ fontWeight: 'bold' }}>{user.referredBy}</span>
            </div>
          )}
        </div>
      </div>

      {/* Settings (placeholder) */}
      <div className="card">
        <h3 style={{ fontWeight: 'bold', marginBottom: '1rem', color: '#1F2937' }}>
          ⚙️ Configuración
        </h3>
        
        <div className="space-y-3">
          <button style={{ 
            width: '100%', 
            padding: '0.75rem', 
            background: '#E5E7EB', 
            border: 'none', 
            borderRadius: '0.5rem',
            cursor: 'pointer',
            textAlign: 'left'
          }}>
            🔔 Notificaciones
          </button>
          <button style={{ 
            width: '100%', 
            padding: '0.75rem', 
            background: '#E5E7EB', 
            border: 'none', 
            borderRadius: '0.5rem',
            cursor: 'pointer',
            textAlign: 'left'
          }}>
            🔒 Seguridad
          </button>
          <button style={{ 
            width: '100%', 
            padding: '0.75rem', 
            background: '#E5E7EB', 
            border: 'none', 
            borderRadius: '0.5rem',
            cursor: 'pointer',
            textAlign: 'left'
          }}>
            ❓ Ayuda
          </button>
        </div>
      </div>

      {/* Version */}
      <p style={{ textAlign: 'center', color: '#9CA3AF', fontSize: '0.75rem', marginTop: '2rem' }}>
        Asset Miner v1.0.0
      </p>
    </div>
  );
}