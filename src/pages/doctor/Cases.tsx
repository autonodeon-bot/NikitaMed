import { useStore } from '../../store/useStore';
import { Link } from 'react-router-dom';
import { ShieldAlert, ChevronRight, Sparkles, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { motion } from 'motion/react';
import { useState } from 'react';

export default function Cases() {
  const { currentUser, cases } = useStore();
  const [filter, setFilter] = useState<'all' | 'ai' | 'anonymous'>('all');
  
  if (currentUser?.role !== 'doctor') return null;

  let availableCases = cases.filter(c => 
    c.status === 'open' && (!c.assignedDoctorId || c.assignedDoctorId === currentUser.id)
  );

  if (filter === 'ai') {
    availableCases = availableCases.filter(c => !!c.aiAnalysis);
  } else if (filter === 'anonymous') {
    availableCases = availableCases.filter(c => c.isAnonymous);
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Лента интересных случаев</h1>
          <p className="text-slate-500 mt-1">Просматривайте анонимные запросы и давайте рекомендации</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === 'all' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Все
          </button>
          <button
            onClick={() => setFilter('ai')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${filter === 'ai' ? 'bg-amber-50 text-amber-700' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Sparkles className="w-4 h-4" />
            С ИИ-анализом
          </button>
          <button
            onClick={() => setFilter('anonymous')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${filter === 'anonymous' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <ShieldAlert className="w-4 h-4" />
            Анонимные
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {availableCases.length === 0 ? (
          <div className="p-12 text-center">
            <h3 className="text-lg font-medium text-slate-900 mb-1">Нет доступных запросов</h3>
            <p className="text-slate-500">
              В данный момент нет открытых случаев.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {availableCases.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((c) => (
              <li key={c.id}>
                <Link to={`/cases/${c.id}`} className="block hover:bg-slate-50 transition-colors p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="text-base font-medium text-indigo-600 truncate">{c.title}</p>
                        {c.assignedDoctorId === currentUser.id && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            Персональный запрос
                          </span>
                        )}
                        {c.isAnonymous && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                            <ShieldAlert className="w-3 h-3" /> Анонимно
                          </span>
                        )}
                        {c.aiAnalysis && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                            <Sparkles className="w-3 h-3" /> Требует подтверждения ИИ
                          </span>
                        )}
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {c.assignedDoctorId ? '+20 токенов' : '+5 токенов'}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 line-clamp-2">{c.description}</p>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex items-center gap-4">
                      <div className="text-sm text-slate-500 text-right">
                        <p>{format(new Date(c.createdAt), 'd MMM yyyy, HH:mm', { locale: ru })}</p>
                        <p className="text-xs mt-1">{c.documents.length} документов</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
}
