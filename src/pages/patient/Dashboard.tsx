import { useStore } from '../../store/useStore';
import { Link } from 'react-router-dom';
import { Plus, FileText, Clock, CheckCircle, ChevronRight, User } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { motion } from 'motion/react';

export default function PatientDashboard() {
  const { currentUser, cases } = useStore();
  
  const myCases = cases.filter(c => c.patientId === currentUser?.id);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Мои случаи</h1>
          <p className="text-slate-500 mt-1">Управляйте своими медицинскими данными и консультациями</p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/patient-profile"
            className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors font-medium shadow-sm"
          >
            <User className="w-5 h-5" />
            Мой профиль
          </Link>
          <Link
            to="/cases/new"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors font-medium shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Новый случай
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Всего случаев</p>
              <p className="text-2xl font-bold text-slate-900">{myCases.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">В процессе</p>
              <p className="text-2xl font-bold text-slate-900">
                {myCases.filter(c => c.status === 'in_progress' || c.status === 'open').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Завершено</p>
              <p className="text-2xl font-bold text-slate-900">
                {myCases.filter(c => c.status === 'closed').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <h2 className="text-lg font-semibold text-slate-900">История обращений</h2>
        </div>
        
        {myCases.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-1">Нет активных случаев</h3>
            <p className="text-slate-500 mb-6 max-w-sm mx-auto">
              Загрузите свои анализы или опишите симптомы, чтобы получить консультацию врача или ИИ.
            </p>
            <Link
              to="/cases/new"
              className="inline-flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors font-medium shadow-sm"
            >
              <Plus className="w-5 h-5" />
              Создать первый случай
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {myCases.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((c) => (
              <li key={c.id}>
                <Link to={`/cases/${c.id}`} className="block hover:bg-slate-50 transition-colors p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="text-sm font-medium text-indigo-600 truncate">{c.title}</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${c.status === 'open' ? 'bg-blue-100 text-blue-800' : 
                            c.status === 'in_progress' ? 'bg-amber-100 text-amber-800' : 
                            'bg-emerald-100 text-emerald-800'}`}
                        >
                          {c.status === 'open' ? 'Открыт' : c.status === 'in_progress' ? 'В работе' : 'Закрыт'}
                        </span>
                        {c.isAnonymous && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                            Анонимно
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 truncate">{c.description}</p>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex items-center gap-4">
                      <div className="text-sm text-slate-500 text-right">
                        <p>{format(new Date(c.createdAt), 'd MMM yyyy', { locale: ru })}</p>
                        <p className="text-xs">{c.documents.length} документов</p>
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
