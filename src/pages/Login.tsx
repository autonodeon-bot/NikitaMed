import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore, Role } from '../store/useStore';
import { Activity, User, Stethoscope, Shield } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('patient');
  const login = useStore(state => state.login);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      login(email, role);
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Activity className="w-12 h-12 text-indigo-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          MedConnect Pro
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Платформа для пациентов и врачей
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm sm:rounded-2xl sm:px-10 border border-slate-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email адрес
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Я хочу войти как:
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('patient')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-colors ${
                    role === 'patient'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 hover:border-slate-300 text-slate-500'
                  }`}
                >
                  <User className="w-6 h-6 mb-1" />
                  <span className="text-xs font-medium">Пациент</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('doctor')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-colors ${
                    role === 'doctor'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 hover:border-slate-300 text-slate-500'
                  }`}
                >
                  <Stethoscope className="w-6 h-6 mb-1" />
                  <span className="text-xs font-medium">Врач</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-colors ${
                    role === 'admin'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 hover:border-slate-300 text-slate-500'
                  }`}
                >
                  <Shield className="w-6 h-6 mb-1" />
                  <span className="text-xs font-medium">Админ</span>
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Войти / Зарегистрироваться
              </button>
            </div>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">
                  Демо доступы
                </span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-2 text-xs text-slate-500 text-center">
              <p>Пациент: patient@test.com</p>
              <p>Врач: doctor@test.com</p>
              <p>Админ: admin@medconnect.pro</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
