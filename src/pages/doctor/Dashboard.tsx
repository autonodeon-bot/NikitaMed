import { useStore } from '../../store/useStore';
import { Link } from 'react-router-dom';
import { Activity, Star, Users, MessageSquare, AlertCircle, User, Plus, Clock, CheckCircle, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { motion } from 'motion/react';

export default function DoctorDashboard() {
  const { currentUser, cases, consultations } = useStore();
  
  if (!currentUser?.doctorProfile) return null;

  const profile = currentUser.doctorProfile;
  const isVerified = profile.verificationStatus === 'verified';

  // Find cases assigned to this doctor or open anonymous cases
  const availableCases = cases.filter(c => 
    c.status === 'open' && (c.assignedDoctorId === currentUser.id || !c.assignedDoctorId)
  );

  const myConsultations = consultations.filter(c => c.doctorId === currentUser.id);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {!isVerified && (
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-xl">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-amber-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800">
                Профиль ожидает верификации
              </h3>
              <div className="mt-2 text-sm text-amber-700">
                <p>
                  Вы можете просматривать случаи, но для начала консультаций необходимо подтвердить статус врача.
                </p>
              </div>
              <div className="mt-4">
                <div className="-mx-2 -my-1.5 flex">
                  <Link
                    to="/profile"
                    className="bg-amber-50 px-2 py-1.5 rounded-md text-sm font-medium text-amber-800 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-amber-50 focus:ring-amber-600"
                  >
                    Пройти верификацию
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Кабинет врача</h1>
          <p className="text-slate-500 mt-1">Добро пожаловать, {profile.publicName}</p>
        </div>
        <div className="flex gap-3">
          <Link
            to={`/doctors/${currentUser.id}`}
            className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors font-medium shadow-sm"
          >
            <User className="w-4 h-4" />
            Мой профиль
          </Link>
          <Link
            to="/articles/new"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors font-medium shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Написать статью
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Доступно запросов</p>
              <p className="text-2xl font-bold text-slate-900">{availableCases.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Мои консультации</p>
              <p className="text-2xl font-bold text-slate-900">{myConsultations.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
              <Star className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Рейтинг</p>
              <p className="text-2xl font-bold text-slate-900">{profile.rating.toFixed(1)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Отзывов</p>
              <p className="text-2xl font-bold text-slate-900">{profile.reviewsCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-slate-900">Новые запросы на консультацию</h2>
            <Link to="/cases" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              Смотреть все
            </Link>
          </div>
          
          {availableCases.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Activity className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-1">Нет новых запросов</h3>
              <p className="text-slate-500">
                В данный момент нет открытых случаев, ожидающих консультации.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {availableCases.slice(0, 5).map((c) => (
                <li key={c.id}>
                  <Link to={`/cases/${c.id}`} className="block hover:bg-slate-50 transition-colors p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <p className="text-sm font-medium text-indigo-600 truncate">{c.title}</p>
                          {c.assignedDoctorId === currentUser.id && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              Персональный запрос
                            </span>
                          )}
                          {c.isAnonymous && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                              Анонимно
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-500 truncate">{c.description}</p>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-slate-900">Мои консультации</h2>
          </div>
          
          {myConsultations.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-1">Нет активных консультаций</h3>
              <p className="text-slate-500">
                Возьмите в работу новые запросы из ленты.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {myConsultations.sort((a, b) => {
                // Sort by status (active first) then by date
                if (a.status === 'completed' && b.status !== 'completed') return 1;
                if (a.status !== 'completed' && b.status === 'completed') return -1;
                return 0;
              }).slice(0, 5).map((c) => {
                const caseItem = cases.find(caseObj => caseObj.id === c.caseId);
                if (!caseItem) return null;
                
                return (
                  <li key={c.id}>
                    <Link to={`/cases/${c.caseId}`} className="block hover:bg-slate-50 transition-colors p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <p className="text-sm font-medium text-indigo-600 truncate">{caseItem.title}</p>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                              ${c.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}
                            >
                              {c.status === 'completed' ? 'Завершена' : 'В работе'}
                            </span>
                          </div>
                          <p className="text-sm text-slate-500 truncate">{caseItem.description}</p>
                        </div>
                        <div className="ml-4 flex-shrink-0 flex items-center gap-4">
                          <ChevronRight className="w-5 h-5 text-slate-400" />
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </motion.div>
  );
}
