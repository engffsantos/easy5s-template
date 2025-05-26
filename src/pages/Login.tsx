import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardCheck, User, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/common/Button';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Email ou senha inválidos');
      }
    } catch (err) {
      setError('Ocorreu um erro ao fazer login. Tente novamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-card overflow-hidden">
        <div className="bg-primary-500 text-white py-6 text-center">
          <div className="flex justify-center">
            <ClipboardCheck className="h-12 w-12" />
          </div>
          <h2 className="mt-2 text-2xl font-bold">Sistema de Avaliação 5S</h2>
          <p className="mt-1">SENAI Birigui</p>
        </div>
        
        <div className="p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Login</h1>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input pl-10"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="form-label">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input pl-10"
                  placeholder="Sua senha"
                />
              </div>
              <div className="text-right mt-1">
                <a href="#" className="text-sm text-primary-500 hover:text-primary-600">
                  Esqueceu a senha?
                </a>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={isLoading}
              >
                Login
              </Button>
            </div>
          </form>
          
          <div className="mt-6 text-sm text-gray-600 text-center">
            <p>Para fins de teste, use:</p>
            <p className="mt-1"><strong>Manager:</strong> admin@senai.com</p>
            <p><strong>Inspector:</strong> inspector@senai.com</p>
            <p><strong>Student:</strong> student@senai.com</p>
            <p className="mt-1">Senha: password</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;