"use client";

import { useState } from 'react';
import { deposit, withdraw } from '@/components/Navigation';

interface User {
  id: string;
  username: string;
  quc: number;
}

interface Props {
  user: User;
  refreshUser: () => void;
}

export default function WalletPage({ user, refreshUser }: Props) {
  const [amount, setAmount] = useState('');
  const [processing, setProcessing] = useState<'deposit' | 'withdraw' | null>(null);

  const handleDeposit = async () => {
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) {
      alert('Cantidad inválida');
      return;
    }
    setProcessing('deposit');
    try {
      const result = await deposit(user.id, value);
      alert(result.message);
      if (result.success) {
        refreshUser();
        setAmount('');
      }
    } catch (error) {
      alert('Error al procesar depósito');
    }
    setProcessing(null);
  };

  const handleWithdraw = async () => {
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) {
      alert('Cantidad inválida');
      return;
    }
    if (value > user.quc) {
      alert('QUC insuficiente');
      return;
    }
    setProcessing('withdraw');
    try {
      const result = await withdraw(user.id, value);
      alert(result.message);
      if (result.success) {
        refreshUser();
        setAmount('');
      }
    } catch (error) {
      alert('Error al procesar retiro');
    }
    setProcessing(null);
  };

  return (
    <div className="p-4">
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1F2937' }}>
        💰 Wallet
      </h1>

      {/* Current Balance */}
      <div className="card mb-6" style={{ 
        background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
        textAlign: 'center'
      }}>
        <p style={{ fontSize: '0.875rem', color: '#92400E', marginBottom: '0.5rem' }}>
          Balance disponible
        </p>
        <p style={{ fontSize: '3rem', fontWeight: 'bold', color: '#F59E0B' }}>
          {user.quc.toFixed(2)}
        </p>
        <p style={{ fontSize: '0.875rem', color: '#92400E' }}>
          QUC
        </p>
      </div>

      {/* Deposit Section */}
      <div className="card mb-4">
        <h3 style={{ fontWeight: 'bold', marginBottom: '1rem', color: '#1F2937' }}>
          📥 Depósito
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '1rem' }}>
          Agrega fondos a tu cuenta
        </p>
        
        <div className="flex gap-2">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Cantidad a depositar"
            style={{
              flex: 1,
              padding: '0.75rem',
              borderRadius: '0.5rem',
              border: '1px solid #D1D5DB',
            }}
          />
          <button
            onClick={handleDeposit}
            disabled={processing === 'deposit'}
            className="btn-primary"
            style={{ background: '#10B981' }}
          >
            {processing === 'deposit' ? '...' : 'Depositar'}
          </button>
        </div>

        {/* Quick amounts */}
        <div className="flex gap-2 mt-3">
          {[100, 500, 1000, 5000].map((value) => (
            <button
              key={value}
              onClick={() => setAmount(value.toString())}
              style={{
                padding: '0.5rem',
                fontSize: '0.875rem',
                background: '#E5E7EB',
                border: 'none',
                borderRadius: '0.25rem',
                cursor: 'pointer',
              }}
            >
              +{value}
            </button>
          ))}
        </div>
      </div>

      {/* Withdraw Section */}
      <div className="card">
        <h3 style={{ fontWeight: 'bold', marginBottom: '1rem', color: '#1F2937' }}>
          📤 Retiro
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '1rem' }}>
          Retira tus ganancias
        </p>
        
        <div className="flex gap-2">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Cantidad a retirar"
            style={{
              flex: 1,
              padding: '0.75rem',
              borderRadius: '0.5rem',
              border: '1px solid #D1D5DB',
            }}
          />
          <button
            onClick={handleWithdraw}
            disabled={processing === 'withdraw'}
            className="btn-primary"
            style={{ background: '#EF4444' }}
          >
            {processing === 'withdraw' ? '...' : 'Retirar'}
          </button>
        </div>

        <button
          onClick={() => setAmount(user.quc.toFixed(2))}
          style={{ 
            fontSize: '0.875rem', 
            color: '#EF4444', 
            marginTop: '0.5rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Retirar todo el balance
        </button>
      </div>

      {/* Info */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p style={{ fontSize: '0.875rem', color: '#2563EB' }}>
          ℹ️ En modo demo, los depósitos crean dinero ficticio. 
          En producción, esto se conectaría a pasarelas de pago reales.
        </p>
      </div>
    </div>
  );
}