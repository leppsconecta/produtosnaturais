import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, Lock } from 'lucide-react';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Erro no login');
            }

            login(data.token, data.email);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-earth-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-earth-200">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-olive-900 rounded-full flex items-center justify-center mb-4">
                        <Lock className="w-8 h-8 text-mustard-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-olive-900">Acesso Restrito</h2>
                    <p className="text-earth-500">Painel Administrativo - MDA</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-6 border border-red-100 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-earth-800 mb-2">E-mail</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-earth-200 focus:ring-2 focus:ring-mustard-500 outline-none transition-shadow"
                            placeholder="admin@mda.com.br"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-earth-800 mb-2">Senha</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-earth-200 focus:ring-2 focus:ring-mustard-500 outline-none transition-shadow"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 px-6 bg-[#5A1788] hover:bg-[#4a1270] text-white rounded-xl font-bold transition-colors shadow-lg flex justify-center items-center"
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            'Entrar no Painel'
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => navigate('/')}
                        className="text-earth-500 hover:text-olive-900 text-sm font-medium transition-colors"
                    >
                        Voltar para o site
                    </button>
                </div>
            </div>
        </div>
    );
}
