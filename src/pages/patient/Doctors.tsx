import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Search, Star, MessageSquare, ShieldCheck, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

export default function Doctors() {
  const { users, currentUser } = useStore();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [specFilter, setSpecFilter] = useState('');

  const doctors = users.filter(u => 
    u.role === 'doctor' && 
    u.doctorProfile?.verificationStatus === 'verified'
  );

  const specializations = Array.from(new Set(doctors.map(d => d.doctorProfile?.specialization).filter(Boolean)));

  const filteredDoctors = doctors.filter(doc => {
    const p = doc.doctorProfile;
    if (!p) return false;
    
    const matchesSearch = p.publicName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpec = specFilter ? p.specialization === specFilter : true;
    
    return matchesSearch && matchesSpec;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Каталог врачей</h1>
          <p className="text-slate-500 mt-1">Найдите профильного специалиста для консультации</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-xl leading-5 bg-white placeholder-slate-500 focus:outline-none focus:placeholder-slate-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Поиск по имени или специальности..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="block w-full sm:w-64 pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-xl border"
          value={specFilter}
          onChange={(e) => setSpecFilter(e.target.value)}
        >
          <option value="">Все специальности</option>
          {specializations.map(spec => (
            <option key={spec} value={spec}>{spec}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor, i) => {
          const p = doctor.doctorProfile!;
          return (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={doctor.id} 
              onClick={() => navigate(`/doctors/${doctor.id}`)}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors overflow-hidden">
                      {p.avatarUrl ? (
                        <img src={p.avatarUrl} alt={p.publicName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        p.publicName.charAt(0)
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-1 group-hover:text-indigo-600 transition-colors">
                        {p.publicName}
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      </h3>
                      <p className="text-sm font-medium text-indigo-600">{p.specialization}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-lg text-sm font-medium">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{p.rating.toFixed(1)}</span>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <p><span className="font-medium text-slate-900">Стаж:</span> {p.experience}</p>
                  <p><span className="font-medium text-slate-900">Место работы:</span> {p.workplace}</p>
                  <div className="flex justify-between pt-2 border-t border-slate-100 mt-2">
                    <p><span className="font-medium text-slate-900">Отзывов:</span> {p.reviewsCount}</p>
                    <p><span className="font-medium text-slate-900">Консультаций:</span> {p.consultationsCount || 0}</p>
                  </div>
                </div>
                
                <div className="mt-6 flex gap-2">
                  <Link
                    to={`/doctors/${doctor.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 flex justify-center items-center gap-2 py-2 px-4 border border-slate-200 rounded-xl shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Профиль
                  </Link>
                  {currentUser?.role === 'patient' && (
                    <Link
                      to={`/cases/new?doctorId=${doctor.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Запрос
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
        
        {filteredDoctors.length === 0 && (
          <div className="col-span-full py-12 text-center">
            <p className="text-slate-500">Врачи не найдены. Попробуйте изменить параметры поиска.</p>
          </div>
        )}
      </div>
    </div>
  );
}
