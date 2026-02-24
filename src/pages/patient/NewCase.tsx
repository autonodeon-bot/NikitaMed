import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { FileText, Upload, Sparkles, User, ShieldAlert, Clock, Bot } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

export default function NewCase() {
  const { currentUser, addCase, spendTokens, users } = useStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedDoctorId = searchParams.get('doctorId');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [consultationType, setConsultationType] = useState<'specific' | 'any' | 'ai'>(
    preselectedDoctorId ? 'specific' : 'any'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const preselectedDoctor = users.find(u => u.id === preselectedDoctorId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    // Check tokens
    let cost = 5; // Base cost for 'any'
    if (consultationType === 'specific') cost = preselectedDoctor?.doctorProfile?.price || 20;
    if (consultationType === 'ai') cost = 10;

    if (currentUser.tokens < cost) {
      alert(`Недостаточно токенов. Требуется: ${cost}, у вас: ${currentUser.tokens}`);
      return;
    }

    setIsSubmitting(true);

    let aiAnalysis = '';
    if (consultationType === 'ai') {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Проанализируй симптомы пациента и дай предварительные рекомендации. Симптомы: ${description}`,
          config: {
            systemInstruction: "Ты медицинский ассистент. Твоя задача - дать предварительный анализ симптомов. Обязательно предупреди, что это не заменяет консультацию врача.",
          }
        });
        aiAnalysis = response.text || 'Не удалось получить анализ ИИ.';
      } catch (error) {
        console.error('AI Error:', error);
        aiAnalysis = 'Ошибка при обращении к нейросети.';
      }
    }

    const newCase = {
      id: Math.random().toString(36).substring(7),
      patientId: currentUser.id,
      title,
      description,
      documents: [], // Mocking file upload for MVP
      status: consultationType === 'ai' ? ('closed' as const) : ('open' as const),
      createdAt: new Date().toISOString(),
      isAnonymous,
      aiAnalysis: consultationType === 'ai' ? aiAnalysis : undefined,
      assignedDoctorId: consultationType === 'specific' ? preselectedDoctorId || undefined : undefined
    };

    if (spendTokens(currentUser.id, cost)) {
      addCase(newCase);
      navigate(`/cases/${newCase.id}`);
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Новое обращение</h1>
        <p className="text-slate-500 mt-1">Опишите вашу проблему или загрузите анализы</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-slate-900">Тип консультации</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {preselectedDoctor && (
                <label className={`relative flex cursor-pointer rounded-xl border p-4 shadow-sm focus:outline-none ${consultationType === 'specific' ? 'border-indigo-600 ring-1 ring-indigo-600 bg-indigo-50/50' : 'border-slate-300 bg-white hover:bg-slate-50'}`}>
                  <input type="radio" name="consultationType" value="specific" className="sr-only" checked={consultationType === 'specific'} onChange={() => setConsultationType('specific')} />
                  <span className="flex flex-1">
                    <span className="flex flex-col">
                      <span className="block text-sm font-medium text-slate-900 flex items-center gap-2">
                        <User className="w-4 h-4 text-indigo-600" />
                        Конкретный врач
                      </span>
                      <span className="mt-1 flex items-center text-sm text-slate-500">
                        Очередь к {preselectedDoctor.doctorProfile?.publicName}
                      </span>
                      <span className="mt-2 text-sm font-medium text-indigo-600">
                        {preselectedDoctor.doctorProfile?.price || 20} токенов
                      </span>
                    </span>
                  </span>
                </label>
              )}
              
              <label className={`relative flex cursor-pointer rounded-xl border p-4 shadow-sm focus:outline-none ${consultationType === 'any' ? 'border-indigo-600 ring-1 ring-indigo-600 bg-indigo-50/50' : 'border-slate-300 bg-white hover:bg-slate-50'}`}>
                <input type="radio" name="consultationType" value="any" className="sr-only" checked={consultationType === 'any'} onChange={() => setConsultationType('any')} />
                <span className="flex flex-1">
                  <span className="flex flex-col">
                    <span className="block text-sm font-medium text-slate-900 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-600" />
                      Любой свободный врач
                    </span>
                    <span className="mt-1 flex items-center text-sm text-slate-500">
                      Быстрый ответ от первого освободившегося специалиста
                    </span>
                    <span className="mt-2 text-sm font-medium text-emerald-600">
                      5 токенов
                    </span>
                  </span>
                </span>
              </label>

              <label className={`relative flex cursor-pointer rounded-xl border p-4 shadow-sm focus:outline-none ${consultationType === 'ai' ? 'border-indigo-600 ring-1 ring-indigo-600 bg-indigo-50/50' : 'border-slate-300 bg-white hover:bg-slate-50'}`}>
                <input type="radio" name="consultationType" value="ai" className="sr-only" checked={consultationType === 'ai'} onChange={() => setConsultationType('ai')} />
                <span className="flex flex-1">
                  <span className="flex flex-col">
                    <span className="block text-sm font-medium text-slate-900 flex items-center gap-2">
                      <Bot className="w-4 h-4 text-amber-500" />
                      Нейроответ (ИИ)
                    </span>
                    <span className="mt-1 flex items-center text-sm text-slate-500">
                      Мгновенный предварительный анализ от нейросети
                    </span>
                    <span className="mt-2 text-sm font-medium text-amber-600">
                      10 токенов
                    </span>
                  </span>
                </span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Краткий заголовок проблемы</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Например: Расшифровка анализа крови или Боли в спине"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Подробное описание</label>
            <textarea
              required
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Опишите симптомы, когда они начались, что принимали..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Документы и анализы</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-slate-400" />
                <div className="flex text-sm text-slate-600 justify-center">
                  <span className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                    Загрузить файлы
                  </span>
                  <p className="pl-1">или перетащите их сюда</p>
                </div>
                <p className="text-xs text-slate-500">PNG, JPG, PDF до 10MB</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="anonymous"
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-slate-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="anonymous" className="font-medium text-slate-700 flex items-center gap-1">
                  Анонимный запрос <ShieldAlert className="w-4 h-4 text-slate-400" />
                </label>
                <p className="text-slate-500">Врачи не увидят ваше имя, только медицинские данные.</p>
              </div>
            </div>
          </div>

          <div className="pt-6 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center py-2.5 px-6 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-70"
            >
              {isSubmitting ? 'Создание...' : 'Опубликовать запрос'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
