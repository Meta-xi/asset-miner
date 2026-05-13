"use client";

import { useState, useEffect } from 'react';
import { buyMine, buyMiner, sellMinerales } from '@/components/Navigation';

interface User {
  id: string;
  username: string;
  quc: number;
  minerales: number;
}

interface Props {
  user: User;
  refreshUser: () => void;
}

interface StoreItem {
  id: string;
  name: string;
  cost: number;
}

export default function StorePage({ user, refreshUser }: Props) {
  const [activeTab, setActiveTab] = useState<'mines' | 'mineros' | 'minerales'>('mines');
  const [processing, setProcessing] = useState<string | null>(null);
  const [sellAmount, setSellAmount] = useState('');

  // Mine prices
  const minePrices: Record<string, number> = {
    basic: 50,
    intermediate: 250,
    professional: 600,
    elite: 1500,
    diamond: 3500,
  };

  // Miner prices
  const minerPrices: Record<string, number> = {
    basic: 25,
    intermediate: 100,
    professional: 300,
    elite: 750,
    diamond: 1750,
  };

  const mineNames: Record<string, string> = {
    basic: 'Mina Básica',
    intermediate: 'Mina Intermedia',
    professional: 'Mina Profesional',
    elite: 'Mina Elite',
    diamond: 'Mina Diamante',
  };

  const minerNames: Record<string, string> = {
    basic: 'Minero Básico',
    intermediate: 'Minero Intermedio',
    professional: 'Minero Profesional',
    elite: 'Minero Elite',
    diamond: 'Minero Diamante',
  };

  const handleBuyMine = async (mineType: string) => {
    setProcessing(mineType);
    try {
      const result = await buyMine(user.id, mineType);
      alert(result.message);
      if (result.success) refreshUser();
    } catch (error) {
      alert('Error al comprar mina');
    }
    setProcessing(null);
  };

  const handleBuyMiner = async (minerType: string) => {
    setProcessing(minerType);
    try {
      const result = await buyMiner(user.id, minerType);
      alert(result.message);
      if (result.success) refreshUser();
    } catch (error) {
      alert('Error al comprar minero');
    }
    setProcessing(null);
  };

  const handleSellMinerales = async () => {
    const amount = parseFloat(sellAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Cantidad inválida');
      return;
    }
    setProcessing('sell');
    try {
      const result = await sellMinerales(user.id, amount);
      alert(result.message);
      if (result.success) {
        refreshUser();
        setSellAmount('');
      }
    } catch (error) {
      alert('Error al vender minerales');
    }
    setProcessing(null);
  };

  return (
    <div className="p-4">
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1F2937' }}>
        🏪 Tienda
      </h1>

      {/* Current Currency */}
      <div className="card mb-4" style={{ background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)' }}>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p style={{ fontSize: '0.875rem', color: '#92400E' }}>TU QUC</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#F59E0B' }}>
              {user.quc.toFixed(2)}
            </p>
          </div>
          <div className="text-center">
            <p style={{ fontSize: '0.875rem', color: '#92400E' }}>TUS MINERALES</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8B5CF6' }}>
              {user.minerales.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('mines')}
          className={`flex-1 py-2 px-4 rounded-lg font-semibold ${
            activeTab === 'mines' 
              ? 'bg-amber-500 text-white' 
              : 'bg-white text-gray-600 border'
          }`}
        >
          ⛏️ Minas
        </button>
        <button
          onClick={() => setActiveTab('mineros')}
          className={`flex-1 py-2 px-4 rounded-lg font-semibold ${
            activeTab === 'mineros' 
              ? 'bg-blue-500 text-white' 
              : 'bg-white text-gray-600 border'
          }`}
        >
          👷 Mineros
        </button>
        <button
          onClick={() => setActiveTab('minerales')}
          className={`flex-1 py-2 px-4 rounded-lg font-semibold ${
            activeTab === 'minerales' 
              ? 'bg-purple-500 text-white' 
              : 'bg-white text-gray-600 border'
          }`}
        >
          💎 Minerales
        </button>
      </div>

      {/* Content based on tab */}
      {activeTab === 'mines' && (
        <div>
          {Object.entries(minePrices).map(([id, cost]) => (
            <div key={id} className="store-item">
              <div className="flex justify-between items-center">
                <div>
                  <h3 style={{ fontWeight: 'bold', color: '#1F2937' }}>{mineNames[id]}</h3>
                  <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                    Produce minerales constantemente
                  </p>
                </div>
                <button
                  onClick={() => handleBuyMine(id)}
                  disabled={processing === id || user.quc < cost}
                  className="btn-primary"
                  style={{ 
                    opacity: user.quc < cost ? 0.5 : 1,
                    background: '#F59E0B'
                  }}
                >
                  {processing === id ? '...' : `💰 ${cost} QUC`}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'mineros' && (
        <div>
          {Object.entries(minerPrices).map(([id, cost]) => (
            <div key={id} className="store-item">
              <div className="flex justify-between items-center">
                <div>
                  <h3 style={{ fontWeight: 'bold', color: '#1F2937' }}>{minerNames[id]}</h3>
                  <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                    Aumenta producción de minerales
                  </p>
                </div>
                <button
                  onClick={() => handleBuyMiner(id)}
                  disabled={processing === id || user.quc < cost}
                  className="btn-primary"
                  style={{ 
                    opacity: user.quc < cost ? 0.5 : 1,
                    background: '#3B82F6'
                  }}
                >
                  {processing === id ? '...' : `💰 ${cost} QUC`}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'minerales' && (
        <div className="card">
          <h3 style={{ fontWeight: 'bold', marginBottom: '1rem', color: '#1F2937' }}>
            💎 Vender Minerales
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '1rem' }}>
            Precio: 0.10 QUC por mineral
          </p>
          
          <div className="flex gap-2">
            <input
              type="number"
              value={sellAmount}
              onChange={(e) => setSellAmount(e.target.value)}
              placeholder="Cantidad de minerales"
              style={{
                flex: 1,
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid #D1D5DB',
              }}
            />
            <button
              onClick={handleSellMinerales}
              disabled={processing === 'sell' || user.minerales <= 0}
              className="btn-primary"
              style={{ 
                background: '#8B5CF6',
                opacity: user.minerales <= 0 ? 0.5 : 1
              }}
            >
              {processing === 'sell' ? '...' : 'Vender'}
            </button>
          </div>

          <button
            onClick={() => setSellAmount(user.minerales.toFixed(0))}
            style={{ 
              fontSize: '0.875rem', 
              color: '#8B5CF6', 
              marginTop: '0.5rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Vender todos mis minerales
          </button>
        </div>
      )}
    </div>
  );
}