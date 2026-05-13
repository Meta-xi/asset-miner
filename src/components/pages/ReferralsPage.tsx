"use client";

interface User {
  id: string;
  username: string;
  referralCode: string;
  referredBy: string | null;
  referralEarnings: number;
}

interface Props {
  user: User;
}

export default function ReferralsPage({ user }: Props) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(user.referralCode);
    alert('¡Código copiado al portapapeles!');
  };

  return (
    <div className="p-4">
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1F2937' }}>
        👥 Equipo de Referidos
      </h1>

      {/* Your Referral Code */}
      <div className="card mb-4" style={{ 
        background: 'linear-gradient(135deg, #DBEAFE 0%, #93C5FD 100%)',
        textAlign: 'center'
      }}>
        <p style={{ fontSize: '0.875rem', color: '#1E40AF', marginBottom: '0.5rem' }}>
          Tu código de referido
        </p>
        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563EB', letterSpacing: '0.1em' }}>
          {user.referralCode}
        </p>
        <button
          onClick={copyToClipboard}
          className="btn-primary mt-3"
          style={{ background: '#2563EB' }}
        >
          📋 Copiar código
        </button>
        <p style={{ fontSize: '0.875rem', color: '#1E40AF', marginTop: '1rem' }}>
          ¡Comparte tu código y gana QUC por cada referido!
        </p>
      </div>

      {/* Referral Earnings */}
      <div className="card mb-4">
        <h3 style={{ fontWeight: 'bold', marginBottom: '1rem', color: '#1F2937' }}>
          💰 Ganancias por Referidos
        </h3>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>Total ganado</p>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10B981' }}>
            {user.referralEarnings.toFixed(2)} QUC
          </p>
        </div>
      </div>

      {/* How it works */}
      <div className="card">
        <h3 style={{ fontWeight: 'bold', marginBottom: '1rem', color: '#1F2937' }}>
          📚 ¿Cómo funciona?
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span style={{ fontSize: '1.5rem' }}>1️⃣</span>
            <div>
              <p style={{ fontWeight: 'bold', color: '#1F2937' }}>Comparte tu código</p>
              <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                Envía tu código a amigos y familiares
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <span style={{ fontSize: '1.5rem' }}>2️⃣</span>
            <div>
              <p style={{ fontWeight: 'bold', color: '#1F2937' }}>Se registran</p>
              <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                Usan tu código al crear su cuenta
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <span style={{ fontSize: '1.5rem' }}>3️⃣</span>
            <div>
              <p style={{ fontWeight: 'bold', color: '#1F2937' }}>Ganas recompensas</p>
              <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                Recibes QUC por cada referido que se una
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Who referred you */}
      {user.referredBy && (
        <div className="mt-4 card bg-gray-50">
          <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
            Fué registrado por un referido con código: <strong>{user.referredBy}</strong>
          </p>
        </div>
      )}
    </div>
  );
}