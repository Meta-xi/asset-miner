"use client";

import { useState, useEffect } from 'react';
import { getUser, upgradeMine } from '@/components/Navigation';

interface User {
  id: string;
  username: string;
  quc: number;
  minerales: number;
  mines: any[];
  miners: any[];
}

interface Props {
  user: User;
  refreshUser: () => void;
}

export default function HomePage({ user, refreshUser }: Props) {
  const [upgrading, setUpgrading] = useState<string | null>(null);

  // Refresh user data periodically to show production
  useEffect(() => {
    const interval = setInterval(() => {
      refreshUser();
    }, 5000); // Update every 5 seconds
    
    return () => clearInterval(interval);
  }, [refreshUser]);

  const handleUpgrade = async (mineId: string) => {
    setUpgrading(mineId);
    try {
      const result = await upgradeMine(user.id, mineId, 1);
      alert(result.message);
      if (result.success) {
        refreshUser();
      }
    } catch (error) {
      alert('Error al mejorar mina');
    }
    setUpgrading(null);
  };

  const totalProduction = user.mines.reduce((acc: number, mine: any) => 
    acc + (mine.productionPerSecond * (1 + mine.minerGroups * 0.1)), 0
  );

  return (
    <div className="p-4">
      {/* Header with currency */}
      <div className="card mb-4" style={{ background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)' }}>
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
          <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
            📈 Producción por segundo
          </p>
          <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#10B981' }}>
            {totalProduction.toFixed(2)} minerales/s
          </p>
        </div>
      </div>

      {/* Mines Section */}
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1F2937' }}>
          ⛏️ Tus Minas
        </h2>

        {user.mines.length === 0 ? (
          <div className="card text-center py-8">
            <p style={{ color: '#6B7280' }}>No tienes minas aún.</p>
            <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>¡Compra tu primera mina en la tienda!</p>
          </div>
        ) : (
          user.mines.map((mine: any) => (
            <div key={mine.id} className="mine-card">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 style={{ fontWeight: 'bold', color: '#92400E' }}>{mine.name}</h3>
                  <span className="mine-card-level">Nivel {mine.level}</span>
                </div>
                <div className="text-right">
                  <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>Producción</p>
                  <p style={{ fontWeight: 'bold', color: '#10B981' }}>
                    {mine.productionPerSecond.toFixed(2)}/s
                  </p>
                </div>
              </div>

              {/* Progress bar showing production */}
              <div className="progress-bar mb-3">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${Math.min(100, (mine.productionPerSecond / 50) * 100)}%` }}
                />
              </div>

              {/* Miner groups */}
              <div className="flex justify-between items-center">
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                    👷 Grupos de mineros: {mine.minerGroups}
                  </p>
                </div>
                <button
                  onClick={() => handleUpgrade(mine.id)}
                  disabled={upgrading === mine.id}
                  className="btn-primary"
                  style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                >
                  {upgrading === mine.id ? '...' : 'Mejorar (+1)'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Miners Section */}
      {user.miners.length > 0 && (
        <div className="mt-6">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1F2937' }}>
            👷 Tus Mineros
          </h2>
          
          <div className="grid grid-cols-2 gap-3">
            {user.miners.map((miner: any) => (
              <div key={miner.id} className="card text-center">
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
  );
}