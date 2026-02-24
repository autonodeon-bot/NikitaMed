import { useState } from 'react';
import { useStore, PatientProfile as IPatientProfile } from '../../store/useStore';
import { Save, FileText, Plus, Trash2, User } from 'lucide-react';
import { motion } from 'motion/react';

export default function PatientProfile() {
  const { currentUser, updateUser } = useStore();
  
  if (!currentUser || currentUser.role !== 'patient') return null;

  const [profile, setProfile] = useState<IPatientProfile>(currentUser.patientProfile || {
    fullName: '',
    phone: '',
    birthDate: '',
    gender: '',
    bloodType: '',
    allergies: '',
    chronicDiseases: '',
    documents: []
  });
  const [name, setName] = useState(currentUser.name || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleAddDocument = () => {
    const newDoc = {
      id: Math.random().toString(36).substring(7),
      name: 'Новый анализ',
      url: '',
      date: new Date().toISOString().split('T')[0]
    };
    setProfile(prev => ({ ...prev, documents: [...prev.documents, newDoc] }));
  };

  const handleUpdateDocument = (id: string, field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      documents: prev.documents.map(doc => doc.id === id ? { ...doc, [field]: value } : doc)
    }));
  };

  const handleRemoveDocument = (id: string) => {
    setProfile(prev => ({
      ...prev,
      documents: prev.documents.filter(doc => doc.id !== id)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    setTimeout(() => {
      updateUser({
        ...currentUser,
        name,
        patientProfile: profile
      });
      setIsSaving(false);
    }, 500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Мой профиль</h1>
        <p className="text-slate-500 mt-1">Управление личными данными и медицинской картой</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-slate-900">Основная информация</h2>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 flex items-center gap-6">
              <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 font-bold text-2xl overflow-hidden border border-slate-200">
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt={name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  name.charAt(0) || 'П'
                )}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Ссылка на фото (Аватар)</label>
                <input
                  type="url"
                  name="avatarUrl"
                  value={profile.avatarUrl || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Отображаемое имя (Никнейм)</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Алексей С."
              />
              <p className="mt-1 text-xs text-slate-500">Это имя видят врачи в анонимных консультациях.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">ФИО полностью</label>
              <input
                type="text"
                name="fullName"
                value={profile.fullName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Смирнов Алексей Викторович"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Телефон</label>
              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="+7 (999) 000-00-00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Дата рождения</label>
              <input
                type="date"
                name="birthDate"
                value={profile.birthDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Пол</label>
              <select
                name="gender"
                value={profile.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Не указан</option>
                <option value="male">Мужской</option>
                <option value="female">Женский</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-slate-900">Медицинская карта</h2>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Группа крови и резус-фактор</label>
              <input
                type="text"
                name="bloodType"
                value={profile.bloodType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Например: A(II) Rh+"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Аллергии и непереносимости</label>
              <textarea
                name="allergies"
                value={profile.allergies}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Перечислите аллергические реакции на препараты, продукты и т.д."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Хронические заболевания</label>
              <textarea
                name="chronicDiseases"
                value={profile.chronicDiseases}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Перечислите имеющиеся хронические заболевания, перенесенные операции..."
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-semibold text-slate-900">Медицинские документы и анализы</h2>
            </div>
            <button
              type="button"
              onClick={handleAddDocument}
              className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              <Plus className="w-4 h-4" />
              Добавить документ
            </button>
          </div>
          
          <div className="p-6">
            {profile.documents.length === 0 ? (
              <p className="text-slate-500 text-center py-4">Нет прикрепленных документов. Вы можете добавить результаты анализов, выписки или снимки.</p>
            ) : (
              <div className="space-y-4">
                {profile.documents.map((doc, index) => (
                  <div key={doc.id} className="flex gap-4 items-start bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-slate-500 mb-1">Название документа</label>
                        <input
                          type="text"
                          value={doc.name}
                          onChange={(e) => handleUpdateDocument(doc.id, 'name', e.target.value)}
                          className="w-full px-3 py-1.5 border border-slate-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="Общий анализ крови"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Дата</label>
                        <input
                          type="date"
                          value={doc.date}
                          onChange={(e) => handleUpdateDocument(doc.id, 'date', e.target.value)}
                          className="w-full px-3 py-1.5 border border-slate-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div className="md:col-span-3">
                        <label className="block text-xs font-medium text-slate-500 mb-1">Ссылка на файл</label>
                        <input
                          type="url"
                          value={doc.url}
                          onChange={(e) => handleUpdateDocument(doc.id, 'url', e.target.value)}
                          className="w-full px-3 py-1.5 border border-slate-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveDocument(doc.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-2"
                      title="Удалить документ"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors font-medium shadow-sm disabled:opacity-70"
          >
            <Save className="w-5 h-5" />
            {isSaving ? 'Сохранение...' : 'Сохранить профиль'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
