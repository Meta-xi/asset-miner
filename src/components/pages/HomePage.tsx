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

// Get mineral icon based on mineId
function getMineralIcon(mineId: string): string {
  const id = mineId.toLowerCase();
  if (id === 'oro') return '/images/minerals/oro.webp';
  if (id === 'carbon') return '/images/minerals/carbon.webp';
  if (id === 'rubi') return '/images/minerals/rubi.webp';
  if (id === 'esmeralda') return '/images/minerals/esmeralda.webp';
  return '💎';
}

// Component for real-time earnings display per mine
function MineEarnings({ mine }: { mine: any }) {
  const [earnings, setEarnings] = useState(0);
  const mineralIcon = getMineralIcon(mine.mineId);
  
  useEffect(() => {
    // Calculate production per second for this mine
    const productionPerSecond = mine.productionPerSecond * (1 + mine.minerGroups * 0.1);
    
    // Update every 100ms for smooth animation
    const interval = setInterval(() => {
      setEarnings(prev => prev + (productionPerSecond / 10));
    }, 100);
    
    return () => clearInterval(interval);
  }, [mine.productionPerSecond, mine.minerGroups]);

  const isEmoji = mineralIcon.length === 2; // Check if it's an emoji (2 chars)

  return (
    <div style={{ 
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem'
    }}>
      {isEmoji ? (
        <span style={{ fontSize: '1.5rem' }}>{mineralIcon}</span>
      ) : (
        <img 
          src={mineralIcon} 
          alt="Mineral" 
          style={{ width: '32px', height: '32px', objectFit: 'contain' }}
        />
      )}
      <span style={{ 
        fontWeight: 'bold', 
        color: '#8B5CF6',
        fontFamily: 'monospace',
        fontSize: '1.25rem'
      }}>
        +{earnings.toFixed(2)}
      </span>
    </div>
  );
}

// Get mine image based on mineId - uses custom images from user
function getMineImage(mineId: string): string | null {
  const id = mineId.toLowerCase();
  if (id === 'oro') return '/images/mines/oro.webp';
  if (id === 'carbon') return '/images/mines/carbon.webp';
  if (id === 'rubi') return '/images/mines/rubi.webp';
  if (id === 'esmeralda') return '/images/mines/esmeralda.webp';
  return null;
}

// Mine image component with custom images
function MineImage({ mineId, mineName }: { mineId: string; mineName: string }) {
  const imagePath = getMineImage(mineId);
  
  if (imagePath) {
    return (
      <div style={{
        width: '100%',
        height: '140px',
        borderRadius: '0.75rem',
        marginBottom: '0.75rem',
        overflow: 'hidden'
      }}>
        <img 
          src={imagePath} 
          alt={`Mina de ${mineName}`}
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover' 
          }}
        />
      </div>
    );
  }
  
  // Fallback placeholder
  return (
    <div style={{
      width: '100%',
      height: '120px',
      background: 'linear-gradient(135deg, #374151 0%, #1F2937 100%)',
      borderRadius: '0.75rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '0.75rem'
    }}>
      <span style={{ fontSize: '3rem' }}>⛏️</span>
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
            <div key={mine.id} className="mine-card-new">
              {/* 1. Foto de la mina */}
              <MineImage mineId={mine.mineId} mineName={mine.name} />
              
              {/* 2. Nombre (Mina de ***) */}
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h3 style={{ fontWeight: 'bold', color: '#1F2937', fontSize: '1.125rem' }}>
                    Mina de {mine.name}
                  </h3>
                  <span className="mine-card-level">Nivel {mine.level}</span>
                </div>
              </div>

              {/* 3. Icono del mineral y ganancia en minerales subiendo cada segundo */}
              <div className="mb-3">
                <MineEarnings mine={mine} />
              </div>

              {/* 4. Botón Detalles y 5. Botón Mejorar */}
              <div className="flex gap-2">
                <button
                  onClick={() => openDetailsModal(mine)}
                  className="btn-details"
                  style={{ flex: 1 }}
                >
                  📋 Detalles
                </button>
                <button
                  onClick={() => openUpgradeModal(mine)}
                  className="btn-upgrade"
                  style={{ flex: 1 }}
                >
                  ⬆️ Mejorar
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
                <span style={{ fontWeight: 'bold' }}>Mina de {selectedMine.name}</span>
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

      {/* Upgrade Modal - Improve with Workers */}
      {showUpgradeModal && selectedMine && (
        <div className="modal-overlay" onClick={() => setShowUpgradeModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#92400E' }}>
              ⬆️ Mejorar Mina
            </h3>
            
            <div className="mb-4">
              <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Mina de {selectedMine.name}</p>
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