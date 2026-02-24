import { useState } from 'react';
import { useStore, User } from '../../store/useStore';
import { Shield, Check, X, Users, Activity, FileText, MessageSquare, Search, Filter } from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminDashboard() {
  const { users, cases, consultations, updateUser } = useStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'verification' | 'users'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  
  const doctors = users.filter(u => u.role === 'doctor');
  const patients = users.filter(u => u.role === 'patient');
  const pendingDoctors = doctors.filter(u => u.doctorProfile?.verificationStatus === 'pending');

  const handleVerify = (userId: string, status: 'verified' | 'rejected') => {
    const user = users.find(u => u.id === userId);
    if (user && user.doctorProfile) {
      updateUser({
        ...user,
        doctorProfile: {
          ...user.doctorProfile,
          verificationStatus: status
        }
      });
    }
  };

  const filteredUsers = users.filter(u => {
    if (u.role === 'admin') return false;
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const name = u.role === 'doctor' ? u.doctorProfile?.fullName : u.patientProfile?.fullName || u.name;
    return u.email.toLowerCase().includes(query) || (name && name.toLowerCase().includes(query));
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Панель администратора</h1>
          <p className="text-slate-500 mt-1">Управление платформой и пользователями</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'overview' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          Обзор
        </button>
        <button
          onClick={() => setActiveTab('verification')}
          className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'verification' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          Верификация
          {pendingDoctors.length > 0 && (
            <span className="bg-amber-100 text-amber-700 py-0.5 px-2 rounded-full text-xs">
              {pendingDoctors.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'users' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          Пользователи
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Пациентов</p>
                  <p className="text-2xl font-bold text-slate-900">{patients.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Врачей</p>
                  <p className="text-2xl font-bold text-slate-900">{doctors.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Случаев</p>
                  <p className="text-2xl font-bold text-slate-900">{cases.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Консультаций</p>
                  <p className="text-2xl font-bold text-slate-900">{consultations.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'verification' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-slate-900">Заявки на верификацию</h2>
            <span className="ml-2 bg-indigo-100 text-indigo-700 py-0.5 px-2.5 rounded-full text-xs font-medium">
              {pendingDoctors.length}
            </span>
          </div>
          
          {pendingDoctors.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-1">Нет новых заявок</h3>
              <p className="text-slate-500">
                Все профили врачей проверены.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {pendingDoctors.map((doctor) => (
                <li key={doctor.id} className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-medium text-slate-900">
                          {doctor.doctorProfile?.fullName || 'Имя не указано'}
                        </h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          Ожидает проверки
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 text-sm">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                          <p className="text-slate-500 mb-2 font-medium">Приватные данные</p>
                          <ul className="space-y-2 text-slate-700">
                            <li><span className="text-slate-400">Email:</span> {doctor.email}</li>
                            <li><span className="text-slate-400">Телефон:</span> {doctor.doctorProfile?.phone || 'Не указан'}</li>
                            <li><span className="text-slate-400">Локация:</span> {doctor.doctorProfile?.city}, {doctor.doctorProfile?.country}</li>
                          </ul>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                          <p className="text-slate-500 mb-2 font-medium">Публичный профиль</p>
                          <ul className="space-y-2 text-slate-700">
                            <li><span className="text-slate-400">Псевдоним:</span> {doctor.doctorProfile?.publicName}</li>
                            <li><span className="text-slate-400">Специализация:</span> {doctor.doctorProfile?.specialization}</li>
                            <li><span className="text-slate-400">Стаж:</span> {doctor.doctorProfile?.experience}</li>
                            <li><span className="text-slate-400">Место работы:</span> {doctor.doctorProfile?.workplace}</li>
                          </ul>
                        </div>
                      </div>
                      
                      {(doctor.doctorProfile?.diplomaUrl || (doctor.doctorProfile?.documents && doctor.doctorProfile.documents.length > 0)) && (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-slate-700 mb-2">Документы:</p>
                          <div className="flex flex-wrap gap-2">
                            {doctor.doctorProfile.diplomaUrl && (
                              <a href={doctor.doctorProfile.diplomaUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
                                <FileText className="w-4 h-4" />
                                Основной диплом
                              </a>
                            )}
                            {doctor.doctorProfile.documents?.map(doc => (
                              <a key={doc.id} href={doc.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
                                <FileText className="w-4 h-4" />
                                {doc.name}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-row lg:flex-col gap-2">
                      <button
                        onClick={() => handleVerify(doctor.id, 'verified')}
                        className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl hover:bg-emerald-700 transition-colors font-medium shadow-sm"
                      >
                        <Check className="w-4 h-4" />
                        Одобрить
                      </button>
                      <button
                        onClick={() => handleVerify(doctor.id, 'rejected')}
                        className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 bg-white border border-red-200 text-red-600 px-4 py-2.5 rounded-xl hover:bg-red-50 transition-colors font-medium shadow-sm"
                      >
                        <X className="w-4 h-4" />
                        Отклонить
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <h2 className="text-lg font-semibold text-slate-900">Управление пользователями</h2>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Поиск по email или имени..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                  <th className="p-4">Пользователь</th>
                  <th className="p-4">Роль</th>
                  <th className="p-4">Статус</th>
                  <th className="p-4">Баланс</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map(user => {
                  const name = user.role === 'doctor' 
                    ? user.doctorProfile?.fullName || user.doctorProfile?.publicName 
                    : user.patientProfile?.fullName || user.name;
                    
                  return (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-900">{name || 'Не указано'}</span>
                          <span className="text-sm text-slate-500">{user.email}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === 'doctor' ? 'bg-indigo-100 text-indigo-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {user.role === 'doctor' ? 'Врач' : 'Пациент'}
                        </span>
                      </td>
                      <td className="p-4">
                        {user.role === 'doctor' ? (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.doctorProfile?.verificationStatus === 'verified' ? 'bg-emerald-100 text-emerald-800' :
                            user.doctorProfile?.verificationStatus === 'pending' ? 'bg-amber-100 text-amber-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {user.doctorProfile?.verificationStatus === 'verified' ? 'Подтвержден' :
                             user.doctorProfile?.verificationStatus === 'pending' ? 'Ожидает' : 'Отклонен'}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-sm">-</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-amber-600 font-medium text-sm">
                          <span>{user.tokens}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-500">
                      Пользователи не найдены
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
}
