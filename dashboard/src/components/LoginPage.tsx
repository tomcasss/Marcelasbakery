import { useState } from 'react';
import { login } from '../api';

export function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(password);
      onLogin();
    } catch (err: any) {
      setError(err.message || 'Error de login');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F0] via-white to-[#f5f0eb] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo / branding */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#cd733d] to-[#b35f2f] rounded-2xl shadow-lg mb-4 transition-transform duration-300 hover:scale-110">
            <span className="text-3xl">🍰</span>
          </div>
          <h1 className="text-3xl font-serif text-gray-900 font-bold">La Gracia</h1>
          <p className="text-sm text-gray-500 mt-2">Panel de Administración</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#cd733d]/10 p-8 backdrop-blur animate-fade-in">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
            Ingresá tu contraseña
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                autoFocus
                autoComplete="current-password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                className="w-full h-12 border-2 border-gray-200 rounded-lg px-4 py-3 text-base focus:outline-none focus:border-[#cd733d] focus:ring-2 focus:ring-[#cd733d]/20 transition-all duration-200 bg-gray-50/50"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg font-medium animate-fade-in">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full h-12 bg-gradient-to-r from-[#cd733d] to-[#e89360] text-white rounded-lg text-base font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Verificando…
                </>
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-6 px-4">
            Panel seguro. Tu contraseña se envía de forma encriptada.
          </p>
        </div>
      </div>
    </div>
  );
}
