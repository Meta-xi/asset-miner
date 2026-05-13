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

// Component for real-time earnings display per mine
function MineEarnings({ mine }: { mine: any }) {
  const [earnings, setEarnings] = useState(0);
  
  useEffect(() => {
    // Calculate production per second for this mine
    const productionPerSecond = mine.productionPerSecond * (1 + mine.minerGroups * 0.1);
    
    // Update every 100ms for smooth animation
    const interval = setInterval(() => {
      setEarnings(prev => prev + (productionPerSecond / 10));
    }, 100);
    
    return () => clearInterval(interval);
  }, [mine.productionPerSecond, mine.minerGroups]);

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #EDE9FE 0%, #C4B5FD 100%)',
      padding: '0.5rem 0.75rem',
      borderRadius: '0.5rem',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem'
    }}>
      <span style={{ fontSize: '1rem' }}>💎</span>
      <span style={{ 
        fontWeight: 'bold', 
        color: '#7C3AED',
        fontFamily: 'monospace',
        fontSize: '1.125rem'
      }}>
        +{earnings.toFixed(2)}
      </span>
      <span style={{ fontSize: '0.75rem', color: '#7C3AED' }}>minerales</span>
    </div>
  );
}

export default function HomePage({ user, refreshUser }: Props) {
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [selectedMine, setSelectedMine] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [localMinerales, setLocalMinerales] = useState(user.minerales);

  // Refresh user data periodically to show production
  useEffect(() => {
    const interval = setInterval(() => {
      refreshUser();
    }, 5000); // Update every 5 seconds
    
    return () => clearInterval(interval);
  }, [refreshUser]);

  // Sync local state with userminerales
  useEffect(() => {
    setLocalMinerales(user.minerales);
  }, [user.minerales]);

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

  const handlePayWorkers = (mine: any) => {
    // Check if user has enough QUC to pay workers
    const workerCost = 100; // Cost per worker
    if (user.quc >= workerCost) {
      // This would need to be implemented - for now show a message
      alert('¡Trabajadores pagados! (+4 grupos de mineros)');
      refreshUser();
    } else {
      alert('No tienes suficientes QUC para pagar trabajadores. Necesitas: ' + workerCost + ' QUC');
    }
    setShowUpgradeModal(false);
  };

  const openDetailsModal = (mine: any) => {
    setSelectedMine(mine);
    setShowDetailsModal(true);
  };

  const openUpgradeModal = (mine: any) => {
    setSelectedMine(mine);
    setShowUpgradeModal(true);
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
              {localMinerales.toFixed(2)}
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
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 style={{ fontWeight: 'bold', color: '#92400E' }}>{mine.name}</h3>
                  <span className="mine-card-level">Nivel {mine.level}</span>
                </div>
                <div className="text-right">
                  <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>Producción base</p>
                  <p style={{ fontWeight: 'bold', color: '#10B981' }}>
                    {mine.productionPerSecond.toFixed(2)}/s
                  </p>
                </div>
              </div>

              {/* Real-time earnings display */}
              <div className="mb-3">
                <MineEarnings mine={mine} />
              </div>

              {/* Progress bar showing production */}
              <div className="progress-bar mb-3">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${Math.min(100, (mine.productionPerSecond / 50) * 100)}%` }}
                />
              </div>

              {/* Miner groups and buttons */}
              <div className="flex justify-between items-center flex-wrap gap-2">
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                    👷 Grupos de mineros: {mine.minerGroups}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openDetailsModal(mine)}
                    className="btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '0.375rem 0.75rem' }}
                  >
                    📋 Detalles
                  </button>
                  <button
                    onClick={() => openUpgradeModal(mine)}
                    className="btn-primary"
                    style={{ fontSize: '0.75rem', padding: '0.375rem 0.75rem' }}
                  >
                    ⬆️ Mejorar
                  </button>
                </div>
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

      {/* Details Modal */}
      {showDetailsModal && selectedMine && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#92400E' }}>
              📋 Detalles de la Mina
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span style={{ color: '#6B7280' }}>Nombre:</span>
                <span style={{ fontWeight: 'bold' }}>{selectedMine.name}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: '#6B7280' }}>Nivel:</span>
                <span style={{ fontWeight: 'bold' }}>{selectedMine.level}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: '#6B7280' }}>Producción base:</span>
                <span style={{ fontWeight: 'bold', color: '#10B981' }}>
                  {selectedMine.productionPerSecond.toFixed(2)}/s
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: '#6B7280' }}>Grupos de mineros:</span>
                <span style={{ fontWeight: 'bold' }}>{selectedMine.minerGroups}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: '#6B7280' }}>Bonus por mineros:</span>
                <span style={{ fontWeight: 'bold', color: '#10B981' }}>
                  +{(selectedMine.minerGroups * 10).toFixed(0)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: '#6B7280' }}>Producción total:</span>
                <span style={{ fontWeight: 'bold', color: '#10B981' }}>
                  {(selectedMine.productionPerSecond * (1 + selectedMine.minerGroups * 0.1)).toFixed(2)}/s
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: '#6B7280' }}>Estado:</span>
                <span style={{ fontWeight: 'bold', color: '#10B981' }}>🟢 Activa</span>
              </div>
            </div>

            <button
              onClick={() => setShowDetailsModal(false)}
              className="btn-primary w-full mt-4"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Upgrade Modal */}
      {showUpgradeModal && selectedMine && (
        <div className="modal-overlay" onClick={() => setShowUpgradeModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#92400E' }}>
              ⬆️ Mejorar Mina
            </h3>
            
            <div className="mb-4">
              <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{selectedMine.name}</p>
              <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
                Nivel actual: {selectedMine.level}
              </p>
            </div>

            <div style={{ 
              background: '#FEF3C7', 
              padding: '1rem', 
              borderRadius: '0.5rem',
              marginBottom: '1rem'
            }}>
              <p style={{ color: '#92400E', fontWeight: 'bold' }}>
                ⚠️ Esta mina necesita 4 mineros para subir al próximo nivel de Trabajo.
              </p>
              <p style={{ color: '#92400E', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                Grupos de mineros actuales: {selectedMine.minerGroups}
              </p>
            </div>

            <button
              onClick={() => handlePayWorkers(selectedMine)}
              className="btn-primary w-full mb-2"
              style={{ background: '#F59E0B' }}
            >
              💰 Pagar Trabajadores (100 QUC)
            </button>

            <button
              onClick={() => setShowUpgradeModal(false)}
              className="btn-secondary w-full"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}