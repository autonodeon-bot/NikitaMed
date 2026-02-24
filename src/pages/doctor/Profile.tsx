import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Shield, Save, AlertCircle, Upload, X, FileText } from 'lucide-react';

export default function DoctorProfile() {
  const { currentUser, updateUser } = useStore();
  
  if (!currentUser?.doctorProfile) return null;

  const [profile, setProfile] = useState(currentUser.doctorProfile);
  const [isSaving, setIsSaving] = useState(false);
  const [newDocUrl, setNewDocUrl] = useState('');
  const [newDocName, setNewDocName] = useState('');
  const [newDocType, setNewDocType] = useState('diploma');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleAddDocument = () => {
    if (!newDocUrl || !newDocName) return;
    
    const newDoc = {
      id: Math.random().toString(36).substring(7),
      name: newDocName,
      url: newDocUrl,
      type: newDocType,
      date: new Date().toISOString().split('T')[0]
    };

    setProfile(prev => ({
      ...prev,
      documents: [...(prev.documents || []), newDoc]
    }));

    setNewDocUrl('');
    setNewDocName('');
  };

  const handleRemoveDocument = (id: string) => {
    setProfile(prev => ({
      ...prev,
      documents: (prev.documents || []).filter(d => d.id !== id)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    setTimeout(() => {
      updateUser({
        ...currentUser,
        doctorProfile: profile
      });
      setIsSaving(false);
    }, 500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Профиль врача</h1>
        <p className="text-slate-500 mt-1">Управление личными данными и настройками приватности</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-slate-900">Статус верификации</h2>
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
            ${profile.verificationStatus === 'verified' ? 'bg-emerald-100 text-emerald-800' : 
              profile.verificationStatus === 'pending' ? 'bg-amber-100 text-amber-800' : 
              'bg-red-100 text-red-800'}`}
          >
            {profile.verificationStatus === 'verified' ? 'Подтвержден' : 
             profile.verificationStatus === 'pending' ? 'Ожидает проверки' : 
             'Отклонен'}
          </span>
        </div>
        
        <div className="p-6">
          <p className="text-sm text-slate-600 mb-4">
            Верификация необходима для того, чтобы пациенты доверяли вашему мнению. 
            Ваши приватные данные надежно защищены и не будут показаны публично.
          </p>
          
          {profile.verificationStatus !== 'verified' && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-amber-800">Заполните профиль для верификации</h3>
                <p className="text-sm text-amber-700 mt-1">
                  Убедитесь, что вы заполнили все обязательные поля в разделе "Приватная информация".
                  После сохранения данных администратор проверит их в течение 24 часов.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
            <h2 className="text-lg font-semibold text-slate-900">Приватная информация</h2>
            <p className="text-sm text-slate-500">Видна только администрации для верификации</p>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">ФИО полностью</label>
              <input
                type="text"
                name="fullName"
                value={profile.fullName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Иванов Иван Иванович"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Телефон</label>
              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="+7 (999) 000-00-00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Страна</label>
              <input
                type="text"
                name="country"
                value={profile.country}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Россия"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Город</label>
              <input
                type="text"
                name="city"
                value={profile.city}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Москва"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Документы (Дипломы, сертификаты)</label>
              <div className="space-y-4">
                {(profile.documents || []).length > 0 && (
                  <ul className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                    {(profile.documents || []).map((doc) => (
                      <li key={doc.id} className="p-3 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900">{doc.name}</p>
                            <p className="text-xs text-slate-500">
                              {doc.type === 'diploma' ? 'Диплом' : doc.type === 'certificate' ? 'Сертификат' : 'Другое'} • {doc.date}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                            Просмотр
                          </a>
                          <button
                            type="button"
                            onClick={() => handleRemoveDocument(doc.id)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <h4 className="text-sm font-medium text-slate-900">Добавить новый документ</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={newDocName}
                      onChange={(e) => setNewDocName(e.target.value)}
                      placeholder="Название (напр. Диплом МГУ)"
                      className="px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <select
                      value={newDocType}
                      onChange={(e) => setNewDocType(e.target.value)}
                      className="px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="diploma">Диплом</option>
                      <option value="certificate">Сертификат</option>
                      <option value="other">Другое</option>
                    </select>
                    <input
                      type="url"
                      value={newDocUrl}
                      onChange={(e) => setNewDocUrl(e.target.value)}
                      placeholder="Ссылка на файл (https://...)"
                      className="sm:col-span-2 px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddDocument}
                    disabled={!newDocUrl || !newDocName}
                    className="inline-flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors font-medium shadow-sm text-sm disabled:opacity-50"
                  >
                    <Upload className="w-4 h-4" />
                    Добавить документ
                  </button>
                  <p className="mt-1 text-xs text-slate-500">
                    Загрузите фото документа на любой облачный диск и вставьте ссылку. 
                    Можно добавить водяной знак "Только для администрации MedConnect".
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
            <h2 className="text-lg font-semibold text-slate-900">Публичный профиль</h2>
            <p className="text-sm text-slate-500">Эта информация будет видна пациентам и коллегам</p>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Псевдоним / Имя</label>
              <input
                type="text"
                name="publicName"
                value={profile.publicName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Иван И. или Доктор Иван"
              />
              <p className="mt-1 text-xs text-slate-500">Достаточно человечно, но безопасно.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Специализация</label>
              <input
                type="text"
                name="specialization"
                value={profile.specialization}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Врач-хирург"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Стаж работы</label>
              <select
                name="experience"
                value={profile.experience}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="Менее 5 лет">Менее 5 лет</option>
                <option value="5-10 лет">5-10 лет</option>
                <option value="10-20 лет">10-20 лет</option>
                <option value="Более 20 лет">Более 20 лет</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Место работы (обобщенно)</label>
              <input
                type="text"
                name="workplace"
                value={profile.workplace}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Городская больница (Москва)"
              />
              <p className="mt-1 text-xs text-slate-500">Не указывайте точный номер больницы для сохранения анонимности.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Проведено операций / процедур</label>
              <input
                type="number"
                name="surgeriesCount"
                value={profile.surgeriesCount || ''}
                onChange={(e) => setProfile(prev => ({ ...prev, surgeriesCount: parseInt(e.target.value) || 0 }))}
                min="0"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Например: 1500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Консультаций (всего за практику)</label>
              <input
                type="number"
                name="consultationsCount"
                value={profile.consultationsCount || ''}
                onChange={(e) => setProfile(prev => ({ ...prev, consultationsCount: parseInt(e.target.value) || 0 }))}
                min="0"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Например: 3400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Стоимость консультации (₽)</label>
              <input
                type="number"
                name="price"
                value={profile.price || ''}
                onChange={(e) => setProfile(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                min="0"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Например: 2000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Владение языками</label>
              <input
                type="text"
                name="languages"
                value={profile.languages || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Русский, Английский"
              />
            </div>
            <div className="md:col-span-2">
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
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Биография</label>
              <textarea
                name="bio"
                value={profile.bio || ''}
                onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Расскажите о себе, своем подходе к лечению..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Образование и курсы</label>
              <textarea
                name="education"
                value={profile.education || ''}
                onChange={(e) => setProfile(prev => ({ ...prev, education: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="МГМУ им. И.М. Сеченова (2010)&#10;Ординатура по онкологии (2012)"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Регалии и награды</label>
              <textarea
                name="awards"
                value={profile.awards || ''}
                onChange={(e) => setProfile(prev => ({ ...prev, awards: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Лучший врач 2020 года&#10;Член Европейского общества медицинской онкологии (ESMO)"
              />
            </div>
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
    </div>
  );
}
