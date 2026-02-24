import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { LogOut, User as UserIcon, Activity, FileText, Users, Shield, Coins } from 'lucide-react';

export default function Layout() {
  const { currentUser, logout } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!currentUser) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                <Activity className="h-8 w-8 text-indigo-600" />
                <span className="font-bold text-xl text-slate-900 tracking-tight">MedConnect Pro</span>
              </Link>
              <nav className="hidden sm:ml-8 sm:flex sm:space-x-8">
                {currentUser.role === 'patient' && (
                  <>
                    <Link to="/dashboard" className="border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                      Мои случаи
                    </Link>
                    <Link to="/doctors" className="border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                      Врачи
                    </Link>
                  </>
                )}
                {currentUser.role === 'doctor' && (
                  <>
                    <Link to="/dashboard" className="border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                      Запросы
                    </Link>
                    <Link to="/cases" className="border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                      Общая лента
                    </Link>
                  </>
                )}
                {currentUser.role === 'admin' && (
                  <Link to="/admin" className="border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                    Панель управления
                  </Link>
                )}
              </nav>
            </div>
            <div className="flex items-center gap-4">
              {currentUser.role !== 'admin' && (
                <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-sm font-medium border border-amber-200">
                  <Coins className="w-4 h-4" />
                  <span>{currentUser.tokens}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                  <UserIcon className="w-5 h-5" />
                </div>
                <span className="hidden sm:inline-block font-medium">
                  {currentUser.role === 'doctor' ? currentUser.doctorProfile?.publicName : currentUser.name || currentUser.email}
                </span>
              </div>
              
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
                title="Выйти"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
